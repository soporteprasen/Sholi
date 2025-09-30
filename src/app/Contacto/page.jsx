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
import WspFlot from "@/components/WspFlot";

export const metadata = {
  title: "Contáctanos en Lima | Soporte Técnico y Ventas | Sholi Perú",
  description:
    "¿Necesitas soporte técnico, información sobre productos o cotizaciones? Contáctanos en Sholi. Estamos en Lima, Perú, y brindamos atención personalizada a nivel nacional.",
  keywords: [
    "contacto Sholi",
    "soporte técnico iluminación LED",
    "ventas de productos eléctricos Perú",
    "Sholi Lima",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/contacto`,
  },
  openGraph: {
    title: "Contáctanos en Lima | Sholi Perú",
    description:
      "Soporte técnico, ventas y atención personalizada en productos eléctricos y de iluminación LED.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/contacto`,
    siteName: "Sholi Iluminación",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo/logo-principal-prasen.webp`,
        width: 1200,
        height: 630,
        alt: "Sholi contacto",
      },
    ],
    locale: "es_PE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@sholi_iluminacion",
    title: "Contáctanos en Lima | Sholi Perú",
    description:
      "Atención técnica y comercial en productos eléctricos con cobertura nacional.",
    images: [
      `${process.env.NEXT_PUBLIC_SITE_URL}/logo/logo-principal-prasen.webp`,
    ],
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
          "@id": `${process.env.NEXT_PUBLIC_SITE_URL}`,
          name: "Prasen",
          image: `${process.env.NEXT_PUBLIC_SITE_URL}/logo/logo-principal-prasen.webp`,
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/contacto`,
          telephone: "+51 929951971",
          email: "contacto@prasen.pe",
          priceRange: "$$",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Av. Los Próceres 123",
            addressLocality: "Lima",
            addressRegion: "Lima",
            postalCode: "15001",
            addressCountry: "PE"
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: -11.861459,
            longitude: -77.049591
          },
          hasMap: "https://www.google.com/maps/place/-11.861459,-77.049591",
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday"
              ],
              opens: "09:00",
              closes: "18:00"
            }
          ],
          contactPoint: [
            {
              "@type": "ContactPoint",
              telephone: "+51 987654321",
              contactType: "customer service",
              areaServed: "PE",
              availableLanguage: ["es"]
            },
            {
              "@type": "ContactPoint",
              telephone: "+51 929951971",
              contactType: "sales",
              areaServed: "PE",
              availableLanguage: ["es", "en"]
            }
          ],
          sameAs: [
            "https://facebook.com/praseniluminacion",
            "https://instagram.com/prasenled",
            "https://wa.me/51929951971"
          ]
        })}
      </Script>

      <div className="max-w-screen-xl mx-auto px-4 py-5">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#7c141b] to-[#3C1D2A] bg-clip-text text-transparent">
          Contáctanos en Lima – Soporte, Ventas y Asistencia Técnica
        </h1>

        <p className="text-sm text-gray-600 text-center max-w-2xl mx-auto mb-6">
          En <strong>Prasen</strong>, tu distribuidor de <strong>iluminación LED</strong> en Lima, Perú,
          brindamos soluciones tecnológicas avanzadas para pequeñas y medianas empresas.
          ¿Buscás <em>soporte técnico</em> o <em>productos eléctricos de calidad</em>? ¡Contáctanos!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Información de contacto */}
          <section className="bg-white p-6 rounded-xl shadow-md border">
            <h2 className="text-2xl font-semibold text-[#3C1D2A] mb-4">Información de contacto</h2>

            <address className="space-y-4 not-italic text-gray-700 text-sm">
              <p className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#7c141b]" />
                <span><strong>Dirección:</strong> Av. Los Próceres 123, Lima, Perú</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#7c141b]" />
                <span><strong>Teléfono:</strong> +51 929 951 971</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#7c141b]" />
                <span><strong>Correo:</strong> contacto@miempresa.com</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#7c141b]" />
                <span><strong>Horario:</strong> Lunes a Viernes de 9:00 a.m. a 6:00 p.m.</span>
              </p>

              <div className="pt-2">
                <p className="font-semibold text-[#3C1D2A]">Síguenos en redes sociales:</p>
                <div className="flex gap-4 pt-2">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#7c141b] hover:text-[#3C1D2A] hover:underline"
                  >
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#7c141b] hover:text-[#3C1D2A] hover:underline"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </a>
                  <a
                    href="https://wa.me/51929951971"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#7c141b] hover:text-[#3C1D2A] hover:underline"
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
      <WspFlot/>
    </>
  );
}
