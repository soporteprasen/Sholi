// CarruselCategorias.jsx
import Link from "next/link";
import Image from "next/image";

export default function CarruselCategorias({ categorias }) {
  return (
    <section aria-label="Categorías de productos" role="region" tabIndex={0} className="w-full overflow-x-auto scroll-smooth px-4 pr-4">
      <div
        className="flex gap-4 py-4 pr-2 snap-x snap-mandatory justify-start md:justify-center"
        role="list"
      >
        {categorias.map((cat, index) => (
          <Link
            key={index}
            href={`/categoria/${cat.slug_categoria}`}
            role="listitem"
            className="w-[160px] flex-shrink-0 bg-white rounded-lg px-3 py-4 shadow-sm hover:shadow-md transition text-center snap-start"
            draggable={false}
          >
            <Image
              src={cat.imagen || "/not-found.webp"}
              alt={`Categoría ${cat.nombre}`}
              width={160}
              height={140}
              className="h-24 w-full object-contain mb-2"
              loading="lazy"
              draggable={false}
            />
            <h3
              className="font-semibold text-[13px] text-gray-800 uppercase tracking-wide leading-tight line-clamp-2"
              title={cat.nombre}
            >
              {cat.nombre}
            </h3>
          </Link>
        ))}

        {/* Espaciador final */}
        <span className="w-1 flex-shrink-0" aria-hidden="true" />
      </div>
    </section>
  );
}
