{/* Sliders */ }
import Slider from "@/components/Home/Slider";
import SliderJS from "@/components/Home/SliderJs";

import Script from "next/script";

{/* Carrusel productos con descuento */ }
import CarruselProductos from "@/components/Home/CarruselProductos";

{/* Llamadas Api */ }
import { obtenerMarcas, obtenerProductosConDescuento, obtenerCategorias } from "@/lib/api";

{/* Carrusel banners */ }
import BannerHome from "@/components/CarrucelBanner/CarruselHome"

{/* Carrusel banner */ }
import Banner from "@/components/Home/Banner";

{/* Carrusel categorias */ }
import CarruselCategorias from "@/components/Home/CarruselCategorias";

{/* CuadroDeBanners */ }
import CuadroDeBanners from "@/components/Home/CuadroDeBanners";

{/* Preguntas Frecuentes */ }
import PreguntasFrecuentes from "@/components/PreguntasFrecuentes";

{/* WspFlot */}
import WspFlot from "@/components/WspFlot";

{/* Animacion de viewport */}
import AnimationBlock from "@/components/Animaciones/AnimationBlock";

{/* Metadatos del Index */}
export async function generateMetadata() {
  return {
    title: "Sholi - Productos ferreteros",
    description: "Explora la mayor variedad de productos LED: focos, lámparas, reflectores y más. Envío a todo el Perú. Calidad certificada y atención inmediata.",
    keywords: [
      "iluminación LED",
      "tienda de focos",
      "lámparas LED",
      "reflectores LED",
      "productos eléctricos Perú",
      "comprar luces online"
    ],
    openGraph: {
      title: "Sholi - tienda de productos ferreteros en todo el Perú",
      description: "Descubre ofertas en productos de iluminación LED certificados. Compra online con garantía y envío nacional.",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
      siteName: "Sholi Iluminación",
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo/logo-principal-prasen.webp`,
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
      description: "Focos, lámparas, reflectores LED y más. Envíos rápidos en todo Perú.",
      images: [`${process.env.NEXT_PUBLIC_SITE_URL}/logo/logo-principal-prasen.webp`],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}`,
    },
    authors: [{ name: "Sholi", url: `${process.env.NEXT_PUBLIC_SITE_URL}` }],
    creator: "Sholi",
    publisher: "Sholi",
    category: "ecommerce",
  };
}

export default async function Home() {
  {/* AnimationHead */}
  <AnimationBlock/>

  {/* Bloque para mostrar los productos con descuento en el slider de abajo*/}
  const productosCrudos = await obtenerProductosConDescuento(); // llamada a la api para obtener los productos con descuento
  const productos = productosCrudos.map((producto) => ({
    ...producto,
    urlImagen1: producto.urlImagen1 ? process.env.NEXT_PUBLIC_SIGNALR_URL + producto.urlImagen1 : "/not-found.webp", //se filtra la imagen 1 para ver si tiene o no
    urlImagen2: producto.urlImagen2 ? process.env.NEXT_PUBLIC_SIGNALR_URL + producto.urlImagen2 : "/not-found.webp", //se filtra la imagen 2 para ver si tiene o no
  }));

  {/* Bloque para mostrar los productos con descuento en el slider de abajo*/}
  const categorias = await obtenerCategorias(); // llamada a la api para obtener las categorias
  const categoriasConImagenes = categorias.map(cat => {
    let imagenUrl = "";
    if (cat.imagen_categoria) {
      imagenUrl = process.env.NEXT_PUBLIC_SIGNALR_URL + cat.imagen_categoria; //se filtra la imagen para ver si tiene o no
    }
    return { ...cat, imagen: imagenUrl };
  });

  {/* Bloque para obtener marcas */}
  const marcas = await obtenerMarcas();
  const marcasConImagenes = marcas.map(mark => {
    let imagenUrl = "";
    if (mark.imagen_marca) {
      imagenUrl = process.env.NEXT_PUBLIC_SIGNALR_URL + mark.imagen_marca; // se filtra la imagen para ver si tiene o no
    }
    return { ...mark, imagen: imagenUrl };
  });

  {/* Bloque para las imagenes de los certificados */}
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

  {/* Imagenes para el carrucel principal */}
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

  {/* Imagenes para el bloque de banners abajo */}
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
          url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
          potentialAction: {
            "@type": "SearchAction",
            target: `${process.env.NEXT_PUBLIC_SITE_URL}/tienda?buscar={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        })}
      </Script>

      <Script id="schema-org-org" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Sholi Iluminación",
          url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
          logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo/logo-principal-prasen.webp`,
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
      
      {/* Titulo invisible */}
      <h1 className="sr-only">
        Sholi - Tienda de iluminación LED y productos eléctricos en Perú
      </h1>

      {/* Carrusel de banners */}
      <BannerHome imagenes={imagenesCarrusel} />

      <section className="max-w-5xl mx-auto px-4 py-10 text-gray-700">
        <h2 className="text-2xl font-bold mb-4">Bienvenido a Sholi Perú</h2>
        <p>
          Somos tu tienda online de <strong>iluminación LED</strong> y productos eléctricos.
          Descubre nuestra amplia variedad de <strong>focos LED</strong>, <strong>lámparas modernas</strong>,
          <strong>reflectores</strong>, <strong>enchufes industriales</strong> y <strong>material eléctrico</strong>.
          Enviamos a todo el Perú con atención inmediata.
        </p>
      </section>

      {/* Bloque para mostrar las categorias, en aso de que haya una o mas*/}
      {categorias.length > 0 && categorias[0].valorConsulta === "1" && (
        <>
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#7c141b] to-[#3C1D2A] text-transparent bg-clip-text">
            Nuestras categorías
          </h2>
          <CarruselCategorias categorias={categoriasConImagenes} />
          <SliderJS modo="categorias" />
        </>)
      }

      {/* Slider para el certificado y su js para el funcionamiento */}
      <Slider modo="certificado" contenido={certificados} />
      <SliderJS modo="certificado" />

      {/* Bloque que muestra los productos con descuento en caso de haberlos */}
      {productosCrudos.length > 0 && productosCrudos[0].valorConsulta === "1" && (
        <>
          <CarruselProductos productos={productos} />
        </>
      )}
      <Banner />
      <CuadroDeBanners contenido={Banners} />
      
      {/* Bloque para mostrar las marcas en caso de haberlos */}
      {marcas.length > 0 && marcas[0].valorConsulta === "1" && (
        <>
          <Slider modo="marcas" contenido={marcasConImagenes} />
          <SliderJS modo="marcas" intervalo={4000} />
        </>
      )}

      {/* Bloque para mostrar el acordeno de preguntas frecuentes */}
      <PreguntasFrecuentes />

      <WspFlot/>
    </>
  );
}
