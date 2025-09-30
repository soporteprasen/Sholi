"use client";
import { useEffect, useState } from "react";

export default function PageLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // desmontar después de la animación
    const timer = setTimeout(() => setVisible(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
        className="fixed inset-0 z-[9999] bg-[#5A2C40] animate-pageLoadDown pointer-events-none"
        aria-hidden="true"
    />
  );
}
