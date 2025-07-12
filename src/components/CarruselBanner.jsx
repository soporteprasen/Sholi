import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { headers } from "next/headers";

export default async function CarruselBanner({ imagenes }) {
  const cabeceras = await headers();
  const userAgent = cabeceras.get("user-agent") || "";
  const esMobile = userAgent.toLowerCase().includes("mobile");

  return (
    <section
      id="banner-carousel"
      className="relative w-full overflow-hidden aspect-square sm:aspect-[3.84/1]"
      aria-label="Carrusel principal"
    >
      {imagenes.map((img, i) => {
        const imagenSrc = esMobile ? img.mobile : img.desktop;
        const ancho = esMobile ? 412 : 1335;
        const alto = esMobile ? 412 : 348;

        return (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === 0 ? "opacity-100" : "opacity-0"
            }`}
            data-carousel-item
          >
            <Image
              src={imagenSrc}
              alt={img.alt}
              width={ancho}
              height={alto}
              sizes={esMobile ? "412px" : "(max-width: 768px) 412px, 1335px"}
              className="w-full h-full object-cover"
              priority={i === 0}
              fetchPriority={i === 1 ? "high" : "auto"}
              draggable={false}
            />
          </div>
        );
      })}

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {imagenes.map((_, i) => (
          <button
            key={i}
            className="w-3 h-3 rounded-full bg-white/70"
            aria-current={i === 0 ? "true" : "false"}
            aria-label={`Slide ${i + 1}`}
            data-carousel-slide-to={i}
          />
        ))}
      </div>

      {/* Flechas */}
      <button
        className="absolute top-0 left-0 h-full px-10 flex items-center z-20"
        data-carousel-prev
        aria-label="Anterior"
      >
        <ChevronLeft />
      </button>
      <button
        className="absolute top-0 right-0 h-full px-10 flex items-center z-20"
        data-carousel-next
        aria-label="Siguiente"
      >
        <ChevronRight />
      </button>
    </section>
  );
}
