export default function CarruselProductos({ productos }) {
  return (
    <section
      id="carrusel-productos"
      aria-label="Productos en oferta"
      className="max-w-[1520px] mx-auto overflow-x-auto scroll-smooth px-4 relative"
    >
      <div className="flex gap-4 py-4 snap-x snap-mandatory">
        {productos.map((item, index) => (
          <div
            key={index}
            className="group w-[80vw] sm:w-[45vw] md:w-[33vw] lg:w-[280px] flex-shrink-0 flex flex-col border rounded-lg overflow-hidden shadow-sm bg-white hover:shadow-md transition snap-start text-center"
          >
            <div className="relative aspect-square bg-gray-100">
              <img
                src={item.urlImagen1 || "/not-found.webp"}
                alt={item.nombre}
                className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500 opacity-100 group-hover:opacity-0"
                loading="lazy"
                draggable = "false"
              />
              <img
                src={item.urlImagen2 || "/not-found.webp"}
                alt={item.nombre}
                className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                loading="lazy"
                draggable = "false"
              />
            </div>

            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-md font-semibold leading-tight line-clamp-2">
                {item.nombre}
              </h2>
              <p className="text-gray-600 text-sm mt-1 line-clamp-4">
                {item.descripcion}
              </p>

              <div className="mt-auto pt-3">
                <p className="text-gray-400 line-through text-sm">
                  S/. {item.precio.toFixed(2)}
                </p>
                <p className="text-green-700 font-bold text-base">
                  S/. {(item.precio - item.precio * item.descuento / 100).toFixed(2)}
                </p>
                <span className="inline-block mt-1 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded font-semibold">
                  -{item.descuento}% OFF
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 mt-4">
                <button className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition w-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                  </svg>
                  <span className="text-sm font-medium">Comprar</span>
                </button>

                <a
                  href={`/p/${item.nombreSlug}`}
                  className="flex items-center gap-1 text-blue-600 hover:underline px-2 py-2 transition w-full justify-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  Ver detalles
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
   </section>
  );
}
