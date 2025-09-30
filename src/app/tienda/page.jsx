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
import WspFlot from "@/components/WspFlot";
import { obtenerMensajesWsp } from "@/lib/api";

export const metadata = {
  title: "Sholi - Compra productos online",
  description:
    "Explora productos LED de calidad: focos, lámparas, reflectores y más. Envío a todo el Perú con garantía y soporte inmediato.",
  alternates: {
    canonical:
      `${process.env.NEXT_PUBLIC_SITE_URL}/tienda`,
  },
  openGraph: {
    title: "Sholi - Compra productos online",
    description:
      "Descubre la mejor selección de productos LED con entrega nacional en Perú.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/tienda`,
    type: "website",
    siteName: "Sholi Iluminación",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/banners-paginas/Banner-Tienda-General.webp`,
        width: 1200,
        height: 630,
        alt: "Sholi Tienda Online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@sholi_iluminacion",
    title: "Sholi - Compra productos online",
    description:
      "Focos, lámparas, reflectores LED y más. Compra online con garantía y envío a todo el Perú.",
    images: [
      `${process.env.NEXT_PUBLIC_SITE_URL}/banners-paginas/Banner-Tienda-General.webp`,
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  category: "ecommerce",
};

export default async function PaginaTiendaGeneral({ searchParams, params }) {
  const wspData = await obtenerMensajesWsp();
  const numero = wspData?.numero ;
  const mensajeBase = wspData?.mensajeProducto ;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ;

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
            "url": `${process.env.NEXT_PUBLIC_SITE_URL}/producto/${p.nombreSlug}`,
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
        <div className="max-w-[1520px] mx-auto min-h-[2028px] md:min-h-[1200px]">
          <div className="flex flex-col mb-4">
            {/* Semánticamente primero (pero va visualmente después): H1 */}
            <h1 className="text-3xl md:text-4xl font-bold text-[#3C1D2A] mb-2 mt-2">
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
              <div className="flex items-center justify-between gap-4 mb-4 h-10 md:h-auto">
                <div className="md:hidden">
                  <FiltrosMovil categorias={categorias} marcas={marcas} />
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
                  {productosFiltrados.map((prod, index) => (
                    <ProductoCard key={prod.id_producto} producto={prod} index={index} numero={numero} mensajeBase={mensajeBase} baseUrl={baseUrl} />
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

        <WspFlot/>
      </main>
    </>
  );
}
