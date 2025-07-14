"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Head from "next/head";
import * as Accordion from "@radix-ui/react-accordion";
import { Filter, X, Tag, Layers, Heart, Eye } from "lucide-react";
import FiltrosDesktop from "@/components/FiltrosDesktop";
import BotonWsp from "@/components/BotonWsp";
import { Skeleton } from "@/components/ui/skeleton";
import { obtenerProductosFiltrados, obtenerCategorias, obtenerMarcas, ObtenerImagenProducto } from "@/lib/api";

// Función para generar slugs amigables
function slugify(texto) {
  return texto
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function PaginaTienda() {
  const router = useRouter();
  const pathname = usePathname();

  const [pagina, setPagina] = useState(0);
  const [hayMas, setHayMas] = useState(true);
  const cantidadPorPagina = 8;

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [cargandoScroll, setCargandoScroll] = useState(false);
  const [mostrarFiltro, setMostrarFiltro] = useState(false);
  const [filtroAbierto, setFiltroAbierto] = useState(false);

  // Obtener slugs
  const slugParts = pathname.split("/").filter(Boolean);
  const categoriaSlug = slugParts[1] || "";
  const marcaSlug = slugParts[2] || "";

  // Decodificar para mostrar
  const categoriaSeleccionadaObj = categorias.find(cat => cat.slug_categoria?.toLowerCase() === categoriaSlug?.toLowerCase());
  const marcaSeleccionadaObj = marcas.find(mar => mar.slug_marca?.toLowerCase() === marcaSlug?.toLowerCase());
  const id_categoria = categoriaSeleccionadaObj?.id_categoria || null;
  const id_marca = marcaSeleccionadaObj?.id_marcas || null;

  const [accordionOpen, setAccordionOpen] = useState([]);

  useEffect(() => {
    if (!categorias.length || !marcas.length) return;

    const valores = [];
    if (categoriaSeleccionadaObj) valores.push("categorias");
    if (marcaSeleccionadaObj) valores.push("marcas");
    setAccordionOpen(valores);
  }, [categoriaSlug, marcaSlug, categorias, marcas]);

  // Cargar categorías y marcas
  useEffect(() => {
    const cargarFiltros = async () => {
      try {
        const [categoriasData, marcasData] = await Promise.all([
          obtenerCategorias(),
          obtenerMarcas()
        ]);
        setCategorias(categoriasData);
        setMarcas(marcasData);
      } catch (error) {
        console.error("Error al cargar filtros:", error);
      }
    };

    cargarFiltros();
  }, []);

  // Abrir y cerrar filtros (móvil)
  const abrirFiltro = () => {
    setMostrarFiltro(true);
    setTimeout(() => {
      setFiltroAbierto(true);
    }, 10);
  };

  const cerrarFiltro = () => {
    setFiltroAbierto(false);
    setTimeout(() => {
      setMostrarFiltro(false);
    }, 300);
  };

  // Cambiar categoría
  const cambiarCategoria = (nombre) => {
    if (nombre === "Todas") {
      router.push("/tienda");
      return;
    }
    const nuevaCategoriaSlug = slugify(nombre);
    if (marcaSlug) {
      router.push(`/categoria/${nuevaCategoriaSlug}/${marcaSlug}`);
    } else {
      router.push(`/categoria/${nuevaCategoriaSlug}`);
    }
  };

  // Cambiar marca
  const cambiarMarca = (nombreMarca) => {
    if (nombreMarca === "Todas") {
      if (categoriaSlug) {
        router.push(`/categoria/${categoriaSlug}`);
      } else {
        router.push("/tienda");
      }
      return;
    }
    const nuevaMarcaSlug = slugify(nombreMarca);
    router.push(`/categoria/${categoriaSlug}/${nuevaMarcaSlug}`);
  };

  // SEO dinámico
  const baseUrl = "https://prasen.pe";

  const generarCanonical = () => {
    if (!categoriaSlug) {
      return `${baseUrl}/tienda`;
    }
    let url = `${baseUrl}/categoria/${categoriaSlug}`;
    if (marcaSlug) {
      url += `/${marcaSlug}`;
    }
    return url;
  };

  const generarTitulo = () => {
    if (categoriaSeleccionadaObj && marcaSeleccionadaObj) {
      return `Compra ${categoriaSeleccionadaObj.nombre} marca ${marcaSeleccionadaObj.nombre} | Prasen`;
    }

    if (categoriaSeleccionadaObj) {
      return `Compra ${categoriaSeleccionadaObj.nombre} online | Prasen`;
    }

    return `Compra productos online | Prasen`;
  };

  const generarDescripcion = () => {
    if (categoriaSeleccionadaObj && marcaSeleccionadaObj) {
      return `Descubre la mejor selección de ${categoriaSeleccionadaObj.nombre} de la marca ${marcaSeleccionadaObj.nombre}. Compra online con entrega a nivel nacional en Prasen.`;
    }

    if (categoriaSeleccionadaObj) {
      return `Explora nuestra colección de ${categoriaSeleccionadaObj.nombre}. Compra online con envío a nivel nacional en Prasen.`;
    }

    return `Explora nuestros productos. Compra online con envío a nivel nacional en Prasen.`;
  };

  const cargarMasProductos = async () => {
    if (!hayMas || cargandoScroll) return;
    setCargandoScroll(true);

    try {
      const desde = pagina * cantidadPorPagina;
      const nuevos = await obtenerProductosFiltrados(id_marca, id_categoria, "precio", "asc", desde, cantidadPorPagina);

      const productosConBlobs = await Promise.all(
        nuevos.map(async (producto) => {
          let url1 = "";
          try {
            if (producto.id_producto !== null) {
              const blob1 = await ObtenerImagenProducto(producto.urlImagen1);
              url1 = URL.createObjectURL(blob1);
            }
          } catch (e) {
            console.error("Error al cargar imágenes de producto", producto.nombre, producto.id_producto);
          }
          return { ...producto, urlImagen1: url1 };
        })
      );

      const nuevosValidos = productosConBlobs.filter(p => p?.id_producto && p?.nombre);
      setProductos(prev => [...prev, ...nuevosValidos]);
      
      if (nuevos.length < cantidadPorPagina) {
        setHayMas(false);
      }

      setPagina(prev => prev + 1);
      setCargando(false);
    } catch (error) {
      console.error("Error cargando más productos:", error);
    } finally {
      setCargandoScroll(false);
    }
  };

  useEffect(() => {
    let timeoutId;

    const handleScroll = () => {
      if (!hayMas || cargandoScroll) return;

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
          cargarMasProductos();
        }
      }, 150);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hayMas, cargandoScroll]);

  useEffect(() => {
    if (categorias.length === 0 || marcas.length === 0) return;
    setProductos([]);
    setPagina(0);
    setHayMas(true);
    cargarMasProductos();
  }, [categoriaSlug, marcaSlug, categorias, marcas]);

  return (
    <>
      <Head>
        <title>{generarTitulo()}</title>
        <meta name="description" content={generarDescripcion()} />
        <link rel="canonical" href={generarCanonical()} />
      </Head>

      <>
        <main className="bg-white py-10 px-4">
          <div className="max-w-[1520px] mx-auto">
            <h1 className="text-3xl font-bold text-blue-900 mb-4">
              {categoriaSeleccionadaObj?.slug_categoria}
              {marcaSeleccionadaObj?.slug_marca ? ` - ${marcaSeleccionadaObj.slug_marca}` : ""}
            </h1>
            <p className="text-gray-600 mb-8">
              Explora todos los productos disponibles. Filtra por categoría o marca para encontrar lo que necesitas.
            </p>

            {/* Botón Filtrar (móvil) */}
            <div className="flex justify-end mb-6 md:hidden">
              <button
                onClick={abrirFiltro}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
              >
                <Filter className="w-5 h-5" />
                Filtrar
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              <FiltrosDesktop
                categorias={categorias}
                marcas={marcas}
                cambiarCategoria={cambiarCategoria}
                cambiarMarca={cambiarMarca}
                accordionOpen={accordionOpen}
                setAccordionOpen={setAccordionOpen}
                categoriaSeleccionadaObj={categoriaSeleccionadaObj}
                marcaSeleccionadaObj={marcaSeleccionadaObj}
              />

              {/* Grilla productos */}
              {cargando ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 flex-1">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="border rounded-xl overflow-hidden shadow-sm p-4 bg-white flex flex-col">
                      <Skeleton className="w-full h-48 rounded mb-4" />
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-5/6 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <Skeleton className="h-10 w-full rounded" />
                    </div>
                  ))}
                </div>
              ) : productos.length === 0 ? (
                <p className="text-center text-gray-500">No se encontraron productos.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 animate-fade-in flex-1">
                  {productos.map((prod) => (
                    <article
                      key={prod.id_producto}
                      className="border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition bg-white flex flex-col"
                      itemScope
                      itemType="https://schema.org/Product"
                    >
                      <img
                        src={prod.urlImagen1 || "/not-found.webp"}
                        alt={`Imagen de ${prod.nombre}`}
                        className="w-full h-48 object-contain bg-gray-100"
                        loading="lazy"
                        itemProp="image"
                      />
                      <div className="p-4 text-center flex flex-col flex-grow">
                        <h2 className="text-base sm:text-lg font-semibold text-blue-800 mb-1 line-clamp-2 min-h-[3rem]" itemProp="name">
                          {prod.nombre}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-4 min-h-[5rem]" itemProp="description">
                          {prod.descripcion}
                        </p>

                        { prod.descuento > 0 ? 
                        (
                        <div className="mt-auto pt-3">
                          <p className="text-gray-400 line-through text-sm">
                            S/. {prod.precio.toFixed(2)}
                          </p>
                          <p className="text-green-700 font-bold text-base">
                            S/. {(prod.precio - (prod.precio * prod.descuento / 100)).toFixed(2)}
                          </p>
                          <span className="inline-block mt-1 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded font-semibold">
                            -{prod.descuento}% OFF
                          </span>
                        </div>
                        )
                        :(
                        <p className="text-gray-700 font-bold mt-auto">
                          <span itemProp="priceCurrency" content="PEN">S/.</span>{" "}
                          <span itemProp="price" content={prod.precio}>{prod.precio}</span>
                        </p>
                        )}
                        <div className="mt-4 flex justify-center rounded-md overflow-hidden border border-gray-200 divide-x">
                          <button
                            type="button"
                            aria-label={`Agregar ${prod.nombre} a tu lista de deseos`}
                            title="Agregar a la lista de deseos"
                            className="flex items-center justify-center gap-1 px-2 py-1 text-xs sm:text-sm text-pink-600 hover:bg-pink-50 transition w-full"
                          >
                            <Heart className="w-4 h-4" />
                            <span className="hidden sm:inline">Añadir</span>
                          </button>

                          <BotonWsp
                            tipo="tienda"
                            codigo={prod.codigo}
                            nombre={prod.nombre}
                            nombreSlug={prod.nombreSlug}
                          />

                          <a
                            href={`/producto/${prod.nombreSlug}`}
                            title={`Ver detalles de ${prod.nombre}`}
                            aria-label={`Ver detalles de ${prod.nombre}`}
                            className="flex items-center justify-center gap-1 px-2 py-1 text-xs sm:text-sm text-blue-600 hover:bg-blue-50 transition w-full"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">Ver</span>
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </>

      {/* Sidebar Filtros en Móvil */}
      {mostrarFiltro && (
        <div className="fixed inset-0 z-50 flex">
          <div
            onClick={cerrarFiltro}
            className={`fixed inset-0 backdrop-blur-sm bg-black/20 transition-opacity duration-300 ease-in-out ${filtroAbierto ? "opacity-100" : "opacity-0"}`}
          ></div>

          <div
            className={`relative bg-white w-3/4 max-w-xs h-full p-6 overflow-y-auto shadow-lg transform transition-transform duration-300 ease-in-out ${filtroAbierto ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-700">Filtrar por</h2>
              <button
                onClick={cerrarFiltro}
                className="text-gray-700 hover:text-red-500"
                aria-label="Cerrar filtros"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Accordion Filtros con Animaciones */}
            <Accordion.Root type="multiple" value={accordionOpen} onValueChange={(val) => setAccordionOpen(val)} className="space-y-4">
              {/* Categorías */}
              <Accordion.Item value="categorias">
                <Accordion.Header>
                  <Accordion.Trigger className="w-full text-left flex items-center gap-2 font-semibold text-gray-700 py-2">
                    <Layers className="w-5 h-5" />
                    Categorías
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden text-sm transition-all duration-300 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                  <ul className="space-y-2 mt-2">
                    {categorias.map((cat) => (
                      <li key={cat.id_categoria}>
                        <button
                          onClick={() => cambiarCategoria(cat.nombre)}
                          className={`w-full text-left px-4 py-2 transition text-gray-700 hover:bg-indigo-100 rounded ${
                            categoriaSeleccionadaObj?.id_categoria === cat.id_categoria ? 'bg-indigo-100 font-bold text-indigo-700' : ''
                          }`}
                        >
                          {cat.nombre}
                        </button>
                      </li>
                    ))}
                  </ul>
                </Accordion.Content>
              </Accordion.Item>

              {/* Marcas */}
              <Accordion.Item value="marcas">
                <Accordion.Header>
                  <Accordion.Trigger className="w-full text-left flex items-center gap-2 font-semibold text-gray-700 py-2">
                    <Tag className="w-5 h-5" />
                    Marcas
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden text-sm transition-all duration-300 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                  <ul className="space-y-2 mt-2">
                    {marcas.map((marca) => (
                      <li key={marca.id_marcas}>
                        <button
                          onClick={() => cambiarMarca(marca.nombre)}
                          className={`w-full text-left px-4 py-2 transition text-gray-700 hover:bg-indigo-100 rounded ${
                            marcaSeleccionadaObj?.id_marcas === marca.id_marcas ? 'bg-indigo-100 font-bold text-indigo-700' : ''
                          }`}
                        >
                          {marca.nombre}
                        </button>
                      </li>
                    ))}
                  </ul>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </div>
        </div>
      )}
    </>
  );
}
