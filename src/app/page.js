import Carrusel from "@/components/CarruselGlob";
import Slider from "@/components/Slider";
import Banner from "@/components/Banner";
import CuadroDeBanners from "@/components/CuadroDeBanners";
import PreguntasFrecuentes from "@/components/PreguntasFrecuentes";

export async function generateMetadata() {
  return {
    title: 'Inicio | Tienda de Iluminación LED',
    description: 'Compra focos, lámparas y productos LED con envío a todo el Perú.',
    openGraph: {
      title: 'Inicio | Tienda de Iluminación',
      description: 'Descubre ofertas en iluminación LED.',
      url: 'https://www.sholi.com',
      siteName: 'Tienda de Iluminación',
      locale: 'es_PE',
      type: 'website',
    },
  };
}

export default function Home() {
  return (
    <>
      <Carrusel modelo="banner" />
      <h2 className="text-3xl font-bold mb-6 text-center">
        Nuestras categorias
      </h2>
      <Carrusel modelo="categoria"/>
      <Slider modo="certificado" />
      <Carrusel modelo="producto" />
      <Banner />
      <CuadroDeBanners />
      <Slider modo="marcas"/>
      <PreguntasFrecuentes />
    </>
  );
}
