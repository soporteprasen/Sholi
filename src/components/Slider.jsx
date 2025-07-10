"use client";

import { useEffect, useRef, useState } from "react";
import { Zap, ShieldCheck, ArrowLeftRight } from "lucide-react"; // 👈 Íconos nuevos PRO
import { obtenerMarcas, ObtenerImagenProducto, RecorrerCarpetaImagenes } from "@/lib/api";

export default function Slider({ contenido = [], modo = "certificado", intervalo = 4000 }) {
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const [marcasProcesadas, setMarcasProcesadas] = useState([]);
  const [certificadosProcesados, setCertificadosProcesados] = useState([]);

  useEffect(() => {
    const cargarMarcas = async () => {
      try {
        const marcas = await obtenerMarcas();
        const procesadas = await Promise.all(
          marcas.map(async (marca) => {
            try {
              const blob = await ObtenerImagenProducto(marca.imagen_marca);
              const url = URL.createObjectURL(blob);
              return { ...marca, imagenUrlTemporal: url };
            } catch (error) {
              console.error("Error cargando imagen de marca:", marca.nombre);
              return { ...marca, imagenUrlTemporal: "" };
            }
          })
        );

        setMarcasProcesadas(procesadas);
      } catch (e) {
        console.error("Error al obtener marcas:", e);
      }
    };

    if (modo === "marcas") {
      cargarMarcas();
    }
  }, [modo]);

  useEffect(() => {
    const cargarCertificados = async () => {
      try {
        const urls = await RecorrerCarpetaImagenes("imagenes/certificados");
        const procesados = await Promise.all(
          urls.map(async (ruta) => {
            try {
              const blob = await ObtenerImagenProducto(ruta.urlImagen);
              const url = URL.createObjectURL(blob);
              return { imagenUrlTemporal: url };
            } catch {
              console.error("Error cargando imagen de certificado:", ruta);
              return { imagenUrlTemporal: "/not-found.webp" };
            }
          })
        );

        setCertificadosProcesados(procesados);
      } catch (e) {
        console.error("Error al cargar certificados:", e);
      }
    };

    if (modo === "certificado") {
      cargarCertificados();
    }
  }, [modo]);


  const elementosVisibles =
    modo === "marcas"
      ? [...marcasProcesadas, ...marcasProcesadas, ...marcasProcesadas]
      : modo === "certificado"
      ? certificadosProcesados
      : contenido;

  // Autoplay para modo "marcas"
  useEffect(() => {
    if (modo !== "marcas" || !scrollRef.current) return;

    const container = scrollRef.current;
    const itemWidth = 220;

    const startPosition = contenido.length * itemWidth;
    container.scrollLeft = startPosition;

    const autoplay = setInterval(() => {
      container.scrollBy({ left: itemWidth, behavior: "smooth" });

      if (container.scrollLeft >= container.scrollWidth - container.offsetWidth - itemWidth) {
        container.scrollTo({ left: startPosition, behavior: "auto" });
      }
    }, intervalo);

    return () => clearInterval(autoplay);
  }, [modo, intervalo, contenido.length]);

  const clickPrevented = useRef(false);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    clickPrevented.current = false;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollStart.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX.current;
    if (Math.abs(walk) > 5) clickPrevented.current = true;
    scrollRef.current.scrollLeft = scrollStart.current - walk;
  };

  const stopDrag = (e) => {
    if (clickPrevented.current) {
      e.preventDefault();
      e.stopPropagation();
    }
    isDragging.current = false;
  };

  return (
    <section
      className="py-12 bg-white text-center select-none relative"
      aria-labelledby="slider-title"
    >
      {/* Título con ícono decorativo */}
      <h2 id="slider-title" className="flex justify-center items-center text-xl md:text-2xl font-semibold text-blue-900 mb-10 gap-3 px-4">
        {/* Ícono decorativo, aria-hidden para no ensuciar SEO */}
        {modo === "certificado" ? (
          <ShieldCheck className="text-green-600 w-8 h-8" aria-hidden="true" />
        ) : (
          <Zap className="text-yellow-500 w-8 h-8" aria-hidden="true" />
        )}
        {modo === "certificado"
          ? "Nuestros productos eléctricos respaldados por certificaciones"
          : "Marcas que representamos"}
      </h2>

      {/* Swipe Indicator SOLO en Mobile */}
      <div className="absolute top-2 left-2 flex items-center gap-2 md:hidden text-gray-700 text-xs">
        <ArrowLeftRight className="w-4 h-4 animate-bounce-x" aria-hidden="true" />
        <span>Desliza</span>
      </div>

      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        className="overflow-x-auto scroll-smooth no-scrollbar cursor-grab active:cursor-grabbing"
      >
        <div className="inline-flex gap-6 px-4 mx-auto snap-x snap-mandatory hover: cursor-">
          {elementosVisibles.map((item, i) => {
            const imagen = (
              <img
                src={item.imagenUrlTemporal || "/not-found.webp"}
                alt={item.nombre || item.NombreArchivo}
                className="object-contain max-w-[215px] max-h-[215px]"
                draggable={false}
              />
            );

            const contenido =
              modo === "certificado" ? (
                imagen
              ) : (
                <a
                  href={`/tienda/${item.slug_marca}`}
                  onClick={(e) => {
                    if (clickPrevented.current) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                  className="flex flex-col items-center text-center hover:opacity-90 transition"
                  draggable={false}
                >
                  {imagen}
                </a>
              );

            return (
              <div
                key={i}
                className="flex-shrink-0 snap-start bg-white rounded-xl flex items-center justify-center"
                style={{ minWidth: "200px", minHeight: "190px" }}
              >
                {contenido}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
