{/* Sliders */ }
import Slider from "@/components/Slider";
import SliderJS from "@/components/SliderJs";

import Script from "next/script";

{/* Carrusel productos con descuento */ }
import CarruselProductos from "@/components/CarruselProductos";

{/* Llamadas Api */ }
import { obtenerMarcas, obtenerProductosConDescuento, obtenerCategorias } from "@/lib/api";

{/* Carrusel banners */ }
import CarruselBanner from "@/components/CarruselBanner";
import CarruselBannerJS from "@/components/CarruselBannerJS";

{/* Carrusel banner */ }
import Banner from "@/components/Banner";

{/* Carrusel categorias */ }
import CarruselCategorias from "@/components/CarruselCategorias";

{/* CuadroDeBanners */ }
import CuadroDeBanners from "@/components/CuadroDeBanners";

{/* Preguntas Frecuentes */ }
import PreguntasFrecuentes from "@/components/PreguntasFrecuentes";

export async function generateMetadata() {
  return {
    title: "Tienda de Iluminación LED | Compra Focos y Lámparas Online en Perú",
    description:
      "Explora la mayor variedad de productos LED: focos, lámparas, reflectores y más. Envío a todo el Perú. Calidad certificada y atención inmediata.",
    keywords: [
      "iluminación LED",
      "tienda de focos",
      "lámparas LED",
      "reflectores LED",
      "productos eléctricos Perú",
      "comprar luces online",
    ],
    openGraph: {
      title: "Tienda de Iluminación LED en Perú",
      description:
        "Descubre ofertas en productos de iluminación LED certificados. Compra online con garantía y envío nacional.",
      url: "https://www.sholi.com",
      siteName: "Sholi Iluminación",
      images: [
        {
          url: "https://www.sholi.com/opengraph/home-banner.webp",
          width: 1200,
          height: 630,
          alt: "Sholi | Tienda de Iluminación LED en Perú",
        },
      ],
      locale: "es_PE",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: "@sholi_iluminacion",
      title: "Tienda de Iluminación LED | Sholi Perú",
      description:
        "Focos, lámparas, reflectores LED y más. Envíos rápidos en todo Perú.",
      images: ["https://www.sholi.com/opengraph/home-banner.webp"],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
    },
    alternates: {
      canonical: "https://www.sholi.com",
    },
    authors: [{ name: "Sholi", url: "https://www.sholi.com" }],
    creator: "Sholi",
    publisher: "Sholi",
    category: "ecommerce",
  };
}

