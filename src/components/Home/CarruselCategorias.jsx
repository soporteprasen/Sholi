// CarruselCategorias.jsx
import Link from "next/link";
import Image from "next/image";

export default function CarruselCategorias({ categorias }) {
  const getVariant = (url, size) => 
    url.replace("/original/", `/${size}/`);

  return (
    <section
      aria-label="Categorías de productos"
      role="region"
      tabIndex={0}
      data-slider="categorias"
      className="w-full px-4"
    >
      {/* Contenedor scroll */}
      <div className="slider-scroll overflow-x-auto scroll-smooth no-scrollbar cursor-grab active:cursor-grabbing">
        <ul
          className="slider-contenido inline-flex gap-4 py-4 pl-4 pr-6 snap-x snap-mandatory"
          role="list"
        >
          {categorias.map((cat, index) => (
            <li key={index} role="listitem" className="snap-start">
              <Link
                href={`/categoria/${cat.slug_categoria}`}
                className="w-[160px] flex-shrink-0 bg-white rounded-lg px-3 py-4 border 
                           border-gray-200 shadow-sm hover:border-[#7c141b] hover:shadow-lg 
                           transition text-center block"
                draggable={false}
              >
                <Image
                  src={cat.imagen ? getVariant(cat.imagen, "sm") : "/not-found.webp"}
                  alt={`Categoría ${cat.nombre}`}
                  width={134}
                  height={96}
                  className="object-contain mb-2"
                  loading="lazy"
                  draggable={false}
                  unoptimized
                  sizes="134px"
                />
                <h3
                  className="font-semibold text-[13px] text-[#3C1D2A] uppercase tracking-wide 
                             leading-tight line-clamp-2 group-hover:text-[#7c141b]"
                  title={cat.nombre}
                >
                  {cat.nombre}
                </h3>
              </Link>
            </li>
          ))}
          <li aria-hidden="true">
            <span className="w-2 flex-shrink-0" />
          </li>
        </ul>
      </div>
    </section>
  );
}
