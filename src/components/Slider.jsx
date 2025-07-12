export default function Slider({ contenido = [], modo = "certificado" }) {
  const isMarcas = modo === "marcas";
  const isCertificados = modo === "certificado";

  const elementosVisibles = isMarcas
    ? [...contenido, ...contenido, ...contenido]
    : contenido;

  return (
    <section
      className="py-12 bg-white text-center select-none relative"
      data-slider={modo}
    >
      <h2 className="flex justify-center items-center text-xl md:text-2xl font-semibold text-blue-900 mb-10 gap-3 px-4">
        {isCertificados ? (
          <svg className="text-green-600 w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" strokeWidth="2" />
          </svg>
        ) : (
          <svg className="text-yellow-500 w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2" />
          </svg>
        )}
        {isCertificados
          ? "Nuestros productos eléctricos respaldados por certificaciones"
          : "Marcas que representamos"}
      </h2>

      {isMarcas && (
        <div className="absolute top-2 left-2 flex items-center gap-2 md:hidden text-gray-700 text-xs">
          <svg className="w-4 h-4 animate-bounce-x" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M16 17l-4 4m0 0l-4-4m4 4V3" strokeWidth="2" />
          </svg>
          <span>Desliza</span>
        </div>
      )}

      <div className="slider-scroll overflow-x-auto scroll-smooth no-scrollbar cursor-grab active:cursor-grabbing">
        <div className="slider-contenido inline-flex gap-6 px-4 mx-auto snap-x snap-mandatory">
          {elementosVisibles.map((item, i) => (
            <div
              key={i}
              className="flex-shrink-0 snap-start bg-white rounded-xl flex items-center justify-center"
              style={{ minWidth: "200px", minHeight: "190px" }}
            >
              {isMarcas ? (
                <a
                  href={`/tienda/${item.slug_marca}`}
                  className="flex flex-col items-center hover:opacity-90 transition"
                  draggable={false}
                >
                  <img
                    src={item.imagenUrlTemporal || item.imagen || item.url || "/not-found.webp"}
                    alt={item.nombre || item.NombreArchivo || "Imagen"}
                    className="object-contain max-w-[215px] max-h-[215px]"
                    draggable="false"
                  />
                </a>
              ) : (
                <img
                  src={item.imagenUrlTemporal || item.imagen || item.url || "/not-found.webp"}
                  alt={item.nombre || item.NombreArchivo || "Imagen"}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="object-contain max-w-[215px] max-h-[215px]"
                  draggable="false"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
