"use client";

import { useEffect, useState } from "react";
import { obtenerMensajesWsp } from "@/lib/api";
import { MessageCircleMore } from "lucide-react";

export default function BotonWsp({ tipo = "inicio", codigo = "", nombre = "", slugCategoria = "", nombreSlug = "" }) {
  const [mensajeBase, setMensajeBase] = useState("");
  const [numero, setNumero] = useState("")

  useEffect(() => {
    const fetchMensaje = async () => {
      try {
        const data = await obtenerMensajesWsp();
        if (data && data.mensajeProducto) {
          setMensajeBase(data.mensajeProducto);
          setNumero(data.numero);
        } else {
          setMensajeBase("¡Hola! Estoy interesado en un producto.");
        }
      } catch (error) {
        console.error("Error al obtener mensaje de WhatsApp:", error);
        setMensajeBase("¡Hola! Estoy interesado en un producto.");
      }
    };

    fetchMensaje();
  }, []);

  // Base URL dinámico
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  // Armamos el link completo
  const urlCompleta = `${baseUrl}/producto/${nombreSlug}`;
  

  const mensajeFinal = mensajeBase
    ? `${mensajeBase}\n\n*Código:* ${codigo}\n*Producto:* ${nombre}\n*Link:* ${urlCompleta}`
    : "";

  const urlWhatsApp = mensajeFinal
    ? `https://api.whatsapp.com/send/?phone=51${numero}&text=${encodeURIComponent(mensajeFinal)}`
    : "#";

  const clases = tipo === "producto"
  ? "inline-flex items-center justify-center px-6 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-md text-lg transition-colors"
  : "flex items-center justify-center gap-1 px-2 py-1 text-xs sm:text-sm text-green-600 hover:bg-green-50 transition w-auto";

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
        <img src="/wsp-1.svg" alt="Logo de WhatsApp" width="24" height="24" className="mr-2" />
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
