import CarruselBase from "./CarruselBase";

export default function CarruselBannerMobile({ imagenes }) {
  const imagenesProcesadas = imagenes.map((img) => ({
    src: img.mobile || "/not-found-banner.webp",
    alt: img.alt,
  }));

  return (
    <div className="block md:hidden">
      <CarruselBase
        id="banner-carousel-mobile"
        imagenes={imagenesProcesadas}
        ancho={412}
        alto={412}
        sizes="412px"
      />
    </div>
  );
}
