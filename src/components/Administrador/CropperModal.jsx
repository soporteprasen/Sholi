"use client";

import { useState, useEffect, useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

// 👉 función para expandir imagen rectangular a cuadrado con fondo blanco
async function expandImageToSquare(imageUrl, forceSquare = true) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (!forceSquare) {
        // 👉 simplemente devolvemos la original
        resolve(imageUrl);
        return;
      }

      // 👉 forzamos cuadrado con fondo blanco
      const size = Math.max(img.width, img.height);
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, size, size);

      const offsetX = (size - img.width) / 2;
      const offsetY = (size - img.height) / 2;
      ctx.drawImage(img, offsetX, offsetY);

      resolve(canvas.toDataURL("image/png"));
    };
    img.src = imageUrl;
  });
}


export default function CropperModal({
  imagenOriginal,
  isOpen,
  onClose,
  onCropped,
  ancho,
  alto,
  onReady
}) {
  const cropperRef = useRef(null);
  const [imagenProcesada, setImagenProcesada] = useState(null);
  const [scaleX, setScaleX] = useState(1);

  useEffect(() => {
    if (imagenOriginal) {
      expandImageToSquare(imagenOriginal, ancho === alto) // 👈 solo cuadramos si ancho == alto
        .then((result) => {
          setImagenProcesada(result);
          setScaleX(1);
        });
    } else {
      setImagenProcesada(null);
      setScaleX(1);
    }
  }, [imagenOriginal, ancho, alto]);

  const getCropper = () => cropperRef.current?.cropper;

  const handleRecortarImagen = () => {
    const cropper = getCropper();
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas({
        width: ancho,
        height: alto,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
      });

      if (croppedCanvas) {
        croppedCanvas.toBlob(
          (blob) => {
            if (blob) onCropped(blob);
          },
          "image/webp",
          0.8
        );
      }
    }
  };

  const handleCerrar = () => {
    // Opcional: limpiar estados internos antes de cerrar
    setImagenProcesada(null);
    setScaleX(1);
    onClose?.();
  };

  const rotateLeft = () => {
    const cropper = getCropper();
    if (cropper) cropper.rotate(-15);
  };

  const rotateRight = () => {
    const cropper = getCropper();
    if (cropper) cropper.rotate(15);
  };

  const toggleFlipHorizontal = () => {
    const cropper = getCropper();
    if (!cropper) return;
    const newScale = scaleX * -1;
    cropper.scaleX(newScale);
    setScaleX(newScale);
  };

  const zoomIn = () => {
    const cropper = getCropper();
    if (cropper) cropper.zoom(0.1);
  };

  const zoomOut = () => {
    const cropper = getCropper();
    if (cropper) cropper.zoom(-0.1);
  };

  if (!isOpen || !imagenProcesada) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-5xl w-full relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Editar imagen</h2>
          <button
            type="button"
            onClick={handleCerrar}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Cerrar"
            title="Cerrar"
          >
            {/* X icon */}
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Cropper */}
        <div className="flex justify-center">
          <div className="w-full max-w-[600px] aspect-square">
            <Cropper
              src={imagenProcesada} // 👈 usamos la imagen cuadrada procesada
              style={{ width: "100%", height: "100%" }}
              initialAspectRatio={ancho / alto}   // 👈 relación ancho/alto que le pasas
              aspectRatio={ancho / alto}          // 👈 relación rectangular
              viewMode={0} // más libertad para alejar
              guides={true}
              ref={cropperRef}
              background={false}
              dragMode="move"
              cropBoxMovable={false}
              cropBoxResizable={false}
              ready={() => {
                onReady
                const cropper = getCropper();
                if (cropper) {
                  cropper.zoomTo(0.8); // inicia un poco más alejada
                }
                if (typeof onReady === "function") {
                  onReady(); // ✅ ejecutamos el callback que viene del padre
                }
              }}
            />
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
          <button
            type="button"
            onClick={rotateLeft}
            className="px-3 py-2 rounded-md border hover:bg-gray-50"
            title="Girar 15° a la izquierda"
          >
            <span className="inline-flex items-center gap-2">
              {/* rotate-left icon */}
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path
                  d="M7 7l-3 3m0 0l3 3m-3-3h10a6 6 0 1 1-1.76 11.76"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              -15°
            </span>
          </button>

          <button
            type="button"
            onClick={rotateRight}
            className="px-3 py-2 rounded-md border hover:bg-gray-50"
            title="Girar 15° a la derecha"
          >
            <span className="inline-flex items-center gap-2">
              {/* rotate-right icon */}
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path
                  d="M17 7l3 3m0 0l-3 3m3-3H10a6 6 0 1 0 1.76 11.76"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              +15°
            </span>
          </button>

          <button
            type="button"
            onClick={toggleFlipHorizontal}
            className="px-3 py-2 rounded-md border hover:bg-gray-50"
            title="Espejo horizontal"
          >
            <span className="inline-flex items-center gap-2">
              {/* mirror icon */}
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path
                  d="M12 4v16M4 12h16M8 6l-4 6 4 6M16 6l4 6-4 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Espejo
            </span>
          </button>

          <button
            type="button"
            onClick={zoomOut}
            className="px-3 py-2 rounded-md border hover:bg-gray-50"
            title="Disminuir zoom"
          >
            <span className="inline-flex items-center gap-2">
              {/* zoom out icon */}
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path
                  d="M15.5 15.5L20 20M10 6a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm-3 4h6"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
              Zoom −
            </span>
          </button>

          <button
            type="button"
            onClick={zoomIn}
            className="px-3 py-2 rounded-md border hover:bg-gray-50"
            title="Aumentar zoom"
          >
            <span className="inline-flex items-center gap-2">
              {/* zoom in icon */}
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path
                  d="M15.5 15.5L20 20M10 6a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0-2v6m-3-3h6"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
              Zoom +
            </span>
          </button>
        </div>

        {/* Botón Recortar */}
        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={handleRecortarImagen}
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Recortar Imagen
          </button>
        </div>
      </div>
    </div>
  );
}
