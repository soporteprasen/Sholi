"use client";
import { useEffect } from "react";

export default function SliderJS({ modo = "certificado", intervalo = 4000 }) {
  useEffect(() => {
    const sliders = document.querySelectorAll(`[data-slider="${modo}"]`);
    sliders.forEach((slider) => {
      const scrollContainer = slider.querySelector(".slider-scroll");
      if (!scrollContainer) return;

      // 🔹 Autoplay + loop solo en MARCAS
      if (modo === "marcas") {
        const contenido = slider.querySelector(".slider-contenido");
        const items = contenido?.children;
        if (!contenido || !items?.length) return;

        const itemWidth = 220;
        const totalItems = items.length;
        const startPosition = (totalItems / 3) * itemWidth;
        scrollContainer.scrollLeft = startPosition;

        const autoplay = setInterval(() => {
          scrollContainer.scrollBy({ left: itemWidth, behavior: "smooth" });
          const maxScroll =
            scrollContainer.scrollWidth - scrollContainer.offsetWidth - itemWidth;

          if (scrollContainer.scrollLeft >= maxScroll) {
            scrollContainer.scrollTo({ left: startPosition, behavior: "auto" });
          }
        }, intervalo);

        window.addEventListener("blur", () => clearInterval(autoplay));
      }

      // 🔹 Drag (marcas y categorías)
      if (modo === "marcas" || modo === "categorias") {
        let isDragging = false;
        let startX = 0;
        let scrollStart = 0;
        let moved = 0;

        const onMouseDown = (e) => {
          isDragging = true;
          startX = e.pageX;
          scrollStart = scrollContainer.scrollLeft;
          moved = 0;
          scrollContainer.style.userSelect = "none";
        };

        const onMouseMove = (e) => {
          if (!isDragging) return;
          e.preventDefault();
          const walk = e.pageX - startX;
          moved = Math.max(moved, Math.abs(walk));
          scrollContainer.scrollLeft = scrollStart - walk;
        };

        const onMouseUp = () => {
          isDragging = false;
          scrollContainer.style.userSelect = "";
        };

        const onClickCapture = (e) => {
          if (moved > 5) {
            // Si hubo arrastre, cancelar click
            e.preventDefault();
            e.stopPropagation();
          }
        };

        scrollContainer.addEventListener("click", onClickCapture, true);
        scrollContainer.addEventListener("mousedown", onMouseDown);
        scrollContainer.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);

        // cleanup
        return () => {
          scrollContainer.removeEventListener("mousedown", onMouseDown);
          scrollContainer.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
        };
      }
    });
  }, [modo, intervalo]);

  return null;
}
