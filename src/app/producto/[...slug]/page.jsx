// app/Producto/[...slug]/page.jsx
import { obtenerProductoPorSlug } from "@/lib/api";
import Script from "next/script";
import ImagenProductoJS from "@/components/PaginaProducto/ImagenProductoJs";
import { notFound } from "next/navigation";
import { PackageCheck } from "lucide-react";
import BotonWsp from "@/components/BotonWsp";
import Breadcrumbs from "@/components/PaginaProducto/Breadcrumbs";
import ProductosRelacionados from "@/components/PaginaProducto/ProductosRelacionados";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slugArray = Array.isArray(resolvedParams?.slug)
    ? resolvedParams.slug
    : [resolvedParams?.slug].filter(Boolean);
  const slugCompleto = slugArray.join("/");

  try {
    const producto = await obtenerProductoPorSlug(slugCompleto);
    if (!producto) return notFound();
    return {
      title: `${producto.nombre} - Compra Online al Mejor Precio | Prasen`,
      description: `${producto.descripcion?.slice(0, 150)} ¡Stock disponible en Perú! Envíos a nivel nacional.`,
      openGraph: {
        title: producto.nombre,
        description: producto.descripcion?.slice(0, 160),
        images: [
          {
            url:
              (producto.urlImagen1?.startsWith("http")
                ? producto.urlImagen1
                : process.env.NEXT_PUBLIC_SIGNALR_URL + producto.urlImagen1) || "/not-found.webp",
            width: 800,
            height: 800,
            alt: producto.nombre,
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: producto.nombre,
        description: producto.descripcion?.slice(0, 160),
        images: [
          (producto.urlImagen1?.startsWith("http")
            ? producto.urlImagen1
            : process.env.NEXT_PUBLIC_SIGNALR_URL + producto.urlImagen1) || "/not-found.webp"
        ]
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/producto/${slugCompleto}`,
      }
    };
  } catch (error) {
    console.error("Error al generar metadata:", error);
    return {
      title: "Error al cargar producto",
    };
  }
}

export default async function Page({ params }) {
  const getVariant = (url, size) =>
    url.replace("/original/", `/${size}/`);
  
  const resolvedParams = await params;
  const slugArray = Array.isArray(resolvedParams?.slug)
    ? resolvedParams.slug
    : [resolvedParams?.slug].filter(Boolean);
  const slugCompleto = slugArray.join("/");

  const producto = await obtenerProductoPorSlug(slugCompleto);
  if (!producto.id_producto) return notFound();

  // Ficha técnica (si existe)
  if (producto.ficha) {
    producto.ficha = process.env.NEXT_PUBLIC_SIGNALR_URL + producto.ficha;
  }

  // Cargar imágenes
  let imagenes = [];
  if (producto.imagenes?.length > 0) {
    imagenes = await Promise.all(
      producto.imagenes.map(async (img) => {
        const url = process.env.NEXT_PUBLIC_SIGNALR_URL + img.urlImagen;
        const principalTipo = producto.urlImagen1 === img.urlImagen ? 1 :
          producto.urlImagen2 === img.urlImagen ? 2 : null;
        return {
          ...img,
          idImagenProducto: img.idImagen,
          imagenUrlTemporal: url,
          principalTipo,
        };
      })
    );
  } else {
    const urls = [producto.urlImagen1, producto.urlImagen2];
    imagenes = urls.map((url, i) => ({
      idImagenProducto: null,
      imagenUrlTemporal: "/not-found.webp",
      urlImagen: url,
      principalTipo: i === 0 ? 1 : 2,
    }));
  }

  const imagenActiva = imagenes.find(i => i.principalTipo === 1)?.imagenUrlTemporal ||
    imagenes.find(i => i.principalTipo === 2)?.imagenUrlTemporal ||
    imagenes[0]?.imagenUrlTemporal || "/not-found.webp";
    
  return (
    <main className="bg-white" itemScope itemType="https://schema.org/Product">
      {/* Breadcrumb */}
      <div className="max-w-[1200px] px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="border-y border-gray-200 py-3">
          <Breadcrumbs items={[
            { label: "Inicio", href: "/" },
            { label: "marca", href: `/tienda/${producto.slug_marca}` },
            { label: producto.nombre }
          ]} />
          <Script id="breadcrumbs-jsonld" type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Inicio",
                  item: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Marca",
                  item: `${process.env.NEXT_PUBLIC_SITE_URL}/tienda/tienda/${producto.slug_marca}`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: producto.nombre,
                  item: `${process.env.NEXT_PUBLIC_SITE_URL}/producto/${slugCompleto}`,
                },
              ],
            })}
          </Script>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-[1200px] px-4 sm:px-6 lg:px-8 mx-auto relative mt-6">
        <div className="flex flex-col md:flex-row gap-8 items-start w-full">

          {/* ---------- COLUMNA IZQUIERDA: Imagen + miniaturas ---------- */}
          <div id="producto-carrusel" className="relative md:w-1/2">
            {/* Imagen principal */}
            <div className="relative w-full aspect-square border rounded">
              <img
                id="imagen-principal"
                src={imagenActiva} // siempre la original como fallback
                alt={`Imagen principal de ${producto.nombre}`}
                className="w-full h-full object-contain select-none"
                loading="eager"
                itemProp="image"
                width={550}
                height={550}
                fetchPriority="high"
                srcSet={`
                  ${getVariant(imagenActiva, "lg")} 366w,
                  ${imagenActiva} 550w
                `}
                sizes="(max-width: 768px) 366px, 550px"
              />
            </div>
            {/* Zoom flotante pegado a la derecha de la imagen */}
            <div
              id="zoom-lateral"
              className="hidden md:block absolute top-0 left-full ml-4 w-[300px] h-[300px] border rounded shadow-xl bg-white overflow-hidden invisible pointer-events-none z-40"
              style={{
                backgroundPosition: "50% 50%",
                backgroundSize: "200% 200%",
                backgroundRepeat: "no-repeat"
              }}
            />

            {/* Miniaturas */}
            <div className="flex flex-wrap gap-4 mt-4">
              {imagenes.map((img, i) => (
                <img
                  key={img.imagenUrlTemporal || i} // 👈 clave única
                  src={getVariant(img.imagenUrlTemporal, "xs")}
                  alt={`Miniatura ${i + 1}`}
                  srcSet={`${getVariant(img.imagenUrlTemporal, "xs")} 80w`}
                  data-miniatura-src={img.imagenUrlTemporal}
                  className="h-20 w-20 object-contain border rounded cursor-pointer"
                />
              ))}
            </div>

            {/* Script funcional de zoom y miniaturas */}
            <ImagenProductoJS />
          </div>

          {/* ---------- COLUMNA DERECHA: Información del producto ---------- */}
          <div className="md:w-1/2 space-y-4">
            {producto.codigo && (
              <span className="italic text-[#3C1D2A]">
                Sku: <span className="font-medium text-gray-700">{producto.codigo}</span>
              </span>
            )}
            <h1 className="text-2xl text-[#3C1D2A] md:text-3xl font-bold" itemProp="name">
              {producto.nombre}
            </h1>
            {producto.marca && (
              <Link
                href={`/tienda/${producto.slug_marca}`}
              >
                <p className="text-sm text-[#3C1D2A] italic">
                  Marca: <span className="font-medium text-gray-700">{producto.marca}</span>
                </p>
              </Link>
            )}
            <p className="text-gray-700 text-sm" itemProp="description">
              {producto.descripcion}
            </p>

            {/* Precio */}
            {producto.precio && (
              <>
                <div
                  className="flex items-center gap-4 text-2xl font-semibold mt-2 flex-wrap"
                  itemProp="offers"
                  itemScope
                  itemType="https://schema.org/Offer"
                >
                  {producto.descuento > 0 ? (
                    <>
                      <span
                        className="text-green-700 font-bold text-2xl"
                        itemProp="price"
                        content={(producto.precio - producto.precio * producto.descuento / 100).toFixed(2)}
                      >
                        S/. {(producto.precio - producto.precio * producto.descuento / 100).toFixed(2)}
                      </span>
                      <span className="text-neutral-700 line-through text-lg">
                        S/. {producto.precio.toFixed(2)}
                      </span>
                      <span className="bg-red-100 text-red-700 text-sm px-3 py-1 rounded font-semibold">
                        -{producto.descuento}% OFF
                      </span>
                    </>
                  ) : (
                    <span
                      className="text-green-700"
                      itemProp="price"
                      content={producto.precio.toFixed(2)}
                    >
                      S/. {producto.precio.toFixed(2)}
                    </span>
                  )}
                  <meta itemProp="priceCurrency" content="PEN" />
                  <link itemProp="availability" href={`https://schema.org/${producto.stock > 0 ? "InStock" : "OutOfStock"}`} />
                </div>
              </>
            )}


            {/* Stock */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-2" itemProp="availability">
              <PackageCheck className="w-5 h-5 text-green-500" aria-hidden="true" />
              {producto.stock > 0
                ? `Disponible: ${producto.stock} unidades`
                : "Sin stock"}
            </div>

            {/* Botones */}
            {/* <button className="w-full flex items-center justify-center gap-2 bg-[#3C1D2A] text-white py-3 rounded hover:bg-[#7c141b] transition">
              <ShoppingCart className="w-5 h-5" />
              Agregar al carrito
            </button> */}

            {producto.ficha && (
              <a
                href={producto.ficha}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#3C1D2A] text-white py-3 rounded hover:bg-[#7c141b] transition mt-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-file-text-icon lucide-file-text"
                >
                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                  <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                  <path d="M10 9H8" />
                  <path d="M16 13H8" />
                  <path d="M16 17H8" />
                </svg>
                Ver Ficha Técnica
              </a>
            )}

            <BotonWsp
              tipo="producto"
              codigo={producto.codigo}
              nombre={producto.nombre}
              nombreSlug={producto.nombreSlug}
            />

            <Script id="product-jsonld" type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org/",
                "@type": "Product",
                name: producto.nombre,
                image: [imagenActiva],
                description: producto.descripcion,
                sku: producto.codigo,
                brand: {
                  "@type": "Brand",
                  name: producto.marca || "Sin marca",
                },
                offers: {
                  "@type": "Offer",
                  url: `${process.env.NEXT_PUBLIC_SITE_URL}/producto/${slugCompleto}`,
                  priceCurrency: "PEN",
                  price: (producto.precio - producto.precio * producto.descuento / 100).toFixed(2),
                  availability: `https://schema.org/${producto.stock > 0 ? "InStock" : "OutOfStock"}`,
                  itemCondition: "https://schema.org/NewCondition",
                },
              })}
            </Script>
          </div>
        </div>
      </div>

      {/* Detalles adicionales */}
      <div className="mt-10 space-y-10 max-w-[1200px] mx-auto px-4">
        {producto.descripcion && (
          <section>
            <h2 className="text-xl font-semibold mb-2">Descripción detallada</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {producto.descripcion}
            </p>
          </section>
        )}

        {producto.especificaciones && (
          <section>
            <h2 className="text-xl font-semibold mb-2">Especificaciones técnicas</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {producto.especificaciones.split("\n").map((linea, i) => (
                <li key={i}>{linea}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Productos relacionados */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Productos relacionados</h2>
          <ProductosRelacionados idProducto={producto.id_producto} />
        </section>
      </div>
    </main>
  );
}
