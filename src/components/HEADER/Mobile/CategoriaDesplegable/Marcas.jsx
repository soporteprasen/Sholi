import Link from "next/link";
import { obtenerMarcas } from "@/lib/api";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";

export default async function Marcas() {
  let marcas = [];

  try {
    const data = await obtenerMarcas();
    marcas = data.filter(m => m.valorConsulta === "1");
  } catch (error) {
    console.error("Error al cargar marcas:", error);
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
      <AccordionItem value="marcas">
        <AccordionTrigger className="px-4 py-3 bg-gray-50 hover:bg-gray-100 font-semibold text-sm">
          MARCAS
        </AccordionTrigger>
        <AccordionContent className="bg-white px-4 py-2 space-y-2">
          {marcas.map((marca, idx) => (
            <Link
              key={idx}
              href={`/tienda/${marca.slug_marca}`}
              className="block w-full text-left rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 transition-shadow shadow-sm hover:shadow cerrar-menu"
              aria-label={`Ver productos de ${marca.nombre}`}
              title={`Ver productos de ${marca.nombre}`}
              itemProp="name"
            >
              {marca.nombre}
            </Link>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
