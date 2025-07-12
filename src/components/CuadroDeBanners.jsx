"use client";
import Image from "next/image";

const CuadroDeBanners = ({ contenido }) => {
  if (!contenido || contenido.length === 0) return null;

  const imagenGrande = contenido[0];
  const imagenesRestantes = contenido.slice(1);

  return (
    <section className="py-12 px-4 bg-white">
      <h2 className="text-xl md:text-2xl font-semibold text-blue-900 mb-10 text-center">
        Novedades en materiales y productos eléctricos
      </h2>

      {/* PC: Banner grande + lateral */}
      <div className="hidden md:grid grid-cols-3 gap-6 max-w-[1520px] mx-auto mb-6">
        <div className="col-span-2 rounded-xl overflow-hidden">
          <Image
            src={imagenGrande.imagen}
            alt={imagenGrande.nombre}
            width={1200}
            height={350}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-xl overflow-hidden">
          <Image
            src={imagenesRestantes[0].imagen}
            alt={imagenesRestantes[0].nombre}
            width={600}
            height={350}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
      </div>

      {/* Móvil: Slider */}
      <div className="block md:hidden">
        <div className="flex overflow-x-auto gap-6 px-1 scrollbar-hide snap-x snap-mandatory">
          {imagenesRestantes.slice(1).map((item, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 snap-start rounded-xl overflow-hidden"
              style={{ minWidth: "290px", maxWidth: "290px" }}
            >
              <Image
                src={item.imagen}
                alt={item.nombre}
                width={290}
                height={126}
                sizes="(max-width:768px) 290px"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* PC: Cuadrícula adicional */}
      <div className="hidden md:grid grid-cols-3 auto-rows-auto gap-6 max-w-[1520px] mx-auto">
        {imagenesRestantes.slice(1).map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl overflow-hidden border shadow-sm hover:shadow-lg transition"
          >
            <Image
              src={item.imagen}
              alt={item.nombre || `Banner ${idx + 1}`}
              width={580}
              height={320}
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CuadroDeBanners;
