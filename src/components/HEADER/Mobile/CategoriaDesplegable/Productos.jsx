'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { obtenerCategorias } from "@/lib/api";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";

export default function Productos() {
  const [categorias, setCategorias] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const data = await obtenerCategorias();
        const categoriasValidas = data.filter(c => c.valorConsulta === "1");
        setCategorias(categoriasValidas);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };

    cargarCategorias();
  }, []);

  return (
    <Accordion type="multiple" className="w-full border-b" itemScope itemType="https://schema.org/SiteNavigationElement">
      <AccordionItem value="productos">
        <AccordionTrigger className="px-4 py-3 bg-gray-50 hover:bg-gray-100 font-semibold text-sm">
          PRODUCTOS
        </AccordionTrigger>
        <AccordionContent className="bg-white px-4 py-2 space-y-2">
          {categorias.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => router.push(`/categoria/${cat.slug_categoria}`)}
              className="w-full text-left rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 transition-shadow shadow-sm hover:shadow"
              aria-label={`Ver productos de ${cat.nombre}`}
              title={`Ver productos de ${cat.nombre}`}
              itemProp="name"
            >
              {cat.nombre}
            </button>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
