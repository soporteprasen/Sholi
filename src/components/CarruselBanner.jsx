import { ChevronLeft,ChevronRight} from "lucide-react";

export default function CarruselBanner({ imagenes }) {
  return (
    <section
      id="banner-carousel"
      className="relative w-full aspect-[3.84/1] overflow-hidden"
      aria-label="Carrusel principal"
    >
      {/* Slides */}
      {imagenes.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === 0 ? "opacity-100" : "opacity-0"
          }`}
          data-carousel-item
        >
          <picture>
            <source media="(max-width:768px)" srcSet={img.mobile} />
            <img
              src={img.desktop}
              alt={img.alt}
              className="w-full h-full object-cover"
              loading="eager"
              draggable={false}
            />
          </picture>
        </div>
      ))}

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
        <ChevronLeft/>
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
