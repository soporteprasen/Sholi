// app/categorias/page.jsx
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight } from "lucide-react";
import { obtenerCategorias } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import WspFlot from "@/components/WspFlot";

export const metadata = {
  title: "Categorías de Materiales Eléctricos | Sholi Perú",
  description:
    "Explora nuestras principales categorías de productos eléctricos industriales, comerciales y residenciales en Sholi. Compra online con envío a todo el Perú.",
  keywords: [
    "categorías eléctricas",
    "material eléctrico por categoría",
    "canaletas eléctricas",
    "tableros eléctricos",
    "tienda de electricidad",
    "productos eléctricos Perú",
  ],
  openGraph: {
    title: "Categorías de Materiales Eléctricos | Sholi",
    description:
      "Descubre nuestras categorías destacadas en productos eléctricos industriales y residenciales. Compra online fácil y seguro.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/categorias`,
    siteName: "Sholi Iluminación",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/banners-paginas/Banner-Tienda-Categorias.webp`,
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
    site: "@sholi_iluminacion",
    title: "Categorías de Productos Eléctricos | Sholi Perú",
    description:
      "Productos eléctricos organizados por categorías. Compra online con envío a todo el Perú.",
    images: [
      `${process.env.NEXT_PUBLIC_SITE_URL}/banners-paginas/Banner-Tienda-Categorias.webp`,
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  alternates: {
    canonical:
      `${process.env.NEXT_PUBLIC_SITE_URL}/categorias`,
  },
  category: "ecommerce",
};


export default async function PaginaCategorias() {
  const getVariant = (url, size) =>
    url.replace("/original/", `/${size}/`);

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
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/categorias`,
        })}
      </Script>


      <main className="bg-white py-10 px-4">
        <div className="max-w-[1520px] mx-auto">
          {/* Banner visual arriba, pero h1 está primero en HTML */}
          <div className="flex flex-col mb-8" aria-hidden="true">
            <h1 className="text-3xl md:text-4xl font-bold text-center mt-4 bg-gradient-to-r from-[#7c141b] to-[#3C1D2A] bg-clip-text text-transparent">
              Categorías de Materiales Eléctricos
            </h1>
          </div>

          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
            Explora nuestras principales categorías de productos eléctricos, desde canaletas hasta tableros. Encuentra todo lo que necesitas para tus proyectos industriales, comerciales y residenciales.
          </p>

          <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
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
                  <div className="w-full relative overflow-hidden">
                    <Image
                      src={getVariant(cat.imagen_categoria, "original")} // fallback original
                      alt={cat.nombre}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      width={278}
                      height={199}
                      loading="lazy"
                      unoptimized
                      sizes="(max-width: 639px) 134px, 278px"
                      srcSet={`
                        ${getVariant(cat.imagen_categoria, "sm")} 134w,
                        ${getVariant(cat.imagen_categoria, "original")} 278w
                      `}
                    />
                  </div>
                  <div className="p-4 text-center">
                    {/* Nombre categoría */}
                    <h2 className="text-lg font-semibold text-[#3C1D2A] mb-1 line-clamp-2">
                      {cat.nombre}
                    </h2>

                    {/* Descripción */}
                    {cat.descripcion && (
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {cat.descripcion}
                      </p>
                    )}

                    {/* Link */}
                    <span className="flex justify-center items-center gap-2 text-[#7c141b] mt-2 text-sm font-medium transition group-hover:text-[#3C1D2A] group-hover:underline">
                      Ver productos
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              ))}
          </section>
        </div>
      </main>
      <WspFlot/>
    </>
  );
}
