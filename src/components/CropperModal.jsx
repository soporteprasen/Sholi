"use client";

import { useEffect, useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

export default function CropperModal({ imagenOriginal, isOpen, onClose, onCropped }) {
  const cropperRef = useRef(null);

  const handleRecortarImagen = () => {
    
    const cropper = cropperRef.current.cropper;

    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas({
        width: 1200,
        height: 1200,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
      });

      if (croppedCanvas) {
        croppedCanvas.toBlob((blob) => {
          if (blob) {
            onCropped(blob);
            onClose();
          }
        }, "image/webp", 0.8);
      }
    }else{
      alert("Cropper no está disponible");
    }
  };

  const handleResetear = () => {
    cropperRef.current?.cropper.reset();
  };

  const handleRotar = () => {
    cropperRef.current?.cropper.rotate(90);
  };

  const handleZoomIn = () => {
    cropperRef.current?.cropper.zoom(0.1);
  };

  const handleZoomOut = () => {
    cropperRef.current?.cropper.zoom(-0.1);
  };

  if (!isOpen || !imagenOriginal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-none bg-black/20 transition-opacity duration-300 ease-in-out">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-5xl w-full relative overflow-hidden">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h3 className="text-xl font-bold">Editor de Imagen</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Botones */}
        <div className="flex justify-center gap-4 mb-4 flex-wrap">
          <button onClick={handleRotar} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Rotar 90°
          </button>
          <button onClick={handleResetear} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
            Resetear
          </button>
          <button onClick={handleZoomIn} className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
            Zoom +
          </button>
          <button onClick={handleZoomOut} className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
            Zoom -
          </button>
        </div>

        {/* Cropper */}
        <div className="flex justify-center">
          <div style={{ width: "600px", height: "600px" }}>
            <Cropper
              src={imagenOriginal}
              style={{ width: "100%", height: "100%" }}
              initialAspectRatio={1}
              aspectRatio={1}
              viewMode={3}
              autoCropArea={1}
              guides={true}
              ref={cropperRef}
              background={false}
              dragMode="move"
              cropBoxMovable={false}
              cropBoxResizable={false}
              minCropBoxWidth={1200}
              minCropBoxHeight={1200}
            />
          </div>
        </div>

        {/* Botón Recortar */}
        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={handleRecortarImagen}
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Recortar Imagen
          </button>
        </div>
      </div>
    </div>
  );
}
