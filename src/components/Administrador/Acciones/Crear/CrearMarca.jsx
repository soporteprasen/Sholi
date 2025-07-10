"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import CropperModal from "@/components/CropperModal";
import { crearMarca } from "@/lib/api";

export default function CrearMarca({ onCancel }) {
  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
  });

  const [archivoFicha, setArchivoFicha] = useState(null);
  const [imagenOriginal, setImagenOriginal] = useState(null);
  const [imagenRecortada, setImagenRecortada] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const handleAgregarImagen = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          setImagenOriginal(reader.result);
        };
        img.onerror = () => {
          alert("La imagen está dañada o no se puede procesar.");
          event.target.value = "";
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      alert("Selecciona una imagen válida.");
      event.target.value = "";
    }
  };

  const handleImagenCortada = (blob) => {
    const urlTemporal = URL.createObjectURL(blob);
    setImagenRecortada({ blob, url: urlTemporal });
  };

  const handleGuardarMarca = async () => {
    if (!formulario.nombre?.trim() || !formulario.descripcion?.trim()) {
      alert("Nombre y descripción son obligatorios.");
      return;
    }

    const datos = {
      nombre: formulario.nombre,
      descripcion: formulario.descripcion,
      Imagenes: imagenRecortada
        ? [{ NombreArchivo: "logo_marca.webp" }]
        : [],
      archivoFicha,
    };

    if (imagenRecortada) {
      datos["imagenArchivo_0"] = imagenRecortada.blob;
    }

    setGuardando(true);
    try {
      const response = await crearMarca(datos);
      if (response.valorConsulta === "1") {
        alert("Marca registrada correctamente.");
        if (onCancel) onCancel();
      } else {
        alert("Error: " + response.mensajeConsulta);
      }
    } catch (error) {
      console.error(error);
      alert("Error inesperado al guardar la marca.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6">Crear Marca</h2>

      {/* Nombre */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Nombre</label>
        <input
          type="text"
          name="nombre"
          value={formulario.nombre}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded p-2"
          placeholder="Nombre de la marca"
        />
      </div>

      {/* Descripción */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Descripción</label>
        <textarea
          name="descripcion"
          value={formulario.descripcion}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded p-2"
          rows="3"
          placeholder="Descripción breve"
        ></textarea>
      </div>

      {/* Imagen recortada */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Logo de la marca</label>
      
        {/* Contenedor de imagen */}
        <div className="w-32 h-32 border border-dashed border-gray-400 rounded-md flex items-center justify-center bg-gray-50 mb-4 overflow-hidden relative">
          {imagenRecortada ? (
            <>
              <img
                src={imagenRecortada.url}
                alt="Previsualización"
                className="object-contain w-full h-full"
              />
              <button
                type="button"
                onClick={() => setImagenRecortada(null)}
                className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded px-2 py-0.5 hover:bg-red-700 transition"
              >
                Eliminar
              </button>
            </>
          ) : (
            <span className="text-gray-400 text-sm text-center px-2">
              Sin imagen
            </span>
          )}
        </div>
      
        {/* Botón para seleccionar imagen */}
        <label className="inline-block px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition-colors text-sm">
          Seleccionar imagen
          <input
            type="file"
            accept="image/*"
            onChange={handleAgregarImagen}
            className="hidden"
          />
        </label>
      </div>

      {/* Botones */}
      <div className="flex gap-4 mt-6">
        <Button
          onClick={handleGuardarMarca}
          disabled={guardando}
          className="bg-green-600 text-white hover:bg-green-700"
        >
          {guardando ? "Guardando..." : "Guardar Marca"}
        </Button>
        <Button
          onClick={onCancel}
          className="bg-gray-400 text-white hover:bg-gray-500"
        >
          Cancelar
        </Button>
      </div>

      {/* Cropper */}
      <CropperModal
        imagenOriginal={imagenOriginal}
        isOpen={!!imagenOriginal}
        onClose={() => setImagenOriginal(null)}
        onCropped={handleImagenCortada}
      />
    </div>
  );
}
