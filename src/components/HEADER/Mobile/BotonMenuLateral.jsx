"use client";
import { useEffect } from "react";
import { Menu } from "lucide-react";

export default function BotonMenuLateral() {
  const abrirMenu = () => {
    document.getElementById("menu-lateral")?.classList.remove("-translate-x-full");
  };

  useEffect(() => {
    const cerrarMenu = () => {
      document.getElementById("menu-lateral")?.classList.add("-translate-x-full");

      // Cerrar cualquier acordeón abierto
      const triggers = document.querySelectorAll("[data-state='open']");
      triggers.forEach(el => el.setAttribute("data-state", "closed"));
    };

    // Cerrar desde botón con id
    const btnCerrar = document.getElementById("boton-cerrar-menu");
    btnCerrar?.addEventListener("click", cerrarMenu);

    // Cerrar desde cualquier clic en enlace con clase .cerrar-menu (delegación)
    const handleDelegado = (e) => {
      const target = e.target.closest(".cerrar-menu");
      if (target) cerrarMenu();
    };

    document.addEventListener("click", handleDelegado);

    return () => {
      btnCerrar?.removeEventListener("click", cerrarMenu);
      document.removeEventListener("click", handleDelegado);
    };
  }, []);


  return (
    <button
      onClick={abrirMenu}
      className="flex items-center gap-2 text-sm font-semibold text-white"
      aria-label="Abrir menú"
    >
      <Menu className="w-6 h-6" />
      <span>MENÚ</span>
    </button>
  );
}
