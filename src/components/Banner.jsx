import Image from "next/image";
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

export default async function Banner() {
  const rutaImagen = "/banner/BANNER-DE-DESCUENTO-EN-MARCA-ALEX-WEB.webp";
  const existe = await imagenExiste(rutaImagen);
  const imagenFinal = existe ? rutaImagen : "/not-found.webp";

  return (
    <section
      className="py-6 bg-white text-center"
      role="region"
      aria-label="Banner de promoción de marca ALEX"
    >
      <div className="w-full max-w-[1520px] mx-auto relative aspect-[1520/210]">
        <Image
          src={imagenFinal}
          alt="Descuento exclusivo en productos de la marca ALEX"
          fill
          className="object-cover"
          sizes="(max-width: 767px) 430px, 1520px"
          loading="eager"
        />
      </div>
    </section>
  );
}
