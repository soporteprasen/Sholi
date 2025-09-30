"use client";
import { useEffect } from "react";

export default function AnimationBlock() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target;
          if (entry.isIntersecting) {
            el.classList.add("animate-fadeInUp");
            el.classList.remove("opacity-0"); // por si lo pusiste en el JSX
          } else {
            // se resetea para que vuelva a animar al re-entrar
            el.classList.remove("animate-fadeInUp");
            el.classList.add("opacity-0");
          }
        }
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll(".scroll-animate").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
