// components/WspFlot.server.jsx
import { obtenerMensajesWsp } from "@/lib/api";

export default async function WspFlot() {
  let data = null;

  try {
    // ⚡️ SSR con cache (controlado en lib/api con revalidate: 60)
    data = await obtenerMensajesWsp();
  } catch (e) {
    // opcional: silencia el error para que no rompa la UI
    console.error("Error al obtener mensaje WSP", e);
  }

  const mensaje = data?.mensajeGlobal || "¡Hola! ¿En qué puedo ayudarte?";
  const numero = data?.numero || "999999999";

  const href = `https://api.whatsapp.com/send/?phone=51${numero}&text=${encodeURIComponent(
    mensaje
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "56px",
        height: "56px",
        backgroundColor: "#25D366",
        color: "white",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        zIndex: 999,
        cursor: "pointer",
        fontSize: "30px",
        textDecoration: "none",
      }}
      title="Escríbenos por WhatsApp"
    >
      <img src="/wsp-1.svg" alt="WhatsApp" width="30" height="30" />
    </a>
  );
}
