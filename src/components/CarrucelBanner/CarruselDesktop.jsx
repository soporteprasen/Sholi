import CarruselBase from "./CarruselBase";

export default function CarruselBannerDesktop({ imagenes }) {
  const imagenesProcesadas = imagenes.map((img, i) => ({
    src: img.desktop || "/not-found-banner.webp",
    alt: img.alt ?? "",
    priority: i === 0,
  }));

  return (
    <div className="hidden md:block animate-slideInRight">
      <CarruselBase
        id="banner-carousel-desktop"
        imagenes={imagenesProcesadas}
        ancho={1335}
        alto={348}
        sizes="(max-width: 768px) 412px, 1335px"
      />
    </div>
  );
}
