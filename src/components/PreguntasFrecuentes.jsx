"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function PreguntasFrecuentes() {
  return (
    <section className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-[#0F2F55]">
        Preguntas Frecuentes
      </h2>

      <Accordion type="single" collapsible className="space-y-4">
        <BloquePregunta
          valor="item-1"
          pregunta="¿Por qué elegir nuestra tienda de materiales eléctricos para tus proyectos?"
          respuesta="En nuestra tienda de materiales eléctricos, ofrecemos productos de alta calidad, precios competitivos y un servicio personalizado. Contamos con un amplio catálogo de soluciones para proyectos residenciales, comerciales e industriales, garantizando siempre el mejor desempeño y seguridad en cada instalación."
        />

        <BloquePregunta
          valor="item-2"
          pregunta="¿Qué ventajas ofrecemos como distribuidor de materiales eléctricos?"
          respuesta="Como distribuidor de materiales eléctricos, aseguramos stock constante, precios especiales para compras al por mayor y asesoramiento experto. Trabajamos con marcas reconocidas para ofrecerte productos confiables y duraderos, con entregas rápidas y eficientes en Lima y alrededores."
        />

        <BloquePregunta
          valor="item-3"
          pregunta="¿Qué marcas de materiales eléctricos manejamos?"
          respuesta="Como distribuidor de materiales eléctricos, aseguramos stock constante, precios especiales para compras al por mayor y asesoramiento experto. Trabajamos con marcas reconocidas (Mennekes, Leviton, Solera, Hager) para ofrecerte productos confiables y duraderos, con entregas rápidas y eficientes en Lima y alrededores."
        />

        <BloquePregunta
          valor="item-4"
          pregunta="¿Qué tipos de clientes atendemos: particulares, empresas o contratistas?"
          respuesta="Atendemos a todo tipo de clientes: desde particulares que buscan soluciones para el hogar, hasta empresas y contratistas que requieren insumos eléctricos al por mayor. Adaptamos nuestras ofertas y asesoría según las necesidades de cada proyecto."
        />

        <BloquePregunta
          valor="item-5"
          pregunta="¿Puedo recoger mi pedido en tienda o solo hacemos envíos?"
          respuesta="Ofrecemos ambas opciones para tu comodidad. Puedes recoger tu pedido directamente en nuestra tienda o solicitar envío a la dirección que prefieras. Garantizamos entregas rápidas y seguras en Lima y provincias, para que recibas tus materiales sin complicaciones."
        />
      </Accordion>
    </section>
  );
}

function BloquePregunta({ valor, pregunta, respuesta }) {
  return (
    <AccordionItem value={valor} className="bg-gray-100 rounded-lg px-4 py-2">
      <AccordionTrigger className="text-left font-medium text-[#0F2F55] hover:no-underline [&[data-state=open]>svg]:rotate-180 transition-all">
        {pregunta}
      </AccordionTrigger>
      <AccordionContent className="text-gray-700">
        {respuesta}
      </AccordionContent>
    </AccordionItem>
  );
}