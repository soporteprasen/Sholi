"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Layers, Tag } from "lucide-react";

// Función para generar slugs amigables
function slugify(texto) {
  return texto
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres no válidos
    .replace(/\s+/g, '-') // Espacios por guiones
    .replace(/-+/g, '-'); // Múltiples guiones por uno
}

export default function FiltrosDesktop({
  categorias,
  marcas,
  categoriaSeleccionadaObj,
  marcaSeleccionadaObj,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [accordionOpen, setAccordionOpen] = useState([]);

  const paths = pathname.split("/").filter(Boolean); // Quita strings vacíos
  const categoriaSlug = paths[0] === "categoria" ? paths[1] : "";
  const marcaSlug = paths[0] === "categoria" ? paths[2] : (paths[0] === "tienda" ? paths[1] : "");

  // Lógica de apertura automática del accordion
  useEffect(() => {
    const valores = [];
    if (categoriaSeleccionadaObj) valores.push("categorias");
    if (marcaSeleccionadaObj) valores.push("marcas");
    setAccordionOpen(valores);
  }, [categoriaSeleccionadaObj, marcaSeleccionadaObj]);

  // Redireccionamiento
  const cambiarCategoria = (nombre) => {
    const esTodas = nombre === "Todas";
    const nuevaCategoriaSlug = !esTodas ? slugify(nombre) : "";

    if (esTodas) {
      // Si hay una marca seleccionada, ir a /tienda/marca
      if (marcaSlug) {
        router.push(`/tienda/${marcaSlug}`);
      } else {
        router.push("/tienda");
      }
    } else {
      if (marcaSlug) {
        router.push(`/categoria/${nuevaCategoriaSlug}/${marcaSlug}`);
      } else {
        router.push(`/categoria/${nuevaCategoriaSlug}`);
      }
    }
  };

  const cambiarMarca = (nombreMarca) => {
    const esTodas = nombreMarca === "Todas";
    const nuevaMarcaSlug = !esTodas ? slugify(nombreMarca) : "";

    if (categoriaSlug) {
      router.push(esTodas ? `/categoria/${categoriaSlug}` : `/categoria/${categoriaSlug}/${nuevaMarcaSlug}`);
    } else {
      router.push(esTodas ? "/tienda" : `/tienda/${nuevaMarcaSlug}`);
    }
  };

  return (
    <aside className="hidden md:block w-64 border-r pr-4">
      <Accordion
        type="multiple"
        value={accordionOpen}
        onValueChange={setAccordionOpen}
        className="w-full space-y-4"
      >
        {/* Categorías */}
        <AccordionItem value="categorias">
          <AccordionTrigger className="flex items-center gap-2 text-[#3C1D2A] font-semibold">
            <Layers className="w-5 h-5 text-[#7c141b]" />
            Categorías
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-2 mt-2">
              <li>
                <button
                  onClick={() => cambiarCategoria("Todas")}
                  className="w-full text-left px-4 py-2 rounded hover:bg-[#7c141b]/10 transition text-[#3C1D2A]"
                >
                  Todas
                </button>
              </li>
              {categorias.map((cat) => (
                <li key={cat.id_categoria}>
                  <button
                    onClick={() => cambiarCategoria(cat.slug_categoria)}
                    className={`w-full text-left px-4 py-2 rounded transition ${
                      categoriaSeleccionadaObj?.id_categoria === cat.id_categoria
                        ? "bg-[#7c141b]/10 font-bold text-[#7c141b]"
                        : "hover:bg-[#7c141b]/10 text-[#3C1D2A]"
                    }`}
                  >
                    {cat.nombre}
                  </button>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* Marcas */}
        <AccordionItem value="marcas">
          <AccordionTrigger className="flex items-center gap-2 text-[#3C1D2A] font-semibold">
            <Tag className="w-5 h-5 text-[#3C1D2A]" />
            Marcas
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-2 mt-2">
              <li>
                <button
                  onClick={() => cambiarMarca("Todas")}
                  className="w-full text-left px-4 py-2 rounded hover:bg-[#3C1D2A]/10 transition text-[#3C1D2A]"
                >
                  Todas
                </button>
              </li>
              {marcas.map((marca) => (
                <li key={marca.id_marcas}>
                  <button
                    onClick={() => cambiarMarca(marca.slug_marca)}
                    className={`w-full text-left px-4 py-2 rounded transition ${
                      marcaSeleccionadaObj?.id_marcas === marca.id_marcas
                        ? "bg-[#3C1D2A]/10 font-bold text-[#3C1D2A]"
                        : "hover:bg-[#3C1D2A]/10 text-[#3C1D2A]"
                    }`}
                  >
                    {marca.nombre}
                  </button>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
}
