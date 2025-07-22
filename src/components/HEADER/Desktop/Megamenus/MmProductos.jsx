import Link from "next/link";
import Image from "next/image";
import { obtenerCategorias } from "@/lib/api";

export default async function MmProductos() {
  const data = await obtenerCategorias();
  const categoriasValidas = data.filter((c) => c.valorConsulta === "1");

  const categoriasConLogo = categoriasValidas.map((categoria) => {
    const tieneImagen =
      categoria.imagen_categoria && categoria.imagen_categoria.trim() !== "";

    const logo = tieneImagen
      ? process.env.NEXT_PUBLIC_SIGNALR_URL + categoria.imagen_categoria
      : "/not-found.webp";

    return {
      nombre: categoria.nombre,
      slug_categoria: categoria.slug_categoria,
      logo,
    };
  });

  return (
    <div className="p-6 grid grid-cols-5 gap-4 w-[900px] max-w-[95vw] mx-auto">
      {categoriasConLogo.map((cat) => (
        <Link
          key={cat.slug_categoria}
          href={`/categoria/${cat.slug_categoria}`}
          className="flex flex-col items-center text-center hover:opacity-90 transition"
        >
          <div className="w-10 h-10 relative">
            <Image
              src={cat.logo}
              alt={cat.nombre}
              fill
              className="object-contain"
              sizes="40px"
            />
          </div>
          <span className="text-sm text-gray-700">{cat.nombre}</span>
        </Link>
      ))}
    </div>
  );
}
