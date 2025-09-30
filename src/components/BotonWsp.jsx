// components/BotonWsp.client.jsx
"use client";
import { MessageCircleMore } from "lucide-react";

export default function BotonWsp({
  tipo = "inicio",
  codigo = "",
  nombre = "",
  nombreSlug = "",
  numero = "999999999",
  mensajeBase = "¡Hola! Estoy interesado en un producto.",
  baseUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/`,
}) {
  const urlCompleta = `${baseUrl}/producto/${nombreSlug}`;

  const mensajeFinal = `${mensajeBase}\n\n*Código:* ${codigo}\n*Producto:* ${nombre}\n*Link:* ${urlCompleta}`;

  const urlWhatsApp = `https://api.whatsapp.com/send/?phone=51${numero}&text=${encodeURIComponent(
    mensajeFinal
  )}`;

  const clases =
    tipo === "producto"
      ? "w-full inline-flex items-center justify-center px-6 py-4 bg-green-700 hover:bg-green-600 text-white font-bold rounded shadow-md text-lg transition-colors"
      : "flex items-center justify-center gap-1 px-2 py-1 text-xs sm:text-sm text-green-700 hover:bg-green-100 transition w-full h-full";

  return (
    <a
      href={urlWhatsApp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Consultar ${nombre} por WhatsApp`}
      role="link"
      title={`Consulta disponibilidad de ${nombre} por WhatsApp`}
      className={clases}
    >
      {tipo === "producto" ? (
        <>
          <img
            src="/wsp-1.svg"
            alt="Logo de WhatsApp"
            width="24"
            height="24"
            className="mr-2"
          />
          Consultar por WhatsApp
        </>
      ) : (
        <>
          <MessageCircleMore className="w-4 h-4" />
          <span className="hidden sm:inline">WhatsApp</span>
        </>
      )}
    </a>
  );
}
