import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  MessageSquare,
} from "lucide-react";
import PreguntasFrecuentes from "@/components/PreguntasFrecuentes";
import Script from "next/script";

export const metadata = {
  title: "Contáctanos en Lima | Soporte Técnico y Ventas | Prasen Perú",
  description:
    "¿Necesitas soporte técnico, información sobre productos o cotizaciones? Contáctanos en Prasen. Estamos ubicados en Lima, Perú. ¡Atención personalizada a nivel nacional!",
  robots: "index, follow",
  alternates: {
    canonical: "https://tusitio.com/contacto",
  },
};

export default function Contacto() {
  return (
    <>
      {/* Datos estructurados SEO con JSON-LD */}
      <Script id="contacto-structured-data" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Prasen",
          image: "https://tusitio.com/logo.png",
          "@id": "https://tusitio.com",
          url: "https://tusitio.com/contacto",
          telephone: "+51 987654321",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Av. Los Próceres 123",
            addressLocality: "Lima",
            addressCountry: "PE",
          },
          openingHours: "Mo-Fr 09:00-18:00",
          sameAs: [
            "https://facebook.com",
            "https://instagram.com",
            "https://wa.me/51987654321",
          ],
        })}
      </Script>

      <div className="max-w-screen-xl mx-auto px-4 py-5">
        <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
          Contáctanos en Lima – Soporte, Ventas y Asistencia Técnica
        </h1>

        <p className="text-sm text-gray-600 text-center max-w-2xl mx-auto mb-6">
          En <strong>Prasen</strong> brindamos soluciones tecnológicas avanzadas para pequeñas y medianas empresas.
          Si tienes dudas sobre nuestros productos, deseas soporte técnico o necesitas una cotización,
          ponte en contacto con nosotros. <br />
          Nuestra oficina se encuentra en Lima, Perú, y ofrecemos atención personalizada a nivel nacional.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Información de contacto */}
          <section className="bg-white p-6 rounded-xl shadow-md border">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Información de contacto</h2>

            <address className="space-y-4 not-italic text-gray-700 text-sm">
              <p className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-500" />
                <span><strong>Dirección:</strong> Av. Los Próceres 123, Lima, Perú</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-indigo-500" />
                <span><strong>Teléfono:</strong> +51 987 654 321</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-indigo-500" />
                <span><strong>Correo:</strong> contacto@miempresa.com</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" />
                <span><strong>Horario:</strong> Lunes a Viernes de 9:00 a.m. a 6:00 p.m.</span>
              </p>

              <div className="pt-2">
                <p className="font-semibold text-gray-800">Síguenos en redes sociales:</p>
                <div className="flex gap-4 pt-2">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-indigo-600 hover:underline"
                  >
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-indigo-600 hover:underline"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </a>
                  <a
                    href="https://wa.me/51987654321"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-indigo-600 hover:underline"
                  >
                    <MessageSquare className="w-4 h-4" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </address>
          </section>

          {/* Mapa de Google */}
          <article className="rounded-xl overflow-hidden shadow-md border">
            <iframe
              title="Ubicación en Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d244.0391003811622!2d-77.04959144447903!3d-11.861459069859247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2spe!4v1751927449526!5m2!1ses-419!2spe"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            ></iframe>
          </article>
        </div>

        <PreguntasFrecuentes />
      </div>
    </>
  );
}
