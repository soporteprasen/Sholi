/*  app/categoria/[...slug]/page.jsx  (server component) */
import {
  obtenerCategorias,
  obtenerMarcas,
  obtenerProductosFiltrados,
} from "@/lib/api";
import FiltrosDesktop from "@/components/FiltrosDesktop";
import FiltrosMovil   from "@/components/FiltrosMovil";
import ScrollButtons from "@/components/BotonScroll";
import ProductoCard   from "@/components/ProductosGrid";
import TiendaJs       from "@/components/TiendaJs";
import Image from "next/image";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slugParts = resolvedParams?.slug || [];

  const categoriaSlug = slugParts[0] || "";
  const marcaSlug = slugParts[1] || "";

  const base = "https://prasen.pe";
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
      ? `Compra ${categoriaObj.nombre} marca ${marcaObj.nombre} | Prasen`
      : categoriaObj
      ? `Compra ${categoriaObj.nombre} online | Prasen`
      : "Compra productos online | Prasen";

  const description =
    categoriaObj && marcaObj
      ? `Descubre la mejor selección de ${categoriaObj.nombre} de la marca ${marcaObj.nombre}. Compra online con entrega nacional en Prasen.`
      : categoriaObj
      ? `Explora nuestra colección de ${categoriaObj.nombre}. Compra online con envío nacional en Prasen.`
      : `Explora nuestros productos. Compra online con envío nacional en Prasen.`;

  const image = "https://prasen.pe/opengraph/categoria-banner.webp";

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
          alt: "Categoría Prasen",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: categoriaObj ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export default async function PaginaTiendaCategorizada({ params }) {
  const cantidadPorPagina = 8;

  /* --------- 1️⃣  Slugs:  /categoria/[categoriaSlug]/[marcaSlug?] ---------- */
  const resolvedParams = await params;
  const slugParts = resolvedParams?.slug || [];

  const categoriaSlug = slugParts[0] || "";          
  const marcaSlug     = slugParts[1] || "";          

  /* --------- 2️⃣  Filtros (categorías y marcas) ---------- */
  const [categorias, marcas] = await Promise.all([
    obtenerCategorias(),
    obtenerMarcas(),
  ]);

  const categoriaObj = categorias.find(cat => cat.slug_categoria?.toLowerCase() === categoriaSlug?.toLowerCase());
  const marcaObj     = marcas.find(mar => mar.slug_marca?.toLowerCase() === marcaSlug?.toLowerCase());

  const id_categoria = categoriaObj?.id_categoria || null;
  const id_marca     = marcaObj?.id_marcas       || null;

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
      const url = p.urlImagen1?.trim()
        ? process.env.NEXT_PUBLIC_SIGNALR_URL + p.urlImagen1
        : "/not-found.webp";
      return { ...p, urlImagen1: url };
    })
  );

  /* --------- 4️⃣  SEO dinánico ---------- */
  const base = "https://prasen.pe";

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
        <div className="max-w-[1520px] mx-auto">
          <div className="flex flex-col md:flex-col mb-8">
            {/* Visualmente primero (pero va después en HTML): Banner */}
            <div className="w-full">
              {/* Banner aquí */}
              <div className="hidden md:block relative aspect-[1520/280] w-full rounded-xl overflow-hidden">
                <Image
                  src="/banners-paginas/Banner-Tienda-Categorias.webp"
                  alt={`Banner promocional ${categoriaObj?.nombre || "categorías"}`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 1520px"
                  priority
                />
              </div>
              <div className="block md:hidden relative aspect-[430/150] w-full rounded-xl overflow-hidden">
                <Image
                  src="/banners-paginas/Categorias-Mobil.webp"
                  alt={`Banner promocional ${categoriaObj?.nombre || "categorías"}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 767px) 430px"
                  priority
                />
              </div>
            </div>

            {/* Semánticamente primero (pero va visualmente después): H1 */}
            <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4 mt-4">
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
                    {productosSSR.map((p) => (
                      <ProductoCard key={p.id_producto} producto={p} />
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
    </>
  );
}
