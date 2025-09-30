"use client";
import { useEffect } from "react";

export default function CarruselBannerJS({ id, intervalo = 5000 }) {
  useEffect(() => {
    const root = document.getElementById(id);
    if (!root) return;

    const slides = root.querySelectorAll("[data-carousel-item]");
    const prevBtn = root.querySelector("[data-carousel-prev]");
    const nextBtn = root.querySelector("[data-carousel-next]");
    const dots = root.querySelectorAll("[data-carousel-slide-to]");
    if (!slides.length) return;

    let index = 0;
    let timer = null;
    let startTimeout = null;
    let started = false;

    const show = (i) => {
      slides.forEach((el, idx) =>
        el.classList.toggle("opacity-100", idx === i)
      );
      dots.forEach((d, idx) =>
        d.setAttribute("aria-current", idx === i ? "true" : "false")
      );
      index = i;
    };

    const next = () => show((index + 1) % slides.length);
    const prev = () => show((index - 1 + slides.length) % slides.length);

    // Listeners inmediatos para navegación manual (no animan solos)
    nextBtn?.addEventListener("click", next);
    prevBtn?.addEventListener("click", prev);
    dots.forEach((d) =>
      d.addEventListener("click", () =>
        show(parseInt(d.dataset.carouselSlideTo))
      )
    );

    // Pausa/reanuda solo cuando el auto-play esté activo
    const onEnter = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };
    const onLeave = () => {
      if (started && !timer) {
        timer = setInterval(next, intervalo);
      }
    };

    const start = () => {
      if (started) return;
      started = true;
      timer = setInterval(next, intervalo);
      root.addEventListener("mouseenter", onEnter);
      root.addEventListener("mouseleave", onLeave);
    };

    // Arrancar 10s DESPUÉS de que la página haya cargado (evento load)
    const startAfterLoad = () => {
      startTimeout = setTimeout(start, 10000);
    };
    if (document.readyState === "complete") {
      startAfterLoad();
    } else {
      window.addEventListener("load", startAfterLoad, { once: true });
    }

    return () => {
      // Limpieza
      if (timer) clearInterval(timer);
      if (startTimeout) clearTimeout(startTimeout);
      nextBtn?.removeEventListener("click", next);
      prevBtn?.removeEventListener("click", prev);
      dots.forEach((d) =>
        d.removeEventListener("click", () =>
          show(parseInt(d.dataset.carouselSlideTo))
        )
      );
      root.removeEventListener("mouseenter", onEnter);
      root.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("load", startAfterLoad);
    };
  }, [id, intervalo]);

  return null;
}
