"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import useSEO from '@/hooks/useSEO';
import { obtenerProductoPorSlug, ObtenerImagenProducto, ObtenerArchivoFicha} from "@/lib/api";
import Breadcrumbs from "@/components/Breadcrumbs";
import BotonWsp from "@/components/BotonWsp";
import { Tag, PackageCheck, ShoppingCart, Star, User } from "lucide-react";
import ProductosRelacionados from "@/components/ProductosRelacionados";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const params = useParams();
  const [producto, setProducto] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [imagenActiva, setImagenActiva] = useState(null);
  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const contenedorRef = useRef(null);
  const [cargando, setCargando] = useState(true);

  const slugCompleto = params?.slug?.join("/") || "";

  useEffect(() => {
    async function fetchProducto() {
      const respuesta = await obtenerProductoPorSlug(slugCompleto)
      if (respuesta) {
        setProducto(respuesta);
        setCargando(false);

        if (respuesta.ficha) {
          const ficha = await ObtenerArchivoFicha(respuesta.ficha);
          const url = URL.createObjectURL(ficha);
          if (url) {
            respuesta.ficha = url;
          }
        }

        // Cargar imágenes del producto
        const cargarImagenes = async () => {
          let imagenesCargadas = [];

          if (respuesta.imagenes && respuesta.imagenes.length > 0) {
            // Caso normal: cargar desde lista de imágenes
            imagenesCargadas = await Promise.all(
              respuesta.imagenes.map(async (img) => {
                try {
                  const blob = await ObtenerImagenProducto(img.urlImagen);
                  const url = URL.createObjectURL(blob);

                  let principalTipo = null;
                  if (respuesta.urlImagen1 === img.urlImagen) principalTipo = 1;
                  else if (respuesta.urlImagen2 === img.urlImagen) principalTipo = 2;

                  return {
                    ...img,
                    idImagenProducto: img.idImagen,
                    imagenBlob: blob,
                    imagenUrlTemporal: url,
                    principalTipo,
                  };
                } catch {
                  return null;
                }
              })
            );
          } else {
            // 🟡 Fallback: usar directamente urlImagen1 y urlImagen2
            const urls = [respuesta.urlImagen1, respuesta.urlImagen2];

            imagenesCargadas = await Promise.all(
              urls.map(async (url, index) => {
                try {
                  const blob = await ObtenerImagenProducto(url);
                  const imagenUrlTemporal = URL.createObjectURL(blob);
                  return {
                    idImagenProducto: null,
                    imagenBlob: blob,
                    imagenUrlTemporal,
                    urlImagen: url,
                    principalTipo: index === 0 ? 1 : 2,
                  };
                } catch {
                  return null;
                }
              })
            );
          }

          // Establecer estado final
          const filtradas = imagenesCargadas.filter(Boolean);
          setImagenes(filtradas);

          const principal =
            filtradas.find((img) => img.principalTipo === 1) ||
            filtradas.find((img) => img.principalTipo === 2) ||
            filtradas[0];

          setImagenActiva(principal?.imagenUrlTemporal || null);
        };

        await cargarImagenes();
        
      } else {
        setCargando(false);
      }
    }

    fetchProducto();
  }, [slugCompleto]);

  const handleMouseMove = (e) => {
    const rect = contenedorRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const isDesktop = typeof window !== "undefined" && window.innerWidth > 768;

  if (cargando) {
    return (
      <main className="bg-white max-w-[1300px] px-4 sm:px-6 lg:px-8 mx-auto py-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Imagen principal y miniaturas */}
          <div className="flex-1 space-y-4">
            <Skeleton className="w-full aspect-[1/1] rounded border" />
            <div className="flex gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-20 rounded" />
              ))}
            </div>
          </div>

          {/* Detalles del producto */}
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />

            {/* Precio */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>

            {/* Stock */}
            <Skeleton className="h-4 w-40" />

            {/* Botón agregar al carrito */}
            <Skeleton className="h-12 w-full rounded" />

            {/* Ficha técnica */}
            <Skeleton className="h-12 w-full rounded" />

            {/* Botón WhatsApp */}
            <Skeleton className="h-12 w-full rounded" />
          </div>
        </div>

        {/* Descripción extendida y productos relacionados */}
        <div className="mt-10 space-y-6">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />

          <Skeleton className="h-6 w-1/3 mt-6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />

          <Skeleton className="h-6 w-1/3 mt-6" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </main>
    );
  }

  if (!producto) {
    return (
      <main className="py-10 px-4 text-center text-red-500">
        Producto no encontrado.
      </main>
    );
  }

  return (
    <>
      {useSEO({
        title: `${producto.nombre} | Tienda`,
        description: producto.descripcion,
        image: producto.urlImagen1,
        price: producto.precio,
        availability: producto.stock > 0 ? 'in stock' : 'out of stock',
      })}

      <>
        <main className="bg-white" itemScope itemType="https://schema.org/Product">
          {/* Breadcrumbs con borde superior e inferior */}
          <div className="max-w-[1300px] px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="border-y border-gray-200 py-3">
              <Breadcrumbs items={[
                { label: "Inicio", href: "/" },
                { label: "Categoría", href: `/c/${producto.slug_Categoria}` },
                { label: producto.nombre }
              ]} />
            </div>
          </div>

          {/* Contenido principal */}
          <div className="max-w-[1300px] px-4 sm:px-6 lg:px-8 mx-auto flex flex-col md:flex-row gap-8 items-start relative">
            {/* Imagen principal */}
            <div className="flex-1 relative">
              <div
                ref={contenedorRef}
                className="relative w-full aspect-[1/1] border rounded overflow-hidden"
                onMouseEnter={() => isDesktop && setZoomVisible(true)}
                onMouseLeave={() => setZoomVisible(false)}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={imagenActiva}
                  alt={`Imagen principal de ${producto.nombre}`}
                  className="w-full h-full object-contain pointer-events-none"
                  loading="lazy"
                  itemProp="image"
                />
              </div>

              {zoomVisible && (
                <div
                  className="absolute top-0 left-[105.4%] aspect-[1/1] w-full md:w-[100%] z-40 border rounded shadow-xl bg-white hidden md:block"
                  style={{
                    backgroundImage: `url(${imagenActiva})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "200% 200%",
                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  }}
                />
              )}

              {/* Miniaturas */}
              <div className="flex gap-4 mt-4">
                {imagenes.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.imagenUrlTemporal}
                    alt={`Miniatura ${idx + 1} de ${producto.nombre}`}
                    className={`h-20 w-20 object-contain border rounded cursor-pointer hover:scale-105 transition ${
                      imagenActiva === img.imagenUrlTemporal ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setImagenActiva(img.imagenUrlTemporal)}
                  />
                ))}
              </div>
            </div>

            {/* Información del producto */}
            <div className="flex-1 space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold" itemProp="name">
                {producto.nombre}
              </h1>
              <p className="text-gray-700 text-sm" itemProp="description">
                {producto.descripcion}
              </p>

              {/* Precio */}
              <div
                className="flex items-center gap-4 text-2xl font-semibold mt-2 flex-wrap"
                itemProp="offers"
                itemScope
                itemType="https://schema.org/Offer"
              >
                {producto.descuento > 0 ? (
                  <>
                    <span
                      className="text-green-700 font-bold text-2xl"
                      itemProp="price"
                      content={(producto.precio - (producto.precio * producto.descuento / 100)).toFixed(2)}
                    >
                      S/. {(producto.precio - (producto.precio * producto.descuento / 100)).toFixed(2)}
                    </span>

                    <span className="text-gray-400 line-through text-lg">
                      S/. {producto.precio.toFixed(2)}
                    </span>

                    <span className="bg-red-100 text-red-600 text-sm px-3 py-1 rounded font-semibold">
                      -{producto.descuento}% OFF
                    </span>
                  </>
                ) : (
                  <span
                    className="text-gray-800"
                    itemProp="price"
                    content={producto.precio.toFixed(2)}
                  >
                    S/. {producto.precio.toFixed(2)}
                  </span>
                )}

                <meta itemProp="priceCurrency" content="PEN" />
                <link
                  itemProp="availability"
                  href={`https://schema.org/${producto.stock > 0 ? "InStock" : "OutOfStock"}`}
                />
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-2" itemProp="availability">
                <PackageCheck className="w-5 h-5 text-green-500" aria-hidden="true" />
                {producto.stock > 0
                  ? `Disponible: ${producto.stock} unidades`
                  : "Sin stock"}
              </div>

              {/* Botón agregar al carrito */}
              <button
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
                aria-label={`Agregar ${producto.nombre} al carrito`}
              >
                <ShoppingCart className="w-5 h-5" aria-hidden="true" />
                Agregar al carrito
              </button>
              {producto.ficha && (
                <a
                  href={producto.ficha || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!producto.ficha) {
                      e.preventDefault();
                      alert("No hay ficha técnica disponible para este producto.");
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded hover:bg-green-700 transition mt-4"
                  aria-label={`Ver ficha técnica de ${producto.nombre}`}
                >
                  📄 Ver Ficha Técnica
                </a>
              )}
              {/* Botón WhatsApp */}
              <BotonWsp
                tipo="producto"
                codigo={producto.codigo}
                nombre={producto.nombre}
                nombreSlug={producto.nombreSlug}
              />
            </div>
          </div>

          {/* Información extendida */}
          <div className="mt-10 space-y-10 max-w-[1200px] mx-auto px-4">
            {producto.descripcion && (
              <section>
                <h2 className="text-xl font-semibold mb-2">Descripción detallada</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {producto.descripcion}
                </p>
              </section>
            )}

            {producto.especificaciones && (
              <section>
                <h2 className="text-xl font-semibold mb-2">Especificaciones técnicas</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {producto.especificaciones.split("\n").map((linea, i) => (
                    <li key={i}>{linea}</li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <h2 className="text-xl font-semibold mb-2">Preguntas frecuentes</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>¿Cuánto demora el envío?</li>
                <li>¿El producto tiene garantía?</li>
                <li>¿Puedo devolver el producto si no me gusta?</li>
              </ul>
            </section>

            {/* Productos relacionados */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Productos relacionados</h2>
              <ProductosRelacionados idProducto={producto.id_producto}/>
            </section>
          </div>
        </main>
      </>
    </>
  );
}
