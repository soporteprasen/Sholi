import Image from "next/image";
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

export const metadata = {
  title: "Compra productos online | Prasen",
  description: "Compra productos de calidad. Entrega nacional en Prasen.",
  alternates: {
    canonical: "https://prasen.pe/tienda",
  },
  openGraph: {
    title: "Compra productos online | Prasen",
    description: "Compra productos de calidad. Entrega nacional en Prasen.",
    url: "https://prasen.pe/tienda",
    type: "website",
    images: [
      {
        url: "https://prasen.pe/opengraph/tienda-banner.webp",
        width: 1200,
        height: 630,
        alt: "Prasen tienda",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Compra productos online | Prasen",
    description: "Compra productos de calidad. Entrega nacional en Prasen.",
    images: ["https://prasen.pe/opengraph/tienda-banner.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function PaginaTiendaGeneral({ searchParams, params }) {
  const resolvedSearchParams = await searchParams;
  const resolvedParams = await params;

  const textoBusqueda = typeof resolvedSearchParams?.buscar === "string"
    ? resolvedSearchParams.buscar.trim()
    : "";
    
  const slugParts = resolvedParams?.slug || [];
  const cantidadPorPagina = 8;
  const categoriaSlug = slugParts[0] === "categoria" ? slugParts[1] : "";
  const marcaSlug =
    slugParts[0] === "categoria" ? slugParts[2] : slugParts[1] || "";

  const categoriaSeleccionada = categoriaSlug
    ? decodeURIComponent(categoriaSlug.replace(/-/g, " "))
    : "Todas";
  const marcaSeleccionada = marcaSlug
    ? decodeURIComponent(marcaSlug.replace(/-/g, " "))
    : "";

  const categorias = await obtenerCategorias();
  const marcas = await obtenerMarcas();

  let productos = [];

  // SOLO cargar productos si NO hay texto de búsqueda
  if (!textoBusqueda) {
    const nuevos = await obtenerProductosFiltrados(
      null,
      null,
      "precio",
      "asc",
      0,
      cantidadPorPagina
    );

    productos = await Promise.all(
      nuevos.map(async (producto) => {
        let url1 = "";
        try {
          if (producto.id_producto !== null) {
            const urlValida = producto.urlImagen1?.trim();
            url1 = urlValida
              ? process.env.NEXT_PUBLIC_SIGNALR_URL + urlValida
              : "/not-found.webp";
          }
        } catch (e) {
          console.error("Error cargando imagen:", producto.nombre);
        }
        return { ...producto, urlImagen1: url1 };
      })
    );
  }

  // Filtro por categoría y marca SOLO si no es búsqueda
  const productosFiltrados = textoBusqueda
    ? []
    : productos.filter((prod) => {
      const coincideCategoria =
        categoriaSeleccionada === "Todas" ||
        prod.categoria?.toLowerCase() ===
        categoriaSeleccionada.toLowerCase();
      const coincideMarca =
        !marcaSeleccionada ||
        prod.marca?.toLowerCase() === marcaSeleccionada.toLowerCase();
      return coincideCategoria && coincideMarca;
    });
  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "Tienda Prasen - Productos",
          "itemListElement": productosFiltrados.map((p, index) => ({
            "@type": "Product",
            "position": index + 1,
            "name": p.nombre,
            "image": p.urlImagen1,
            "url": `https://prasen.pe/producto/${p.nombreSlug}`,
            "brand": { "@type": "Brand", "name": p.marca },
            ...(p.precio && {
              "offers": {
                "@type": "Offer",
                "price": p.precio,
                "priceCurrency": "PEN",
                "availability": "https://schema.org/InStock",
              },
            }),
          })),
        }),
      }}
    />
      <main
        className="bg-white py-10 px-4"
        itemScope
        itemType="https://schema.org/CollectionPage"
      >
        <div className="max-w-[1520px] mx-auto">
          <div className="flex flex-col mb-8">
            {/* Visualmente primero (pero va después en HTML): Banner */}
            <div className="w-full">
              {/* Banner aquí */}
              <div className="hidden md:block relative aspect-[1520/280] w-full rounded-xl overflow-hidden">
                <Image
                  src="/banners-paginas/Banner-Tienda-General.webp"
                  alt={`Banner de la tienda general`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 1520px"
                  priority
                />
              </div>
              <div className="block md:hidden relative aspect-[430/150] w-full rounded-xl overflow-hidden">
                <Image
                  src="/banners-paginas/Tienda-Movil.webp"
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
              Tienda
            </h1>
          </div>

          <p className="text-gray-600 mb-8">
            Explora todos los productos disponibles. Filtra por categoría o
            marca para encontrar lo que necesitas.
          </p>

          <div className="flex flex-col md:flex-row gap-8">
            <FiltrosDesktop categorias={categorias} marcas={marcas} />

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
              {productos.length === 1 && productos[0].valorConsulta === "0" ? (
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
                <div id="contenedor-grid" className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                  
                  {/* SSR: productos ya renderizados */}
                  {productosFiltrados.map((prod) => (
                    <ProductoCard key={prod.id_producto} producto={prod} />
                  ))}
                </div>
              </>)}
              {/* Scroll infinito */}
              <TiendaJs
                yaHayProductos
              />
              <ScrollButtons />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
