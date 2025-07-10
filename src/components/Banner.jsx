"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ObtenerImagenProducto } from "@/lib/api";

const Banner = () => {
  const [url, setUrl] = useState(null);

  // useEffect(() => {
  //   const cargarImagen = async () => {
  //     try {
  //       const blob = await ObtenerImagenProducto("imagenes/banner/BANNER-DE-DESCUENTO-ALEX-WEB.webp");
  //       const urlTemporal = URL.createObjectURL(blob);
  //       setUrl(urlTemporal);
  //     } catch (e) {
  //       console.error("Error cargando banner:", e);
  //       setUrl("/not-found.webp");
  //     }
  //   };

  //   cargarImagen();

  //   return () => {
  //     if (url?.startsWith("blob:")) {
  //       URL.revokeObjectURL(url);
  //     }
  //   };
  // }, []);

  if (!url) return null;

  return (
    <section className="py-6 bg-white text-center">
      <div className="w-full max-w-[1520px] mx-auto">
        <Image
          src={"/banner/BANNER-DE-DESCUENTO-ALEX-WEB.webp"}
          alt="Banner de descuento Alex"
          width={1920}
          height={600}
          className="w-full h-auto rounded-xl"
          priority
        />
      </div>
    </section>
  );
};

export default Banner;
