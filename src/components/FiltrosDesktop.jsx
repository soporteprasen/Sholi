"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Layers, Tag } from "lucide-react"; // Iconos de categorías y marcas

export default function FiltrosDesktop({ categorias, marcas, cambiarCategoria, cambiarMarca, accordionOpen, setAccordionOpen, categoriaSeleccionadaObj, marcaSeleccionadaObj}) {
  return (
    <aside className="hidden md:block w-64 border-r pr-4">
      <Accordion type="multiple"
        value={accordionOpen}
        onValueChange={setAccordionOpen}
        className="w-full space-y-4">
        
        {/* Categorías */}
        <AccordionItem value="categorias">
          <AccordionTrigger className="flex items-center gap-2 text-gray-700 font-semibold">
            <Layers className="w-5 h-5 text-blue-600" />
            Categorías
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-2 mt-2">
              <li>
                <button
                  onClick={() => cambiarCategoria("Todas")}
                  className="w-full text-left px-4 py-2 rounded hover:bg-indigo-100 transition text-gray-700"
                >
                  Todas
                </button>
              </li>
              {categorias.map((cat) => (
                <li key={cat.id_categoria} >
                  <button
                    onClick={() => cambiarCategoria(cat.nombre)}
                    className={`w-full text-left px-4 py-2 rounded transition ${
                      categoriaSeleccionadaObj?.id_categoria === cat.id_categoria
                        ? "bg-indigo-100 font-bold text-indigo-700"
                        : "hover:bg-indigo-100 text-gray-700"
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
          <AccordionTrigger className="flex items-center gap-2 text-gray-700 font-semibold">
            <Tag className="w-5 h-5 text-green-600" />
            Marcas
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-2 mt-2">
              <li>
                <button
                  onClick={() => cambiarMarca("Todas")}
                  className="w-full text-left px-4 py-2 rounded hover:bg-indigo-100 transition text-gray-700"
                >
                  Todas
                </button>
              </li>
              {marcas.map((marca) => (
                <li key={marca.id_marcas}>
                  <button
                    onClick={() => cambiarMarca(marca.nombre)}
                    className={`w-full text-left px-4 py-2 rounded transition ${
                      marcaSeleccionadaObj?.id_marcas === marca.id_marcas
                        ? "bg-green-100 font-bold text-green-700"
                        : "hover:bg-green-100 text-gray-700"
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
