// CarruselCategorias.jsx
export default function CarruselCategorias({ categorias }) {
  return (
    <section aria-label="Categorías de productos" className="w-full overflow-x-auto scroll-smooth px-4">
      <div className="flex gap-4 py-4 snap-x snap-mandatory justify-center">
        {categorias.map((cat, index) => (
          <a
            key={index}
            href={`/categoria/${cat.slug_categoria}`}
            className="w-[120px] flex-shrink-0 bg-white rounded-lg px-3 py-4 shadow-sm hover:shadow-md transition text-center snap-start"
            draggable={false}
          >
            <img
              src={cat.imagen || "/not-found.webp"}
              alt={`Categoría ${cat.nombre}`}
              width={140}
              height={140}
              className="h-24 w-full object-contain mb-2"
              loading="lazy"
              draggable="false"
            />
            <h3 className="font-semibold text-[13px] text-gray-800 uppercase tracking-wide leading-tight line-clamp-2">
              {cat.nombre}
            </h3>
          </a>
        ))}
      </div>
    </section>
  );
}
