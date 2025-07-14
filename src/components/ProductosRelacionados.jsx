"use client";

import { useEffect, useRef, useState } from "react";
import { ObtenerProductoRelacionados, ObtenerImagenProducto } from "@/lib/api";

export default function ProductosRelacionados({ idProducto }) {
  const [relacionados, setRelacionados] = useState([]);
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Scroll con mouse (arrastrar)
  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2; // velocidad del arrastre
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  // Cargar productos
  useEffect(() => {
    if (!idProducto) return;

    const cargarRelacionados = async () => {
      const data = await ObtenerProductoRelacionados(idProducto);
      const productosConBlobs = await Promise.all(
        data.map(async (prod) => {
          let url1 = "";
          try {
            const urlFinal = prod.urlImagen1?.trim() || "/Default.webp";
            const blob1 = await ObtenerImagenProducto(urlFinal);
            url1 = URL.createObjectURL(blob1);
          } catch {
            console.error("⚠️ Imagen no cargada:", prod.nombre);
          }
          return { ...prod, urlImagen1: url1 };
        })
      );

      setRelacionados(productosConBlobs);
    };

    cargarRelacionados();
  }, [idProducto]);

  return (
    <div className="mt-8">
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
          const precioFinal = item.precio - (item.precio * item.descuento / 100);
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
                  alt={item.nombre}
                  className="absolute inset-0 w-full h-full object-contain"
                  loading="lazy"
                  draggable="false"
                />
              </div>

              <div className="p-3 flex flex-col flex-grow justify-between">
                <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 break-words">
                  {item.nombre}
                </h3>
                <p className="text-gray-500 text-xs line-clamp-2">{item.descripcion}</p>

                <div className="mt-3">
                  {item.descuento > 0 ? (
                    <>
                      <p className="text-gray-400 text-sm line-through">S/. {item.precio.toFixed(2)}</p>
                      <p className="text-green-700 font-bold text-base">
                        S/. {precioFinal.toFixed(2)}
                      </p>
                      <span className="inline-block mt-1 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded font-semibold">
                        -{item.descuento}% OFF
                      </span>
                    </>
                  ) : (
                    <p className="text-indigo-700 font-bold text-sm">S/. {item.precio.toFixed(2)}</p>
                  )}
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
