"use client";
import { useEffect } from "react";

export default function SliderJS({ modo = "certificado", intervalo = 4000 }) {
  useEffect(() => {
    if (modo !== "marcas") return;

    const sliders = document.querySelectorAll('[data-slider="marcas"]');
    sliders.forEach((slider) => {
      const scrollContainer = slider.querySelector(".slider-scroll");
      const contenido = slider.querySelector(".slider-contenido");
      const items = contenido?.children;
      if (!scrollContainer || !contenido || !items?.length) return;

      const itemWidth = 220;
      const totalItems = items.length;
      const startPosition = (totalItems / 3) * itemWidth;
      scrollContainer.scrollLeft = startPosition;

      const autoplay = setInterval(() => {
        scrollContainer.scrollBy({ left: itemWidth, behavior: "smooth" });
        const maxScroll = scrollContainer.scrollWidth - scrollContainer.offsetWidth - itemWidth;

        if (scrollContainer.scrollLeft >= maxScroll) {
          scrollContainer.scrollTo({ left: startPosition, behavior: "auto" });
        }
      }, intervalo);

      let isDragging = false;
      let startX = 0;
      let scrollStart = 0;

      scrollContainer.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.pageX - scrollContainer.offsetLeft;
        scrollStart = scrollContainer.scrollLeft;
      });

      scrollContainer.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollContainer.offsetLeft;
        const walk = x - startX;
        scrollContainer.scrollLeft = scrollStart - walk;
      });

      document.addEventListener("mouseup", () => {
        isDragging = false;
      });

      window.addEventListener("blur", () => clearInterval(autoplay));
    });
  }, [modo, intervalo]);

  return null;
}
