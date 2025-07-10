"use client";
import { useEffect, useState } from "react";
import { obtenerMensajesWsp } from "@/lib/api";

export default function Wasapp() {
  const [mensaje,setMensaje] = useState("");
  useEffect(() => {
    const fetchMensaje = async () => {
      try {
        const data = await obtenerMensajesWsp();
        if (data && data.mensajeGlobal) {
          setMensaje(data.mensajeGlobal);
        } else {
          setMensaje("¡Hola! ¿En qué puedo ayudarte?");
        }
      } catch (error) {
        console.error("Error al obtener mensaje de WhatsApp:", error);
      }
    };

    fetchMensaje();
  }, []);

  const urlWhatsApp = mensaje
    ? `https://api.whatsapp.com/send/?phone=51903021399&text=${encodeURIComponent(mensaje)}`
    : "#";
  return (
    <a
      href={urlWhatsApp}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '56px',
        height: '56px',
        backgroundColor: '#25D366',
        color: 'white',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        zIndex: 999,
        cursor: 'pointer',
        fontSize: '30px',
        textDecoration: 'none'
      }}
      title="Escríbenos por WhatsApp"
    >
      <img
        src="/wsp-1.svg"
        alt="WhatsApp"
        style={{ width: 30, height: 30 }}
      />
    </a>
  );
}