export default async function Home() {
  const imagenesCarrusel = [
    {
      desktop: "/carrucel-desktop/BANNERTECNOLOGICO.webp",
      mobile: "/carrucel-mobil/PREMIOS-POR-FIESTAS-PATRIAS.webp",
      alt: "Compra tecnología avanzada y participa por premios especiales",
    },
    {
      desktop: "/carrucel-desktop/MEMORIAS-RAM-PREMIER-PRINT.webp",
      mobile: "/carrucel-mobil/NUEVOS-SUMINISTROS-DISTRIBUCION.webp",
      alt: "Nuevas memorias RAM de alto rendimiento en stock",
    },
    {
      desktop: "/carrucel-desktop/INTELIGENCIA-ARTIFICIAL.webp",
      mobile: "/carrucel-mobil/NUEVO-PRODUCTO-TUBERIA-LIQUID-TIGHT.webp",
      alt: "Tecnología con inteligencia artificial para tu negocio",
    },
    {
      desktop: "/carrucel-desktop/NUEVAS-MARCAS-PLACAS-MADRE-ASUS.webp",
      mobile: "/carrucel-mobil/NUEVO-PRODUCTO-TUBERIA-LIQUID-TIGHT.webp",
      alt: "Tecnología con inteligencia artificial para tu negocio",
    },
  ];

  const productosCrudos = await obtenerProductosConDescuento();
  const productos = productosCrudos.map((producto) => ({
    ...producto,
    urlImagen1: producto.urlImagen1 ? process.env.NEXT_PUBLIC_SIGNALR_URL + producto.urlImagen1 : "/not-found.webp",
    urlImagen2: producto.urlImagen2 ? process.env.NEXT_PUBLIC_SIGNALR_URL + producto.urlImagen2 : "/not-found.webp",
  }));

  const categorias = await obtenerCategorias();
  const categoriasConImagenes = categorias.map(cat => {
    let imagenUrl = "";
    if (cat.imagen_categoria) {
      imagenUrl = process.env.NEXT_PUBLIC_SIGNALR_URL + cat.imagen_categoria;
    }
    return { ...cat, imagen: imagenUrl };
  });

  const certificados = [
    {
      imagen: "/certificados/Ansi.webp",
      nombre: "Certificado Ansi",
    },
    {
      imagen: "/certificados/IEC.webp",
      nombre: "Certificado IEC",
    },
    {
      imagen: "/certificados/ISO.webp",
      nombre: "certificado ISO",
    },
    {
      imagen: "/certificados/NEMA.webp",
      nombre: "Certificado NEMA",
    },
    {
      imagen: "/certificados/ROHS.webp",
      nombre: "Certificado ROHS",
    },
    {
      imagen: "/certificados/Ul.webp",
      nombre: "Certificado Ul",
    },
    {
      imagen: "/certificados/VDE.webp",
      nombre: "Certificado VDE",
    },
  ];

  const marcas = await obtenerMarcas();
  const marcasConImagenes = marcas.map(mark => {
    let imagenUrl = "";
    if (mark.imagen_marca) {
      imagenUrl = process.env.NEXT_PUBLIC_SIGNALR_URL + mark.imagen_marca;
    }
    return { ...mark, imagen: imagenUrl };
  });

  const Banners = [
    {
      imagen: "/cuadro-banners/NOVEDADES-NUEVA-LINEA-POWERTOP-PLUS.webp",
      nombre: "Nueva línea Powertop Plus para conexiones industriales",
    },
    {
      imagen: "/cuadro-banners/NOVEDADES-ENCHUFER-TOMAS-INDUSTRIALES.webp",
      nombre: "Enchufes y tomas industriales de alta resistencia",
    },
    {
      imagen: "/cuadro-banners/NOVEDADES-HIGH-BAY-LED-PARA-INDUSTRIA.webp",
      nombre: "Reflectores High Bay LED para uso industrial",
    },
    {
      imagen: "/cuadro-banners/NOVEDADES-LINEA-CAMTYPE-CONECTORES-UNIPOLARES.webp",
      nombre: "Conectores unipolares CAMTYPE para instalaciones eléctricas",
    },
    {
      imagen: "/cuadro-banners/NOVEDADES-CAJAS-COMBINADAS-AMAXX.webp",
      nombre: "Cajas combinadas AMAXX para distribución eléctrica",
    },
  ];

  return (
    <>
      <Script id="schema-org-home" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Sholi Iluminación",
          url: "https://www.sholi.com",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://www.sholi.com/buscar?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}
      </Script>

      <Script id="schema-org-org" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Sholi Iluminación",
          url: "https://www.sholi.com",
          logo: "https://www.sholi.com/logo-sholi.webp",
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+51 999 999 999",
            contactType: "Atención al cliente",
            areaServed: "PE",
            availableLanguage: "es"
          },
          sameAs: [
            "https://www.facebook.com/sholi",
            "https://www.instagram.com/sholi",
            "https://wa.me/51999999999"
          ]
        })}
      </Script>
      <h1 className="sr-only">
        Sholi - Tienda de iluminación LED y productos eléctricos en Perú
      </h1>
      <CarruselBanner imagenes={imagenesCarrusel} />
      <CarruselBannerJS />
      <section className="max-w-5xl mx-auto px-4 py-10 text-gray-700">
        <h2 className="text-2xl font-bold mb-4">Bienvenido a Sholi Perú</h2>
        <p>
          Somos tu tienda online de <strong>iluminación LED</strong> y productos eléctricos.
          Descubre nuestra amplia variedad de <strong>focos LED</strong>, <strong>lámparas modernas</strong>,
          <strong>reflectores</strong>, <strong>enchufes industriales</strong> y <strong>material eléctrico</strong>.
          Enviamos a todo el Perú con atención inmediata.
        </p>
      </section>
      {categorias.length > 0 && categorias[0].valorConsulta === "1" && (
        <>
          <h2 className="text-3xl font-bold mb-6 text-center">
            Nuestras categorias
          </h2>
          <CarruselCategorias categorias={categoriasConImagenes} />
        </>)
      }
      <Slider modo="certificado" contenido={certificados} />
      <SliderJS modo="certificado" />
      {productosCrudos.length > 0 && productosCrudos[0].valorConsulta === "1" && (
        <>
          <CarruselProductos productos={productos} />
        </>
      )}

      <Banner />
      <CuadroDeBanners contenido={Banners} />
      {marcas.length > 0 && marcas[0].valorConsulta === "1" &&(
        <>
          <Slider modo="marcas" contenido={marcasConImagenes} />
          <SliderJS modo="marcas" intervalo={4000} />
        </>
      )}

      <PreguntasFrecuentes />
    </>
  );
}
