import Image from "next/image";

export default function Banner() {
  return (
    <section className="py-6 bg-white text-center">
      <div className="w-full max-w-[1520px] mx-auto relative">
        {/* un solo <Image> responsive */}
        <Image
          src="/banner/BANNER-DE-DESCUENTO-EN-MARCA-ALEX-WEB.webp"
          alt="Descuento exclusivo en productos de la marca ALEX"
          fill         /* ocupa todo el contenedor */
          className="rounded-xl object-cover"
          sizes="(max-width: 767px) 430px, 1520px"
          priority     /* quítalo si el banner no es LCP */
        />
        <div className="block md:hidden pb-[13.8%]" />
        <div className="hidden md:block pb-[13.8%]" />
      </div>
    </section>
  );
}
