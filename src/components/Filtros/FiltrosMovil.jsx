"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Layers, Tag, X, Filter } from "lucide-react";

// Mismo slugify del desktop
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

export default function FiltrosMovil({ categorias, marcas }) {
  const [filtroAbierto, setFiltroAbierto] = useState(false);
  const [renderVisible, setRenderVisible] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const categoriaSlug = pathname.includes("/categoria/")
    ? pathname.split("/categoria/")[1]?.split("/")[0]
    : "";
  const marcaSlug = pathname.includes("/categoria/")
    ? pathname.split("/categoria/")[1]?.split("/")[1]
    : "";

  const abrirFiltro = () => {
    setRenderVisible(true);
    setTimeout(() => setFiltroAbierto(true), 10);
  };

  const cerrarFiltro = () => {
    setFiltroAbierto(false);
    setTimeout(() => setRenderVisible(false), 300);
  };

  const cambiarCategoria = (nombre) => {
    if (nombre === "Todas") {
      router.push("/tienda");
      cerrarFiltro();
      return;
    }

    const nuevaCategoriaSlug = slugify(nombre);
    if (marcaSlug) {
      router.push(`/categoria/${nuevaCategoriaSlug}/${marcaSlug}`);
    } else {
      router.push(`/categoria/${nuevaCategoriaSlug}`);
    }
    cerrarFiltro();
  };

  const cambiarMarca = (nombre) => {
    const esTodas = nombre === "Todas";
    const nuevaMarcaSlug = esTodas ? "" : slugify(nombre);

    if (categoriaSlug) {
      router.push(esTodas ? `/categoria/${categoriaSlug}` : `/categoria/${categoriaSlug}/${nuevaMarcaSlug}`);
    } else {
      router.push(esTodas ? "/tienda" : `/tienda/${nuevaMarcaSlug}`);
    }
    cerrarFiltro();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") cerrarFiltro();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div className="flex justify-end md:hidden">
        <button
          onClick={abrirFiltro}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition"
        >
          <Filter className="w-4 h-4" />
          Filtrar
        </button>
      </div>

      {renderVisible && (
        <div className="fixed inset-0 z-50 flex">
          {/* Fondo oscuro */}
          <div
            onClick={cerrarFiltro}
            className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${filtroAbierto ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
          />

          {/* Sidebar de filtros */}
          <div
            className={`relative bg-white w-3/4 max-w-xs h-full p-6 overflow-y-auto shadow-lg transform transition-transform duration-300 ease-in-out ${filtroAbierto ? "translate-x-0" : "-translate-x-full"
              }`}
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

            <Accordion type="multiple" className="space-y-4">
              <AccordionItem value="categorias">
                <AccordionTrigger className="w-full text-left flex items-center gap-2 font-semibold text-gray-700 py-2">
                  <Layers className="w-5 h-5 text-blue-600" />
                  Categorías
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 mt-2">
                    <li>
                      <button
                        onClick={() => cambiarCategoria("Todas")}
                        className="w-full text-left px-4 py-2 hover:bg-indigo-100 text-gray-700"
                      >
                        Todas
                      </button>
                    </li>
                    {categorias.map((cat) => (
                      <li key={cat.id_categoria}>
                        <button
                          onClick={() => cambiarCategoria(cat.slug_categoria)}
                          className="w-full text-left px-4 py-2 hover:bg-indigo-100 text-gray-700"
                        >
                          {cat.nombre}
                        </button>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="marcas">
                <AccordionTrigger className="w-full text-left flex items-center gap-2 font-semibold text-gray-700 py-2">
                  <Tag className="w-5 h-5 text-green-600" />
                  Marcas
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 mt-2">
                    <li>
                      <button
                        onClick={() => cambiarMarca("Todas")}
                        className="w-full text-left px-4 py-2 hover:bg-green-100 text-gray-700"
                      >
                        Todas
                      </button>
                    </li>
                    {marcas.map((marca) => (
                      <li key={marca.id_marcas}>
                        <button
                          onClick={() => cambiarMarca(marca.slug_marca)}
                          className="w-full text-left px-4 py-2 hover:bg-green-100 text-gray-700"
                        >
                          {marca.nombre}
                        </button>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      )}
    </>
  );
}
