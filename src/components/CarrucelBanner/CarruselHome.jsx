import CarruselBannerDesktop from "@/components/CarrucelBanner/CarruselDesktop";
import CarruselBannerMobile from "@/components/CarrucelBanner/CarruselMobile";
import CarruselBannerJS from "@/components/CarrucelBanner/CarruselBannerJS";

export default function BannerHome({ imagenes }) {
  return (
    <div className="scroll-animate">
      <CarruselBannerDesktop imagenes={imagenes} />
      <CarruselBannerMobile imagenes={imagenes} />

      {/* Controladores independientes */}
      <CarruselBannerJS id="banner-carousel-desktop" intervalo={5000} />
      <CarruselBannerJS id="banner-carousel-mobile" intervalo={5000} />
    </div>
  );
}
