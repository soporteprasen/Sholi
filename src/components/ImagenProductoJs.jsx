"use client";
import { useEffect } from "react";

export default function ImagenProductoJS() {
  useEffect(() => {
    const root = document.getElementById("producto-carrusel");
    const imgPrincipal = document.getElementById("imagen-principal");
    const zoomViewer = document.getElementById("zoom-lateral");
    const thumbs = root?.querySelectorAll("[data-miniatura-src]") ?? [];

    if (!imgPrincipal) return;

    // --- miniaturas --- (DEBE FUNCIONAR SIEMPRE)
    const onThumbClick = (e) => {
      const newSrc = e.currentTarget.getAttribute("data-miniatura-src");
      imgPrincipal.src = newSrc;

      // Solo cambia zoom si está activo
      if (zoomViewer) {
        zoomViewer.style.backgroundImage = `url(${newSrc})`;
      }
    };
    thumbs.forEach(t => t.addEventListener("click", onThumbClick));

    // --- zoom (solo en desktop) ---
    const isDesktop = window.innerWidth >= 768;
    if (!isDesktop || !zoomViewer) return;

    const onEnter = () => {
      zoomViewer.classList.remove("invisible", "pointer-events-none");
    };
    const onLeave = () => {
      zoomViewer.classList.add("invisible", "pointer-events-none");
    };
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

    zoomViewer.style.backgroundImage = `url(${imgPrincipal.src})`;

    imgPrincipal.addEventListener("mouseenter", onEnter);
    imgPrincipal.addEventListener("mousemove", onMove);
    imgPrincipal.addEventListener("mouseleave", onLeave);

    return () => {
      thumbs.forEach(t => t.removeEventListener("click", onThumbClick));
      imgPrincipal.removeEventListener("mouseenter", onEnter);
      imgPrincipal.removeEventListener("mousemove", onMove);
      imgPrincipal.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", ajustarTamañoZoom);
    };
  }, []);

  return null;
}
