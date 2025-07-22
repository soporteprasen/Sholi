import Link from "next/link";
import { obtenerCategorias } from "@/lib/api";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";

export default async function Productos() {
  let categorias = [];

  try {
    const data = await obtenerCategorias();
    categorias = data.filter(c => c.valorConsulta === "1");
  } catch (error) {
    console.error("Error al cargar categorías:", error);
  }

  return (
    <Accordion
      type="single"
      collapsible 
      defaultValue=""
      className="w-full border-b"
      itemScope
      itemType="https://schema.org/SiteNavigationElement"
    >
      <AccordionItem value="productos">
        <AccordionTrigger className="px-4 py-3 bg-gray-50 hover:bg-gray-100 font-semibold text-sm">
          PRODUCTOS
        </AccordionTrigger>
        <AccordionContent className="bg-white px-4 py-2 space-y-2">
          {categorias.map((cat, idx) => (
            <Link
              key={idx}
              href={`/categoria/${cat.slug_categoria}`}
              className="block w-full text-left rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 transition-shadow shadow-sm hover:shadow cerrar-menu"
              aria-label={`Ver productos de ${cat.nombre}`}
              title={`Ver productos de ${cat.nombre}`}
              itemProp="name"
            >
              {cat.nombre}
            </Link>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
