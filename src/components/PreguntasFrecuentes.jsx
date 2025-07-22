import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function PreguntasFrecuentes() {
  return (
    <section
      id="faq"
      aria-label="Preguntas frecuentes sobre materiales eléctricos"
      className="max-w-3xl mx-auto px-4 py-10"
    >
      <h2
        className="text-2xl md:text-3xl font-bold text-center mb-8 text-[#0F2F55]"
        id="titulo-faq"
      >
        Preguntas Frecuentes
      </h2>

      <Accordion
        type="single"
        collapsible
        className="space-y-4"
        aria-labelledby="titulo-faq"
      >
        <BloquePregunta
          valor="item-1"
          pregunta="¿Por qué elegir nuestra tienda de materiales eléctricos para tus proyectos?"
          respuesta="Ofrecemos productos de alta calidad, precios competitivos y un servicio personalizado. Contamos con un amplio catálogo para proyectos residenciales, comerciales e industriales, garantizando desempeño y seguridad en cada instalación."
        />

        <BloquePregunta
          valor="item-2"
          pregunta="¿Qué ventajas ofrecemos como distribuidor de materiales eléctricos?"
          respuesta="Aseguramos stock constante, precios especiales para compras al por mayor y asesoría experta. Trabajamos con marcas reconocidas, ofreciendo productos duraderos con entregas rápidas en Lima y alrededores."
        />

        <BloquePregunta
          valor="item-3"
          pregunta="¿Qué marcas de materiales eléctricos manejamos?"
          respuesta="Distribuimos marcas reconocidas como Mennekes, Leviton, Solera y Hager. Nos enfocamos en ofrecer soluciones confiables para cada tipo de instalación eléctrica."
        />

        <BloquePregunta
          valor="item-4"
          pregunta="¿Qué tipos de clientes atendemos: particulares, empresas o contratistas?"
          respuesta="Atendemos desde particulares hasta grandes contratistas. Adaptamos nuestras soluciones según el tipo y escala del proyecto."
        />

        <BloquePregunta
          valor="item-5"
          pregunta="¿Puedo recoger mi pedido en tienda o solo hacemos envíos?"
          respuesta="Puedes recoger tu pedido en tienda o recibirlo en la dirección que prefieras. Realizamos entregas rápidas y seguras en Lima y provincias."
        />
      </Accordion>
    </section>
  );
}

function BloquePregunta({ valor, pregunta, respuesta }) {
  return (
    <AccordionItem
      value={valor}
      className="bg-gray-100 rounded-lg px-4 py-2 border border-gray-200"
    >
      <AccordionTrigger className="text-left font-medium text-[#0F2F55] hover:no-underline transition-all [&[data-state=open]>svg]:rotate-180">
        {pregunta}
      </AccordionTrigger>
      <AccordionContent className="text-gray-700 leading-relaxed">
        {respuesta}
      </AccordionContent>
    </AccordionItem>
  );
}
