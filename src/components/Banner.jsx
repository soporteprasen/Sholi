"use client";
import Image from "next/image";
import { useState } from "react";

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

  return (
    <section className="py-6 bg-white text-center">
      <div className="w-full max-w-[1520px] mx-auto">
        {/* Vista móvil */}
        <div className="block md:hidden">
          <Image
            src={"/banner/BANNER-DE-DESCUENTO-ALEX-WEB.webp"}
            alt="Banner de descuento Alex"
            width={430}
            height={59}
            className="w-full h-auto rounded-xl"
          />
        </div>
        
        {/* Vista desktop */}
        <div className="hidden md:block">
          <Image
            src={"/banner/BANNER-DE-DESCUENTO-ALEX-WEB.webp"}
            alt="Banner de descuento Alex"
            width={1520}
            height={210}
            className="w-full h-auto rounded-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default Banner;
