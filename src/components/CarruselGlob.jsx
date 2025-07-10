"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart, Eye } from "lucide-react";
import { obtenerProductosConDescuento, obtenerCategorias, ObtenerImagenProducto, RecorrerCarpetaImagenes } from "@/lib/api";

export default function Carrusel({intervalo = 5000, modelo = "banner" }) {
  const [indexActual, setIndexActual] = useState(0);
  const [data, setData] = useState([]);
  const scrollRef = useRef(null);
  const timeoutRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const [scrollable, setScrollable] = useState(false);
  const isCategoria = modelo === "categoria";
  const isProducto = modelo === "producto";
 
  useEffect(() => {
    const cargarContenido = async () => {
      try {
        if (modelo === "producto") {
          const productos = await obtenerProductosConDescuento();
          const productosConBlobs = await Promise.all(
            productos.map(async (producto) => {
              let url1 = "";
              let url2 = "";

              try {
                if (producto.urlImagen2 === "" || producto.urlImagen2 !== null) {
                  const blob1 = await ObtenerImagenProducto(producto.urlImagen1);
                  url1 = URL.createObjectURL(blob1);
                }
                if (producto.urlImagen2 === "" || producto.urlImagen2 !== null) {
                  const blob2 = await ObtenerImagenProducto(producto.urlImagen2);
                  url2 = URL.createObjectURL(blob2);
                }
              } catch (e) {
                console.error("Error al cargar imágenes de producto", producto.nombre, producto.id_producto);
              }

              return {
                ...producto,
                urlImagen1: url1,
                urlImagen2: url2
              };
            })
          );

          setData(productosConBlobs);
        } else if (modelo === "categoria") {
          const categorias = await obtenerCategorias();
          const categoriasConBlobs = await Promise.all(
            categorias.map(async (cat, index) => {
              let imagenUrl = ""; 

              try {
                if (cat.imagen_categoria === "" || cat.imagen_categoria !== null) {
                  const blob = await ObtenerImagenProducto(cat.imagen_categoria);
                  imagenUrl = URL.createObjectURL(blob);
                }
              } catch (e) {
                console.error("Error cargando imagen de categoría", cat.nombre);
              }

              return {
                ...cat,
                imagen: imagenUrl
              };
            })
          );

          setData(categoriasConBlobs);
        } else if (modelo === "banner") {
          const rutas = await RecorrerCarpetaImagenes("imagenes/carrucel");
          const procesados = await Promise.all(
            rutas.map(async (ruta) => {
              try {
                const blob = await ObtenerImagenProducto(ruta.urlImagen);
                const url = URL.createObjectURL(blob);
                return url;
              } catch {
                console.error("Error cargando imagen de banner:", ruta.urlImagen);
                return "/not-found.webp";
              }
            })
          );

          setData(procesados);
          setTimeout(verificarScroll, 50);
        }
      } catch (error) {
        
      }
    };

    cargarContenido();
  }, [modelo]);

  const siguiente = useCallback(() => {
    if (modelo === "banner") {
      setIndexActual((prev) => (prev + 1) % data.length);
    } else {
      scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
    }
  }, [data.length, modelo]);

  const anterior = useCallback(() => {
    if (modelo === "banner") {
      setIndexActual((prev) => (prev === 0 ? data.length - 1 : prev - 1));
    } else {
      scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
    }
  }, [data.length, modelo]);

  useEffect(() => {
    if (modelo === "banner" && data.length > 0) {
      timeoutRef.current = setTimeout(siguiente, intervalo);
      return () => clearTimeout(timeoutRef.current);
    }
  }, [indexActual, siguiente, intervalo, data.length, modelo]);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftStart.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX.current;
    scrollRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const stopDrag = () => {
    isDragging.current = false;
  };

  const verificarScroll = () => {
    if (scrollRef.current) {
      const tieneScroll = scrollRef.current.scrollWidth > scrollRef.current.clientWidth;
      setScrollable(tieneScroll);
    }
  };

  useEffect(() => {
    if (data.length > 0 && (isProducto || isCategoria)) {
      verificarScroll();
    }
  }, [data, isProducto, isCategoria]);

  useEffect(() => {
    if (scrollRef.current && (isProducto || isCategoria)) {
      // Resetear scroll a la izquierda al montar datos
      scrollRef.current.scrollLeft = 0;
    }
  }, [data.length, isProducto, isCategoria]);

  useEffect(() => {
    const handleResize = () => verificarScroll();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (modelo === "banner") {
    return (
      <section
        aria-label="Carrusel de banners"
        className="relative w-full aspect-[3.84/1] overflow-hidden group"
        onMouseLeave={stopDrag}
        onMouseUp={stopDrag}
      >
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${indexActual * (100 / data.length)}%)`,
            width: `${data.length * 100}%`,
          }}
        >
          {data.map((urlImagen, i) => (
            <div
              key={i}
              className="relative flex-shrink-0 h-full"
              style={{ width: `${100 / data.length}%` }}
            >
              <img
                src={urlImagen}
                alt={`Banner ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                draggable="false"
              />
            </div>
          ))}
        </div>

        {/* Botones de navegación */}
        <button
          onClick={anterior}
          aria-label="Anterior"
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10 hover:bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
        </button>
        <button
          onClick={siguiente}
          aria-label="Siguiente"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10 hover:bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Paginación */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {data.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                i === indexActual ? "bg-orange-400" : "bg-white/60"
              }`}
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className="relative w-full max-w-[1520px] mx-auto overflow-hidden" onMouseLeave={stopDrag} onMouseUp={stopDrag}>
      {scrollable && (
        <button
          onClick={anterior}
          aria-label="Anterior"
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10 hover:bg-black transition-opacity duration-300"
        >
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
        </button>
      )}

      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        className={`flex gap-4 overflow-x-auto scroll-smooth px-6 py-4 cursor-grab active:cursor-grabbing no-scrollbar ${
          scrollable ? "justify-start" : "justify-center"
        }`}
        style={{ userSelect: "none" }}
      >
        {data.map((item, index) => (
          <div
            key={index}
            className={`${
              isCategoria
                ? "w-[40vw] sm:w-[120px] md:w-[140px] bg-white rounded-lg px-3 py-4 shadow-sm hover:shadow-md transition"
                : isProducto
                ? "group w-[80vw] sm:w-[45vw] md:w-[33vw] lg:w-[280px] flex flex-col border rounded-lg overflow-hidden shadow-sm bg-white hover:shadow-md transition"
                : "min-w-[250px] max-w-[250px]"
            } shrink-0 text-center`}
          >
            {isProducto ? (
              <>
                <div className="relative aspect-[1/1] bg-gray-100">
                  <img
                    src={item.urlImagen1 || "/not-found.webp"}
                    alt={item.nombre}
                    className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500 opacity-100 group-hover:opacity-0"
                    loading="lazy"
                    draggable="false"
                  />
                  <img
                    src={item.urlImagen2 || "/not-found.webp"}
                    alt={item.nombre}
                    className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                    loading="lazy"
                    draggable="false"
                  />
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-md font-semibold leading-tight line-clamp-2">{item.nombre}</h2>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-4">{item.descripcion}</p>

                  {/* Bloque de precios con descuento */}
                  <div className="mt-auto pt-3">
                    <p className="text-gray-400 line-through text-sm">
                      S/. {item.precio.toFixed(2)}
                    </p>
                    <p className="text-green-700 font-bold text-base">
                      S/. {(item.precio - (item.precio * item.descuento / 100)).toFixed(2)}
                    </p>
                    <span className="inline-block mt-1 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded font-semibold">
                      -{item.descuento}% OFF
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-4">
                    <button className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition w-full">
                      <ShoppingCart className="w-4 h-4" />
                      <span className="text-sm font-medium">Comprar</span>
                    </button>

                    <a
                      href={`/p/${item.nombreSlug}`}
                      className="flex items-center gap-1 text-blue-600 hover:underline px-2 py-2 transition w-full justify-center"
                    >
                      <Eye className="w-4 h-4" />
                      Ver detalles
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <a
                href={`/c/${item.slug_categoria}`}
                className="block"
                draggable={false}
              >
                <img
                  src={item.imagen || "/not-found.webp"}
                  alt={item.nombre}
                  width={140}
                  height={140}
                  className="h-24 w-full object-contain mb-2"
                  loading="lazy"
                  draggable="false"
                />
                <h3 className="font-semibold text-[13px] text-gray-800 uppercase tracking-wide leading-tight line-clamp-2">
                  {item.nombre}
                </h3>
              </a>
            )}
          </div>
        ))}
      </div>
      {scrollable && (
        <button
          onClick={siguiente}
          aria-label="Siguiente"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10 hover:bg-black transition-opacity duration-300"
        >
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
