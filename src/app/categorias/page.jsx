// app/categorias/page.jsx
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight } from "lucide-react";
import { obtenerCategorias } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Categorías de Materiales Eléctricos | Tienda Online",
  description: "Explora nuestras principales categorías de productos eléctricos industriales, comerciales y residenciales.",
  keywords: [
    "categorías eléctricas",
    "material eléctrico por categoría",
    "canaletas eléctricas",
    "tableros eléctricos",
    "tienda de electricidad",
    "productos eléctricos Perú",
  ],
  openGraph: {
    title: "Categorías de Materiales Eléctricos",
    description: "Descubre nuestras categorías destacadas en productos eléctricos industriales y residenciales.",
    url: "https://www.sholi.com/categorias",
    siteName: "Sholi Iluminación",
    images: [
      {
        url: "https://www.sholi.com/opengraph/categorias-banner.webp",
        width: 1200,
        height: 630,
        alt: "Categorías de productos eléctricos en Sholi",
      },
    ],
    locale: "es_PE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Categorías de Productos Eléctricos | Sholi Perú",
    description: "Productos eléctricos organizados por categorías. Compra online con envío a todo Perú.",
    images: ["https://www.sholi.com/opengraph/categorias-banner.webp"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  alternates: {
    canonical: "https://www.sholi.com/categorias",
  },
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
    <>
      <Script id="schema-categorias" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Categorías de productos eléctricos",
          description: "Listado de categorías de productos eléctricos en Sholi Perú.",
          url: "https://www.sholi.com/categorias",
        })}
      </Script>

      <main className="bg-white py-10 px-4">
        <div className="max-w-[1520px] mx-auto">
          {/* Banner visual arriba, pero h1 está primero en HTML */}
          <div className="flex flex-col mb-8" aria-hidden="true">
            <div className="w-full max-w-[1520px] mx-auto rounded-xl overflow-hidden">
              {/* Desktop */}
              <div className="hidden md:block relative aspect-[1520/280]">
                <Image
                  src="/banners-paginas/Banner-Tienda-Categorias.webp"
                  alt="Banner promocional de categorías eléctricas"
                  fill
                  className="object-cover"
                  priority
                  sizes="(min-width: 768px) 1520px"
                />
              </div>

              {/* Mobile */}
              <div className="block md:hidden relative aspect-[430/150]">
                <Image
                  src="/banners-paginas/Categorias-Mobil.webp"
                  alt="Banner promocional de categorías eléctricas"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 767px) 430px"
                />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-blue-900 text-center mt-4">
              Categorías de Materiales Eléctricos
            </h1>
          </div>

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
                  <Link
                    href={`/categoria/${cat.slug_categoria}`}
                    key={cat.id_categoria}
                    aria-label={`Ver productos de la categoría ${cat.nombre}`}
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
                      {cat.descripcion && (
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {cat.descripcion}
                        </p>
                      )}
                      <span className="flex justify-center items-center gap-2 text-blue-500 mt-2 text-sm font-medium transition group-hover:underline">
                        Ver productos
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                ))}
          </section>
        </div>
      </main>
    </>
  );
}
