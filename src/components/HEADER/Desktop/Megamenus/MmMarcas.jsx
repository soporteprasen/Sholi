import Link from "next/link";
import Image from "next/image";
import { obtenerMarcas } from "@/lib/api";

export default async function MmMarcas() {
  try {
    const data = await obtenerMarcas();
    const marcasValidas = data.filter((m) => m.valorConsulta === "1");

    const marcasConLogo = marcasValidas.map((marca) => {
      const tieneImagen =
        marca.imagen_marca && marca.imagen_marca.trim() !== "";

      const logo = tieneImagen
        ? process.env.NEXT_PUBLIC_SIGNALR_URL + marca.imagen_marca
        : "/not-found.webp";

      return {
        nombre: marca.nombre,
        slug_marca: marca.slug_marca,
        logo,
      };
    });

    return (
      <div className="p-6 grid grid-cols-5 gap-4 w-[900px] max-w-[95vw] mx-auto">
        {marcasConLogo.map((marca, index) => (
          <Link
            key={index}
            href={`/tienda/${marca.slug_marca}`}
            className="flex flex-col items-center text-center hover:opacity-90 transition"
          >
            <div className="w-10 h-10 relative mb-1">
              <Image
                src={marca.logo}
                alt={`Logo de la marca ${marca.nombre}`}
                fill
                className="object-contain"
                sizes="40px"
              />
            </div>
            <span className="text-sm text-gray-700" itemProp="name">
              {marca.nombre}
            </span>
          </Link>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error al cargar marcas:", error);
    return null;
  }
}
