import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CarruselBase({ id, imagenes, ancho, alto, sizes }) {
  return (
    <section
      id={id}
      className="relative w-full overflow-hidden aspect-[1/1] sm:aspect-[3.84/1]"
      aria-label="Carrusel principal"
      role="region"
      aria-roledescription="carrusel"
    >
      <ul className="relative w-full h-full">
        {imagenes.map((img, i) => (
          <li
            key={i}
            id={`${id}-slide-${i}`}
            className={`absolute inset-0 ${i === 0 ? "" : "transition-opacity duration-700"} ${
              i === 0 ? "opacity-100" : "opacity-0"
            }`}
            data-carousel-item
            aria-roledescription="slide"
            aria-label={`Slide ${i + 1} de ${imagenes.length}`}
          >
            <div className="relative w-full h-full">
              <Image
                src={img.src}
                alt={img.alt || `Imagen promocional ${i + 1}`}
                fill
                sizes={sizes || "(max-width: 639px) 100vw, (max-width: 1023px) 100vw, 1520px"}
                className="object-cover"
                priority={i === 0}
                fetchPriority={i === 0 ? "high" : undefined}
                loading={i === 0 ? "eager" : "lazy"}
                draggable={false}
              />
            </div>
          </li>
        ))}
      </ul>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {imagenes.map((_, i) => (
          <button
            key={i}
            className="w-3 h-3 rounded-full bg-white/70"
            aria-current={i === 0 ? "true" : "false"}
            aria-label={`Ir al slide ${i + 1}`}
            aria-controls={`${id}-slide-${i}`}
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
