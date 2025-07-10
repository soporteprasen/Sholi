"use client";
import { useRef, useState} from "react";

export default function ZoomImagen({ src, alt }) {
  const contenedorRef = useRef(null);
  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = contenedorRef.current.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y });
  };

  const isDesktop = typeof window !== "undefined" && window.innerWidth > 768;

  return (
    <div className="flex gap-6">
      {/* Imagen original con seguimiento del mouse */}
      <div
        ref={contenedorRef}
        className="relative w-[400px] h-[400px] border rounded overflow-hidden"
        onMouseEnter={() => isDesktop && setZoomVisible(true)}
        onMouseLeave={() => setZoomVisible(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain pointer-events-none"
        />
      </div>

      {/* Recuadro con zoom */}
      {zoomVisible && (
        <div
          className="w-[300px] h-[300px] border rounded hidden md:block"
          style={{
            backgroundImage: `url(${src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "300% 300%",
            backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
          }}
        />
      )}
    </div>
  );
}
