import BotonWsp from "@/components/BotonWsp";
import Link from "next/link";
import Image from "next/image";

export default function ProductoCard({ producto, index, numero, mensajeBase, baseUrl }) {

  const getVariant = (url, size) =>
    url.replace("/original/", `/${size}/`);

  if (!producto?.id_producto || !producto?.nombre) return null;

  const precioFinal =
    producto.precio - (producto.precio * producto.descuento) / 100;

  return (
    <article
      className="h-full flex flex-col border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition bg-white"
      itemScope
      itemType="https://schema.org/Product"
    >
      {/* SEO meta */}
      <meta itemProp="sku" content={producto.codigo || ""} />
      <meta
        itemProp="url"
        content={`${process.env.NEXT_PUBLIC_SITE_URL}/producto/${producto.nombreSlug}`}
      />
      <meta itemProp="productID" content={`prasen-${producto.id_producto}`} />
      <meta itemProp="name" content={producto.nombre} />
      <meta itemProp="brand" content={producto.marca} />
      <meta itemProp="description" content={producto.descripcion} />

      {/* Hacemos que TODO el contenido (menos el botón) crezca para igualar alturas */}
      <Link
        href={`/producto/${producto.nombreSlug}`}
        title={`Ver detalles del producto ${producto.nombre}`}
        aria-label={`Ver detalles del producto ${producto.nombre}`}
        className="group flex-1 flex flex-col"
      >
        {/* IMAGEN */}
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
          <Image
            src={getVariant(producto.urlImagen1, "md")}
            alt={`Imagen del producto ${producto.nombre} de la marca ${producto.marca}`}
            width={307}
            height={307}
            sizes="(max-width:640px) 174px, 307px"
            priority={index === 0}
            className="object-contain w-full h-auto"
          />
        </div>

        {/* CONTENIDO con alturas fijas por bloque */}
        <div className="p-4 text-center flex flex-col flex-1">
          {/* Marca (una línea corta) */}
          <p className="text-sm text-gray-500 italic">
            Marca:{" "}
            <span className="font-medium text-gray-700" itemProp="brand">
              {producto.marca}
            </span>
          </p>

          {/* Nombre: 3 líneas exactas */}
          {/* text-lg => leading-7 (1.75rem) => 3 líneas = 5.25rem */}
          <h2 className="mt-1 text-lg leading-7 font-semibold text-[#3C1D2A] line-clamp-3 min-h-[5.25rem] break-words">
            {producto.nombre}
          </h2>

          {/* Descripción: 2 líneas exactas */}
          {/* text-sm => leading-5 (1.25rem) => 2 líneas = 2.5rem */}
          <p className="mt-1 text-sm leading-5 text-gray-600 line-clamp-2 min-h-[2.5rem]">
            {producto.descripcion}
          </p>

          {/* Precio/oferta con altura estable */}
          <div
            itemProp="offers"
            itemScope
            itemType="https://schema.org/Offer"
            className="mt-auto pt-3 min-h-16" /* 64px aprox para cubrir ambos casos */
          >
            <meta itemProp="priceCurrency" content="PEN" />
            <meta
              itemProp="availability"
              content="https://schema.org/InStock"
            />
            <meta
              itemProp="url"
              content={`${process.env.NEXT_PUBLIC_SITE_URL}/producto/${producto.nombreSlug}`}
            />

            {producto.descuento > 0 ? (
              <>
                <p className="text-neutral-700 line-through text-sm">
                  S/. {producto.precio.toFixed(2)}
                </p>
                <p className="text-green-700 font-bold text-base" itemProp="price">
                  {precioFinal.toFixed(2)}
                </p>
                <meta itemProp="price" content={precioFinal.toFixed(2)} />
                <span className="inline-block mt-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-semibold">
                  -{producto.descuento}% OFF
                </span>
              </>
            ) : (
              <>
                <p className="text-green-700 font-bold" itemProp="price">
                  {producto.precio.toFixed(2)}
                </p>
                <meta itemProp="price" content={producto.precio.toFixed(2)} />
              </>
            )}
          </div>
        </div>
      </Link>

      {/* Botón con altura consistente (opcional) */}
      <div className="h-12 flex items-center justify-center border-t border-gray-200 px-2">
        <BotonWsp
          tipo="tienda"
          codigo={producto.codigo}
          nombre={producto.nombre}
          nombreSlug={producto.nombreSlug}
          numero={numero}         
          mensajeBase={mensajeBase}
          baseUrl={baseUrl}
        />
      </div>
    </article>
  );
}
