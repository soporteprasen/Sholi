// app/tienda/[...slug]/page.jsx
import {
  obtenerCategorias,
  obtenerMarcas,
  obtenerProductosFiltrados,
} from "@/lib/api";
import FiltrosDesktop from "@/components/FiltrosDesktop";
import FiltrosMovil from "@/components/FiltrosMovil";
import ScrollButtons from "@/components/BotonScroll";
import ProductoCard from "@/components/ProductosGrid";
import TiendaJs from "@/components/TiendaJs";
import Script from "next/script";
import Image from "next/image";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slugParts = resolvedParams?.slug || [];

  const marcaSlug = slugParts[0] || "";

  const marcas = await obtenerMarcas();
  const marcaObj = marcas.find(
    (m) => m.slug_marca?.toLowerCase() === marcaSlug?.toLowerCase()
  );

  const base = "https://prasen.pe";
  const canonical = `${base}/tienda/${marcaSlug}`;

  const title = marcaObj
    ? `Compra productos marca ${marcaObj.nombre} | Prasen`
    : "Compra productos online | Prasen";

  const description = marcaObj
    ? `Explora productos de la marca ${marcaObj.nombre}. Compra online con entrega a nivel nacional.`
    : "Explora productos online de calidad. Compra fácil y rápido con Prasen.";

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Prasen",
      locale: "es_PE",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function PaginaTiendaMarca({ params }) {
  const cantidadPorPagina = 8;

  const resolvedParams = await params;
  const slugParts = resolvedParams?.slug || [];
  const marcaSlug = slugParts[0] || "";

  // 2️⃣ Obtener marcas y categorías
  const [categorias, marcas] = await Promise.all([
    obtenerCategorias(),
    obtenerMarcas(),
  ]);

  // 3️⃣ Encontrar la marca correspondiente
  const marcaObj = marcas.find(
    (m) => m.slug_marca?.toLowerCase() === marcaSlug?.toLowerCase()
  );
  const id_marca = marcaObj?.id_marcas || null;

  // 4️⃣ Obtener productos iniciales (SSR)
  const primeros = await obtenerProductosFiltrados(
    id_marca,
    null,
    "precio",
    "asc",
    0,
    cantidadPorPagina
  );

  const productosSSR = await Promise.all(
    primeros.map(async (p) => {
      const url = p.urlImagen1?.trim()
        ? process.env.NEXT_PUBLIC_SIGNALR_URL + p.urlImagen1
        : "/not-found.webp";
      return { ...p, urlImagen1: url };
    })
  );
  
  return (
    <>
    <Script id="marca-structured-data" type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": `Productos de la marca ${marcaObj?.nombre}`,
        "url": `https://prasen.pe/tienda/${marcaSlug}`,
        "itemListElement": productosSSR.map((p, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "url": `https://prasen.pe/producto/${p.nombreSlug}`
        }))
      })}
    </Script>
      <main className="bg-white py-10 px-4">
        <div className="max-w-[1520px] mx-auto">
          <div className="flex flex-col mb-8">
            {/* Visualmente primero (pero va después en HTML): Banner */}
            <div className="w-full">
              {/* Banner aquí */}
              <div className="hidden md:block relative aspect-[1520/280] w-full rounded-xl overflow-hidden">
                <Image
                  src="/banners-paginas/Banner-Tienda-Marcas.webp"
                  alt={`Banner de la tienda general`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 1520px"
                  priority
                />
              </div>
              <div className="block md:hidden relative aspect-[430/150] w-full rounded-xl overflow-hidden">
                <Image
                  src="/banners-paginas/Marcas-Mobil.webp"
                  alt={`Banner de la tienda general`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 767px) 430px"
                  priority
                />
              </div>
            </div>
          
            {/* Semánticamente primero (pero va visualmente después): H1 */}
            <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4 mt-4">
              {marcaObj?.nombre || "Marca no encontrada"}
            </h1>
          </div>

          <p className="text-gray-600 mb-8">
            Explora los productos disponibles de la marca seleccionada. Filtra por categoría si lo deseas.
          </p>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Filtros en desktop */}
            <FiltrosDesktop
              categorias={categorias}
              marcas={marcas}
              marcaSeleccionadaObj={marcaObj}
            />

            {/* GRID de productos */}
            <div className="flex-1">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="md:hidden">
                  <FiltrosMovil
                    categorias={categorias}
                    marcas={marcas}
                  />
                </div>
                <div id="zona-combobox" className="flex-shrink-0"></div>
              </div>
              {productosSSR.length === 1 && productosSSR[0].valorConsulta === "0" ? (
                <div className="text-center py-16 col-span-full">
                  <p className="text-xl text-gray-600 font-medium">
                    No se encontraron productos para esta marca.
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Intenta cambiar los filtros o vuelve más tarde.
                  </p>
                </div>
              ) : (
                <>
                  <div
                    id="contenedor-grid"
                    className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
                  >
                    {productosSSR.map((p) => (
                      <ProductoCard key={p.id_producto} producto={p} />
                    ))}
                  </div>
                </>
              )}
            </div>
            <TiendaJs
              productosIniciales={productosSSR}
              yaHayProductos
              id_marca={id_marca}
            />
            <ScrollButtons/>
          </div>
        </div>
      </main>
    </>
  );
}
