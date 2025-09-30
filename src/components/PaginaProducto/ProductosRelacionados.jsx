"use client";

import { useEffect, useRef, useState } from "react";
import { ObtenerProductoRelacionados } from "@/lib/api";

export default function ProductosRelacionados({ idProducto }) {
  const getVariant = (url, size) =>
    url.replace("/original/", `/${size}/`);

  const [relacionados, setRelacionados] = useState([]);
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    if (!idProducto) return;

    const cargarRelacionados = async () => {
      try {
        const data = await ObtenerProductoRelacionados(idProducto);
        if (!data[0]?.id_producto?.trim()) {
          setRelacionados([]);
          return;
        }

        const productosConBlobs = await Promise.all(
          data.map(async (prod) => {
            const urlValida = prod.urlImagen1?.trim();
            const url1 = urlValida
              ? process.env.NEXT_PUBLIC_SIGNALR_URL + urlValida
              : "/not-found.webp";

            return {
              ...prod,
              urlImagen1: url1,
              precio: parseFloat(prod.precio),
              descuento: parseFloat(prod.descuento)
            };
          })
        );

        setRelacionados(productosConBlobs);
      } catch (error) {
        console.error("❌ Error al cargar productos relacionados:", error);
      }
    };

    cargarRelacionados();
  }, [idProducto]);

  return (
    <div className="mt-8 pb-4">
      {relacionados.length === 0 ? (
        <div className="w-[220px] h-[280px] flex flex-col justify-center items-center border rounded-md bg-gray-50 text-gray-500 text-sm italic shadow-sm">
          <span className="text-center px-4">No hay productos relacionados disponibles.</span>
        </div>
      ) : (
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className="flex gap-4 overflow-x-auto scroll-smooth px-4 py-4 cursor-grab active:cursor-grabbing no-scrollbar"
          style={{ userSelect: "none" }}
        >
          {relacionados.map((item, idx) => {
            const precioValido = typeof item.precio === "number" && !isNaN(item.precio);
            const descuentoValido = typeof item.descuento === "number" && !isNaN(item.descuento);
            const precioFinal = precioValido && descuentoValido
              ? item.precio - (item.precio * item.descuento / 100)
              : null;

            return (
              <a
                key={idx}
                href={`/producto/${item.nombreSlug}`}
                className="w-[220px] flex-shrink-0 border rounded-md shadow-sm bg-white hover:shadow-md transition overflow-hidden flex flex-col"
                draggable="false"
              >
                <div className="relative aspect-[1/1] bg-gray-100">
                  <img
                    src={item.urlImagen1 || "/not-found.webp"}
                    alt={item.nombre || "Producto"}
                    className="absolute inset-0 w-full h-full object-contain"
                    loading="lazy"
                    draggable="false"
                    srcSet={`
                      ${getVariant(item.urlImagen1, "md")} 190w
                    `}
                    width={218}
                    height={218}
                  />
                </div>

                <div className="p-3 flex flex-col flex-grow justify-between">
                  <p className="text-sm text-gray-500 italic">
                    Marca: <span className="font-medium text-gray-700">{item.marca || "-"}</span>
                  </p>
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 break-words">
                    {item.nombre || "Producto sin nombre"}
                  </h3>

                  <p className="text-gray-500 text-xs line-clamp-2">{item.descripcion || ""}</p>

                  {precioValido ? (
                    <div className="mt-3">
                      {item.descuento > 0 ? (
                        <>
                          <p className="text-neutral-700 line-through text-sm">
                            S/. {item.precio.toFixed(2)}
                          </p>
                          <p className="text-green-700 font-bold text-base">
                            S/. {precioFinal.toFixed(2)}
                          </p>
                          <span className="inline-block mt-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-semibold">
                            -{item.descuento}% OFF
                          </span>
                        </>
                      ) : (
                        <p className="text-green-700 font-bold text-sm">
                          S/. {item.precio.toFixed(2)}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-green-700 italic mt-3">Precio no disponible</p>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
