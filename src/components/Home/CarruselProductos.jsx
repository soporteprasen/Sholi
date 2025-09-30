import BotonWsp from "@/components/BotonWsp";
import Link from "next/link";
import Image from "next/image";

export default function CarruselProductos({ productos }) {
  const getVariant = (url, size) =>
    url.replace("/original/", `/${size}/`);

  return (
    <section
      id="carrusel-productos"
      role="region"
      aria-label="Carrusel de productos con descuento"
      className="max-w-[1520px] mx-auto overflow-x-auto scroll-smooth px-4 relative"
    >
      <div className="flex gap-4 py-4 snap-x snap-mandatory">
        {productos.map((item, index) => (
          <div
            key={index}
            itemScope
            itemType="https://schema.org/Product"
            className="group w-[48vw] sm:w-[45vw] md:w-[33vw] lg:w-[280px] flex-shrink-0 flex flex-col border rounded-lg overflow-hidden shadow-sm bg-white hover:shadow-md transition snap-start text-center"
          >
            {/* Schema.org */}
            <meta itemProp="name" content={item.nombre} />
            <meta itemProp="brand" content={item.marca} />
            <meta itemProp="description" content={item.descripcion} />
            <meta itemProp="image" content={item.urlImagen1} />
            <meta itemProp="sku" content={item.codigo} />
            <meta
              itemProp="url"
              content={`https://prasen.pe/producto/${item.nombreSlug}`}
            />

            {/* Card clicable */}
            <Link
              href={`/producto/${item.nombreSlug}`}
              prefetch={false}
              className="flex flex-col flex-grow hover:underline"
            >
              <div className="relative bg-gray-100 rounded-t-xl overflow-hidden">
                <div className="relative aspect-square w-full max-w-[307px] bg-gray-100 rounded-t-xl overflow-hidden">
                  <Image
                    src={getVariant(item.urlImagen1, "md")}
                    alt={`${item.nombre} de la marca ${item.marca}`}
                    fill
                    unoptimized
                    className="absolute inset-0 object-cover transition-opacity duration-500 opacity-100 group-hover:opacity-0"
                    srcSet={`
                      ${getVariant(item.urlImagen1, "sm")} 190w
                    `}
                    sizes="(max-width: 767px) 190px, 307px"
                    priority={index === 0}
                  />

                  <Image
                    src={getVariant(item.urlImagen2, "md")}
                    alt={`${item.nombre} de la marca ${item.marca}`}
                    fill
                    unoptimized
                    className="absolute inset-0 object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                    srcSet={`
                      ${getVariant(item.urlImagen2, "sm")} 190w
                    `}
                    sizes="(max-width: 767px) 190px, 307px"
                    loading="lazy"
                    fetchPriority="low"
                  />
                </div>
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <p className="text-sm text-gray-500 italic">
                  Marca:{" "}
                  <span className="font-medium text-gray-700">{item.marca}</span>
                </p>
                <h3 className="text-md font-semibold leading-tight line-clamp-2">
                  {item.nombre}
                </h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-4">
                  {item.descripcion}
                </p>

                <div className="mt-auto pt-3">
                  <p className="text-gray-600 line-through text-sm">
                    S/. {item.precio}
                  </p>
                  <p className="text-green-700 font-bold text-base">
                    S/.{" "}
                    {(item.precio - (item.precio * item.descuento) / 100).toFixed(2)}
                  </p>
                  <span className="inline-block mt-1 text-xs bg-red-200 text-red-700 px-2 py-0.5 rounded font-semibold">
                    -{item.descuento}% OFF
                  </span>
                </div>

                <div
                  itemProp="offers"
                  itemScope
                  itemType="https://schema.org/Offer"
                >
                  <meta itemProp="priceCurrency" content="PEN" />
                  <meta
                    itemProp="price"
                    content={(
                      item.precio -
                      (item.precio * item.descuento) / 100
                    ).toFixed(2)}
                  />
                  <link itemProp="availability" href="https://schema.org/InStock" />
                </div>
              </div>
            </Link>

            <div className="flex items-center justify-between gap-2 mt-4">
              <div>
                <BotonWsp
                  tipo="tienda"
                  codigo={item.codigo}
                  nombre={item.nombre}
                  nombreSlug={item.nombreSlug}
                />
              </div>

              <Link
                href={`/producto/${item.nombreSlug}`}
                prefetch={false}
                className="flex items-center gap-1 text-[#7c141b] hover:text-[#3C1D2A] hover:underline px-2 py-2 transition w-full justify-center"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                Ver detalles
              </Link>
            </div>
          </div>
        ))}

        {/* Espaciador final */}
        <span className="w-1 flex-shrink-0" aria-hidden="true" />
      </div>
    </section>
  );
}
