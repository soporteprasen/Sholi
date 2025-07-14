// app/contacto/page.jsx
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

export const metadata = {
  title: "Contáctanos | Prasen",
  description:
    "Ponte en contacto con Prasen. Encuentra nuestra dirección en Lima, Perú, número de teléfono, correo electrónico y horario de atención. ¡Estamos listos para ayudarte!",
  robots: "index, follow",
  alternates: {
    canonical: "https://tusitio.com/contacto",
  },
};

export default function Contacto() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-5">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
        Contáctanos
      </h1>

      {/* Texto introductorio SEO-friendly */}
      <p className="text-sm text-gray-600 text-center max-w-2xl mx-auto mb-6">
        En <strong>Prasen</strong> ofrecemos soluciones tecnológicas de alta calidad.
        Si deseas realizar consultas, solicitar cotizaciones o conocer más sobre nuestros productos,
        puedes contactarnos directamente. Estamos ubicados en Lima, Perú, y atendemos a nivel nacional.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Información de contacto */}
        <div className="bg-white p-6 rounded-xl shadow-md border">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Información de contacto</h2>

          <div className="space-y-4 text-gray-700 text-sm">
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
          </div>
        </div>

        {/* Mapa de Google */}
        <div className="rounded-xl overflow-hidden shadow-md border">
          <img
            src="https://maps.googleapis.com/maps/api/staticmap?center=-11.861459069859247,-77.04959144447903&zoom=16&size=600x400&maptype=roadmap&markers=color:red%7Clabel:P%7C-11.861459069859247,-77.04959144447903&key=TU_API_KEY"
            alt="Ubicación Prasen en Lima"
            width="100%"
            height="400"
            loading="lazy"
            className="w-full h-auto rounded-xl"
          />
          <a
            href="https://www.google.com/maps/place/Av.+Los+Próceres+123,+Lima,+Perú"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-indigo-600 mt-2 underline"
          >
            Ver mapa interactivo
          </a>
        </div>
      </div>

      <PreguntasFrecuentes />
    </div>
  );
}
