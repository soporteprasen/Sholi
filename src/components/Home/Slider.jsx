import Image from "next/image";
import Link from "next/link";
import { promises as fs } from "fs";
import path from "path";

async function imagenExiste(rutaRelativa) {
  try {
    const rutaAbsoluta = path.join(process.cwd(), "public", rutaRelativa);
    await fs.access(rutaAbsoluta);
    return true;
  } catch {
    return false;
  }
}

export default async function Slider({ contenido = [], modo = "certificado" }) {
  const isMarcas = modo === "marcas";
  const isCertificados = modo === "certificado";

  const elementosVisibles = isMarcas
    ? [...contenido, ...contenido, ...contenido]
    : contenido;

  let contenidoValidado = elementosVisibles;

  if (isCertificados) {
    contenidoValidado = await Promise.all(
      elementosVisibles.map(async (item) => {
        const rawSrc = item.imagenUrlTemporal || item.imagen || item.url || "";
        const src = rawSrc.startsWith("/") ? rawSrc : `/${rawSrc}`;

        const existe = await imagenExiste(src);
        const imagenFinal = existe ? src : "/not-found.webp";

        return { ...item, imagenFinal };
      })
    );
  }

  return (
    <section
      role="region"
      aria-label={isCertificados ? "Certificaciones de productos" : "Marcas representadas"}
      className="py-12 text-center select-none relative"
      data-slider={modo}
    >
      <h2 className="flex justify-center items-center text-xl md:text-2xl font-bold mb-10 gap-3 px-4 bg-gradient-to-r from-[#7c141b] to-[#3C1D2A] bg-clip-text text-transparent">
        {isCertificados ? (
          <svg
            className="text-[#7c141b] w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M5 13l4 4L19 7" strokeWidth="2" />
          </svg>
        ) : (
          <svg
            className="text-[#3C1D2A] w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2" />
          </svg>
        )}
        {isCertificados
          ? "Nuestros productos eléctricos respaldados por certificaciones"
          : "Marcas que representamos"}
      </h2>

      <div className="slider-scroll overflow-x-auto scroll-smooth no-scrollbar cursor-grab active:cursor-grabbing">
        <div className="slider-contenido inline-flex gap-6 px-4 mx-auto snap-x snap-mandatory">
          {(isCertificados ? contenidoValidado : elementosVisibles).map((item, i) => (
            <div
              key={i}
              className="flex-shrink-0 snap-start bg-white rounded-xl flex items-center justify-center border border-gray-200 hover:border-[#7c141b] hover:shadow-lg transition"
              style={{ minWidth: "200px", minHeight: "190px" }}
            >
              {isMarcas ? (
                <Link
                  href={`/tienda/${item.slug_marca}`}
                  className="flex flex-col items-center hover:opacity-90 transition"
                  draggable={false}
                >
                  <div className="relative w-[108px] h-[108px]">
                    <Image
                      src={item.imagen || item.url || "/not-found.webp"}
                      alt={item.nombre || item.NombreArchivo || "Marca"}
                      fill
                      unoptimized
                      className="object-contain"
                      sizes="108px"
                      draggable={false}
                    />
                  </div>
                </Link>
              ) : (
                <div className="relative w-[215px] h-[108px]">
                  <Image
                    src={item.imagenFinal}
                    alt={item.nombre || item.NombreArchivo || "Certificación"}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 215px, 215px"
                    loading={i === 0 ? "eager" : "lazy"}
                    draggable={false}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
