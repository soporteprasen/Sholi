// app/tienda/[...slug]/page.jsx
import {
  obtenerCategorias,
  obtenerMarcas,
  obtenerProductosFiltrados,
} from "@/lib/api";
import FiltrosDesktop from "@/components/Filtros/FiltrosDesktop";
import FiltrosMovil from "@/components/Filtros/FiltrosMovil";
import ScrollButtons from "@/components/Tiendas/BotonScroll";
import ProductoCard from "@/components/Tiendas/ProductosGrid";
import TiendaJs from "@/components/Tiendas/TiendaJs";
import Script from "next/script";
import WspFlot from "@/components/WspFlot";
import { obtenerMensajesWsp } from "@/lib/api";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slugParts = resolvedParams?.slug || [];

  const marcaSlug = slugParts[0] || "";

  const marcas = await obtenerMarcas();
  const marcaObj = marcas.find(
    (m) => m.slug_marca?.toLowerCase() === marcaSlug?.toLowerCase()
  );

  // 👇 Ajusta tu dominio base aquí
  const base = `${process.env.NEXT_PUBLIC_SITE_URL}`;
  const canonical = `${base}/tienda/${marcaSlug}`;

  const title = marcaObj
    ? `Compra productos marca ${marcaObj.nombre} | Sholi`
    : "Compra productos online | Sholi";

  const description = marcaObj
    ? `Explora productos de la marca ${marcaObj.nombre}. Compra online con entrega a nivel nacional.`
    : "Explora productos online de calidad. Compra fácil y rápido con Sholi.";

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
      siteName: "Sholi Iluminación",
      locale: "es_PE",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${base}/banners-paginas/Banner-Tienda-Marcas.webp`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function PaginaTiendaMarca({ params }) {
  const wspData = await obtenerMensajesWsp();
  const numero = wspData?.numero ;
  const mensajeBase = wspData?.mensajeProducto ;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ;

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
  const marcaObj = marcas.find(mar =>
    mar.slug_marca === marcaSlug
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
          "url": `${process.env.NEXT_PUBLIC_SITE_URL}/tienda/${marcaSlug}`,
          "itemListElement": productosSSR.map((p, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "url": `${process.env.NEXT_PUBLIC_SITE_URL}/producto/${p.nombreSlug}`
          }))
        })}
      </Script>
      <main className="bg-white py-10 px-4">
        <div className="max-w-[1520px] mx-auto min-h-[2028px] md:min-h-[1200px]">
          <div className="flex flex-col mb-4">
            {/* Semánticamente primero (pero va visualmente después): H1 */}
            <h1 className="text-3xl md:text-4xl font-bold text-[#3C1D2A] mb-2 mt-2">
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
              <div className="flex items-center justify-between gap-4 mb-4 h-10 md:h-auto">
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
                    {productosSSR.map((p, index) => (
                      <ProductoCard key={p.id_producto} producto={p} index={index} numero={numero} mensajeBase={mensajeBase} baseUrl={baseUrl}/>
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
            <ScrollButtons />
          </div>
        </div>

        <WspFlot/>
      </main>
    </>
  );
}
