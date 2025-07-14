// app/categorias/page.jsx
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { obtenerCategorias } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Categorías de Materiales Eléctricos | Tienda Online",
  description: "Explora nuestras principales categorías de productos eléctricos industriales, comerciales y residenciales.",
};

export default async function PaginaCategorias() {
  let categorias = [];

  try {
    const data = await obtenerCategorias();
    const categoriasValidas = data.filter((cat) => cat.valorConsulta === "1");

    categorias = await Promise.all(
      categoriasValidas.map(async (cat) => {
        let imagenUrl = "/not-found.webp";

        if (cat.imagen_categoria) {
          imagenUrl = `${process.env.NEXT_PUBLIC_SIGNALR_URL}/${cat.imagen_categoria}`;
        }

        return {
          ...cat,
          imagen_categoria: imagenUrl,
        };
      })
    );
  } catch (error) {
    console.error("Error al cargar categorías:", error);
  }

  return (
    <main className="bg-white py-10 px-4">
      <div className="max-w-[1520px] mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 text-center mb-4">
          Categorías de Materiales Eléctricos
        </h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
          Explora nuestras principales categorías de productos eléctricos, desde canaletas hasta tableros. Encuentra todo lo que necesitas para tus proyectos industriales, comerciales y residenciales.
        </p>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {categorias.length === 0
            ? Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="border rounded-xl overflow-hidden shadow-sm bg-white"
                >
                  <Skeleton className="w-full aspect-[1/1.1]" />
                  <div className="p-4 space-y-2 text-center">
                    <Skeleton className="h-5 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-5/6 mx-auto" />
                    <Skeleton className="h-4 w-2/3 mx-auto" />
                    <Skeleton className="h-5 w-1/2 mx-auto mt-4" />
                  </div>
                </div>
              ))
            : categorias.map((cat) => (
                <a
                  href={`/categoria/${cat.slug_categoria}`}
                  key={cat.id_categoria}
                  className="group block border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition"
                >
                  <div className="w-full aspect-[1/1.1] relative overflow-hidden">
                    <Image
                      src={cat.imagen_categoria}
                      alt={cat.nombre}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      width={400}
                      height={440}
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h2 className="text-lg font-semibold text-blue-800 mb-1 line-clamp-2">
                      {cat.nombre}
                    </h2>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {cat.descripcion}
                    </p>
                    <span className="flex justify-center items-center gap-2 text-blue-500 mt-2 text-sm font-medium transition group-hover:underline">
                      Ver productos
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </span>
                  </div>
                </a>
              ))}
        </section>
      </div>
    </main>
  );
}
