"use client";
import { useEffect } from "react";

export default function CarruselBannerJS({ intervalo = 5000 }) {
  useEffect(() => {
    const root = document.getElementById("banner-carousel");
    if (!root) return;

    const slides = root.querySelectorAll("[data-carousel-item]");
    const prevBtn = root.querySelector("[data-carousel-prev]");
    const nextBtn = root.querySelector("[data-carousel-next]");
    const dots = root.querySelectorAll("[data-carousel-slide-to]");

    let index = 0;
    let timer;

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

    nextBtn?.addEventListener("click", next);
    prevBtn?.addEventListener("click", prev);
    dots.forEach((d) =>
      d.addEventListener("click", () => show(parseInt(d.dataset.carouselSlideTo)))
    );

    timer = setInterval(next, intervalo);
    root.addEventListener("mouseenter", () => clearInterval(timer));
    root.addEventListener("mouseleave", () => (timer = setInterval(next, intervalo)));

    return () => clearInterval(timer);
  }, [intervalo]);

  return null;
}
