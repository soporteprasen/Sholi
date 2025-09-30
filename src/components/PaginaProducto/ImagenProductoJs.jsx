"use client";
import { useEffect } from "react";

export default function ImagenProductoJS() {
  useEffect(() => {
    const root = document.getElementById("producto-carrusel");
    const imgPrincipal = document.getElementById("imagen-principal");
    const zoomViewer = document.getElementById("zoom-lateral");
    if (!root || !imgPrincipal) return;

    const getVariant = (url, size) =>
      typeof url === "string" ? url.replace("/original/", `/${size}/`) : url;

    // --- miniaturas ---
    const onThumbClick = (e) => {
      const thumb = e.target.closest("[data-miniatura-src]");
      if (!thumb) return;

      const newSrc = thumb.getAttribute("data-miniatura-src");
      if (!newSrc) return;

      imgPrincipal.setAttribute(
        "srcset",
        `${getVariant(newSrc, "lg")} 366w, ${getVariant(newSrc, "original")} 550w`
      );
      imgPrincipal.setAttribute("sizes", "(max-width: 768px) 366px, 550px");

      if (zoomViewer && window.innerWidth >= 768) {
        zoomViewer.style.backgroundImage = `url(${getVariant(newSrc, "original")})`;
      }
    };

    root.addEventListener("click", onThumbClick);

    // --- zoom (solo desktop) ---
    if (window.innerWidth >= 768 && zoomViewer) {
      const onEnter = () =>
        zoomViewer.classList.remove("invisible", "pointer-events-none");
      const onLeave = () =>
        zoomViewer.classList.add("invisible", "pointer-events-none");
      const onMove = (e) => {
        const rect = imgPrincipal.getBoundingClientRect();
        const xPct = ((e.clientX - rect.left) / rect.width) * 100;
        const yPct = ((e.clientY - rect.top) / rect.height) * 100;
        zoomViewer.style.backgroundPosition = `${xPct}% ${yPct}%`;
      };
      const ajustarTamañoZoom = () => {
        const rect = imgPrincipal.getBoundingClientRect();
        zoomViewer.style.width = `${rect.width}px`;
        zoomViewer.style.height = `${rect.height}px`;
      };

      ajustarTamañoZoom();
      window.addEventListener("resize", ajustarTamañoZoom);

      imgPrincipal.addEventListener("mouseenter", onEnter);
      imgPrincipal.addEventListener("mousemove", onMove);
      imgPrincipal.addEventListener("mouseleave", onLeave);

      // ✅ inicializar zoom desde el primer render
      zoomViewer.style.backgroundImage = `url(${imgPrincipal.currentSrc || imgPrincipal.src})`;

      const updateZoom = () => {
        zoomViewer.style.backgroundImage = `url(${getVariant(
          imgPrincipal.src,
          "original"
        )})`;
      };
      imgPrincipal.addEventListener("load", updateZoom);

      return () => {
        window.removeEventListener("resize", ajustarTamañoZoom);
        imgPrincipal.removeEventListener("mouseenter", onEnter);
        imgPrincipal.removeEventListener("mousemove", onMove);
        imgPrincipal.removeEventListener("mouseleave", onLeave);
        imgPrincipal.removeEventListener("load", updateZoom);
      };
    }

    return () => {
      root.removeEventListener("click", onThumbClick);
    };
  }, []);

  return null;
}
