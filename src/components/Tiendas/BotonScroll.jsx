"use client";

import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

export default function ScrollButtons() {
  const [mostrarArriba, setMostrarArriba] = useState(false);
  const [mostrarAbajo, setMostrarAbajo] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollBottom = window.innerHeight + scrollTop;
      const docHeight = document.documentElement.scrollHeight;

      setMostrarArriba(scrollTop > 200); // Mostrar "subir" si no estamos arriba
      setMostrarAbajo(scrollBottom < docHeight - 100); // Mostrar "bajar" si no estamos abajo
    };

    handleScroll(); // Ejecutar una vez al montar

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll); // por si cambia el tamaño de ventana
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  if (!mostrarArriba && !mostrarAbajo) return null;

  return (
    <div className="fixed bottom-20 right-7 flex flex-col gap-2 z-50">
      {mostrarArriba && (
        <button
          onClick={scrollToTop}
          className="p-3 bg-[#7c141b] hover:bg-[#3C1D2A] text-white rounded-full shadow-md transition-all"
          title="Ir arriba"
        >
          <ArrowUp size={20} />
        </button>
      )}
      {mostrarAbajo && (
        <button
          onClick={scrollToBottom}
          className="p-3 bg-[#7c141b] hover:bg-[#3C1D2A] text-white rounded-full shadow-md transition-all"
          title="Ir abajo"
        >
          <ArrowDown size={20} />
        </button>
      )}
    </div>
  );
}
