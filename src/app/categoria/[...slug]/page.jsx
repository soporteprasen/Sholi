/*  app/categoria/[...slug]/page.jsx  (server component) */
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

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slugParts = resolvedParams?.slug || [];

  const categoriaSlug = slugParts[0] || "";
  const marcaSlug = slugParts[1] || "";

  // 👇 Aquí cambia el dominio base a tu Azure App Service
  const base = `${process.env.NEXT_PUBLIC_SITE_URL}`;

  const canonical = marcaSlug
    ? `${base}/categoria/${categoriaSlug}/${marcaSlug}`
    : `${base}/categoria/${categoriaSlug}`;

  const [categorias, marcas] = await Promise.all([
    obtenerCategorias(),
    obtenerMarcas(),
  ]);

  const categoriaObj = categorias.find(
    (cat) => cat.slug_categoria?.toLowerCase() === categoriaSlug?.toLowerCase()
  );
  const marcaObj = marcas.find(
    (mar) => mar.slug_marca?.toLowerCase() === marcaSlug?.toLowerCase()
  );

  const title =
    categoriaObj && marcaObj
      ? `Compra ${categoriaObj.nombre} marca ${marcaObj.nombre} | Sholi`
      : categoriaObj
        ? `Compra ${categoriaObj.nombre} online | Sholi`
        : "Compra productos online | Sholi";

  const description =
    categoriaObj && marcaObj
      ? `Descubre la mejor selección de ${categoriaObj.nombre} de la marca ${marcaObj.nombre}. Compra online con entrega nacional en Sholi.`
      : categoriaObj
        ? `Explora nuestra colección de ${categoriaObj.nombre}. Compra online con envío nacional en Sholi.`
        : `Explora nuestros productos. Compra online con envío nacional en Sholi.`;

  const image = `${base}/banners-paginas/Banner-Tienda-Categorias.webp`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: "Categoría Sholi",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: categoriaObj
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}

export default async function PaginaTiendaCategorizada({ params }) {
  const wspData = await obtenerMensajesWsp();
  const numero = wspData?.numero ;
  const mensajeBase = wspData?.mensajeProducto ;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ;

  const cantidadPorPagina = 8;

  /* --------- 1️⃣  Slugs:  /categoria/[categoriaSlug]/[marcaSlug?] ---------- */
  const resolvedParams = await params;
  const slugParts = resolvedParams?.slug || [];

  const categoriaSlug = slugParts[0] || "";
  const marcaSlug = slugParts[1] || "";

  /* --------- 2️⃣  Filtros (categorías y marcas) ---------- */
  const [categorias, marcas] = await Promise.all([
    obtenerCategorias(),
    obtenerMarcas(),
  ]);

  const categoriaObj = categorias.find(cat =>
    cat.slug_categoria === categoriaSlug
  );

  const marcaObj = marcas.find(mar =>
    mar.slug_marca=== marcaSlug
  );
  
  const id_categoria = categoriaObj?.id_categoria || null;
  const id_marca = marcaObj?.id_marcas || null;

  /* --------- 3️⃣  Carga inicial de productos (SSR) ---------- */
  const primeros = await obtenerProductosFiltrados(
    id_marca,
    id_categoria,
    "nombre",
    "asc",
    0,
    cantidadPorPagina
  );

  const productosSSR = await Promise.all(
    primeros.map(async (p) => {
      const imagenPath = p.urlImagen1;
      const url = imagenPath
        ? `${process.env.NEXT_PUBLIC_SIGNALR_URL}${imagenPath}`
        : "/not-found.webp";
      return { ...p, urlImagen1: url };
    })
  );

  /* --------- 4️⃣  SEO dinánico ---------- */
  const base = `${process.env.NEXT_PUBLIC_SITE_URL}`;

  const title = categoriaObj && marcaObj
    ? `Compra ${categoriaObj.nombre} marca ${marcaObj.nombre} | Prasen`
    : categoriaObj
      ? `Compra ${categoriaObj.nombre} online | Prasen`
      : "Compra productos online | Prasen";
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": title,
            "itemListElement": productosSSR.map((p, index) => ({
              "@type": "Product",
              "position": index + 1,
              "name": p.nombre,
              "image": p.urlImagen1,
              "url": `${base}/producto/${p.nombreSlug}`,
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
      <main className="bg-white py-10 px-4">
        <div className="max-w-[1520px] mx-auto min-h-[2028px] md:min-h-[1200px]">
          <div className="flex flex-col md:flex-col mb-4">
            {/* Semánticamente primero (pero va visualmente después): H1 */}
            <h1 className="text-3xl md:text-4xl font-bold text-[#3C1D2A] mb-2 mt-2">
              {categoriaObj?.nombre}
              {marcaObj ? ` - ${marcaObj.nombre}` : ""}
            </h1>
          </div>

          <p className="text-gray-600 mb-8">
            Explora los productos disponibles. Filtra por categoría o marca para encontrar lo que necesitas.
          </p>

          <div className="flex flex-col md:flex-row gap-8">
            <FiltrosDesktop
              categorias={categorias}
              marcas={marcas}
              categoriaSeleccionadaObj={categoriaObj}
              marcaSeleccionadaObj={marcaObj}
            />

            {/* GRID contenedor */}
            <div className="flex-1">
              {/* Filtros móviles */}
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
                    No se encontraron productos para esta categoría o marca.
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Intenta cambiar los filtros o vuelve más tarde.
                  </p>
                </div>
              ) : (
                <>
                  {/* ✅ GRID de productos */}
                  <div
                    id="contenedor-grid"
                    className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
                  >
                    {productosSSR.map((p, index) => (
                      <ProductoCard key={p.id_producto} producto={p} index={index}  numero={numero} mensajeBase={mensajeBase} baseUrl={baseUrl}/>
                    ))}
                  </div>
                </>
              )}
              <ScrollButtons />
            </div>
            {/* Scroll infinito */}
            <TiendaJs
              productosIniciales={productosSSR}
              yaHayProductos
              id_categoria={id_categoria}
              id_marca={id_marca}
            />
          </div>
        </div>
      </main>
      <WspFlot/>
    </>
  );
}
