import { Heart, Eye } from "lucide-react";
import BotonWsp from "@/components/BotonWsp";
import Link from "next/link";
import Image from "next/image";

export default function ProductoCard({ producto }) {
  if (!producto?.id_producto || !producto?.nombre) return null;

  const precioFinal = producto.precio - (producto.precio * producto.descuento) / 100;

  return (
    <article
      className="border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition bg-white flex flex-col"
      itemScope
      itemType="https://schema.org/Product"
    >
      {/* SEO: metas invisibles útiles */}
      <meta itemProp="sku" content={producto.codigo || ""} />
      <meta itemProp="url" content={`https://prasen.pe/producto/${producto.nombreSlug}`} />
      <meta itemProp="productID" content={`prasen-${producto.id_producto}`} />
      <meta itemProp="name" content={producto.nombre} />
      <meta itemProp="brand" content={producto.marca} />
      <meta itemProp="description" content={producto.descripcion} />

      {/* Imagen del producto */}
      <div className="aspect-square relative w-full bg-gray-100">
        <Image
          src={producto.urlImagen1 || "/not-found.webp"}
          alt={`Imagen del producto ${producto.nombre} de la marca ${producto.marca}`}
          fill
          className="object-cover"
          loading="lazy"
          itemProp="image"
          unoptimized // si es externo y no está en 'domains' de next.config.js
        />
      </div>

      <div className="p-4 text-center flex flex-col flex-grow">
        <div className="flex-grow flex flex-col">
          {/* Marca */}
          <p className="text-sm text-gray-500 italic">
            Marca:{" "}
            <span className="font-medium text-gray-700" itemProp="brand">
              {producto.marca}
            </span>
          </p>

          {/* Nombre visible (ya definido en meta también) */}
          <h2 className="text-base sm:text-lg font-semibold text-blue-800 mb-1 line-clamp-2 min-h-[3rem]">
            {producto.nombre}
          </h2>

          {/* Descripción corta visible */}
          <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-4 min-h-[5rem]">
            {producto.descripcion}
          </p>
        </div>

        {/* Precio y oferta */}
        <div
          itemProp="offers"
          itemScope
          itemType="https://schema.org/Offer"
          className="mt-auto pt-3"
        >
          <meta itemProp="priceCurrency" content="PEN" />
          <meta itemProp="availability" content="https://schema.org/InStock" />
          <meta itemProp="url" content={`https://prasen.pe/producto/${producto.nombreSlug}`} />

          {producto.descuento > 0 ? (
            <>
              <p className="text-gray-400 line-through text-sm">
                S/. {producto.precio.toFixed(2)}
              </p>
              <p className="text-green-700 font-bold text-base" itemProp="price">
                {precioFinal.toFixed(2)}
              </p>
              <meta itemProp="price" content={precioFinal.toFixed(2)} />
              <span className="inline-block mt-1 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded font-semibold">
                -{producto.descuento}% OFF
              </span>
            </>
          ) : (
            <>
              <p className="text-gray-700 font-bold" itemProp="price">
                {producto.precio.toFixed(2)}
              </p>
              <meta itemProp="price" content={producto.precio.toFixed(2)} />
            </>
          )}
        </div>

        {/* Botones accesibles */}
        <div className="mt-4 flex justify-center rounded-md overflow-hidden border border-gray-200 divide-x">
          <button
            type="button"
            aria-label={`Agregar ${producto.nombre} a tu lista de deseos`}
            title={`Agregar ${producto.nombre} a la lista de deseos`}
            className="flex items-center justify-center gap-1 px-2 py-1 text-xs sm:text-sm text-pink-600 hover:bg-pink-50 transition w-full"
          >
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">Añadir</span>
          </button>

          <BotonWsp
            tipo="tienda"
            codigo={producto.codigo}
            nombre={producto.nombre}
            nombreSlug={producto.nombreSlug}
          />

          <Link
            href={`/producto/${producto.nombreSlug}`}
            title={`Ver detalles del producto ${producto.nombre}`}
            aria-label={`Ver detalles del producto ${producto.nombre}`}
            className="flex items-center justify-center gap-1 px-2 py-1 text-xs sm:text-sm text-blue-600 hover:bg-blue-50 transition w-full"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Ver</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
