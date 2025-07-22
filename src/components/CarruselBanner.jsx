// 📁 CarruselBanner.jsx o .tsx
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { headers } from "next/headers";
import { promises as fs } from "fs";
import path from "path";

{/*  Validar si la imagen realmente existe en /public */ }
async function imagenExiste(rutaRelativa) {
  try {
    const rutaAbsoluta = path.join(process.cwd(), "public", rutaRelativa);
    await fs.access(rutaAbsoluta);
    return true;
  } catch {
    return false;
  }
}

export default async function CarruselBanner({ imagenes }) {
  const cabeceras = await headers();
  const userAgent = cabeceras.get("user-agent") || "";
  const esMobile = userAgent.toLowerCase().includes("mobile");

  const ancho = esMobile ? 412 : 1335;
  const alto = esMobile ? 412 : 348;

  const imagenesProcesadas = await Promise.all(
    imagenes.map(async (img) => {
      const srcRelativo = esMobile ? img.mobile : img.desktop;
      const rutaRelativa = srcRelativo.startsWith("/") ? srcRelativo : `/${srcRelativo}`;

      const existe = await imagenExiste(rutaRelativa);
      const imagenFinal = existe ? rutaRelativa : "/not-found-banner.webp";

      return { ...img, imagenFinal };
    })
  );

  return (
    <section
      id="banner-carousel"
      className="relative w-full overflow-hidden aspect-[1/1] sm:aspect-[3.84/1]"
      aria-label="Carrusel principal"
      role="region"
      aria-roledescription="carrusel"
    >
      <ul className="relative w-full h-full">
        {imagenesProcesadas.map((img, i) => (
          <li
            key={i}
            id={`slide-${i}`}
            className={`absolute inset-0 transition-opacity duration-700 ${i === 0 ? "opacity-100" : "opacity-0"
              }`}
            data-carousel-item
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${i + 1} de ${imagenes.length}`}
          >
            <Image
              src={img.imagenFinal}
              alt={img.alt || `Imagen promocional ${i + 1}`}
              width={ancho}
              height={alto}
              sizes={esMobile ? "412px" : "(max-width: 768px) 412px, 1335px"}
              className="w-full h-full object-cover"
              priority={i === 0}
              fetchPriority={i === 1 ? "high" : "auto"}
              draggable={false}
            />
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
            aria-controls={`slide-${i}`}
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
