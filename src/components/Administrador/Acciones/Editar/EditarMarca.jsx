"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { editarMarca, ObtenerImagenProducto } from "@/lib/api";
import CropperModal from "@/components/CropperModal";

export default function EditarMarca({ marca, onCancel }) {
  const [formulario, setFormulario] = useState({
    id_marca: marca.id_marcas,
    nombre: marca.nombre || "",
    descripcion: marca.descripcion || "",
  });

  const [imagenOriginal, setImagenOriginal] = useState(null);
  const [imagenRecortada, setImagenRecortada] = useState(null);
  const [imagenActual, setImagenActual] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [estadoInicial, setEstadoInicial] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const cargarImagen = async () => {
      if (!marca.imagen_marca) return;
      try {
        const blob = await ObtenerImagenProducto(marca.imagen_marca);
        const url = URL.createObjectURL(blob);
        setImagenActual({ blob, url });
      } catch (error) {
        alert("No se pudo cargar la imagen:", marca.imagen_marca);
      }
    };

    setEstadoInicial({
      nombre: marca.nombre,
      descripcion: marca.descripcion || "",
      imagen_marca: marca.imagen_marca || "",
    });

    cargarImagen();
  }, [marca]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const seModificoAlgo = () => {
    if (!estadoInicial) return false;

    const nombreEditado = formulario.nombre !== estadoInicial.nombre;
    const descripcionEditada = formulario.descripcion !== estadoInicial.descripcion;
    const imagenEditada = !!imagenRecortada;

    return nombreEditado || descripcionEditada || imagenEditada;
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
    setImagenOriginal(null);
  };

  const handleSubmit = async () => {
    if (!seModificoAlgo()) return null;

    const formData = new FormData();
    formData.append("Token", "TOKENSUPERSECRETO");
    formData.append("Id_marcas", formulario.id_marca);
    formData.append("Nombre", formulario.nombre);
    formData.append("Descripcion", formulario.descripcion);

    if (imagenRecortada?.blob) {
      formData.append("imagen1", imagenRecortada.blob);
    }

    formData.append("Imagen_marca", marca.imagen_marca || "");

    setCargando(true);
    try {
      const response = await editarMarca(formData);
      if (response.valorConsulta === "1") {
        alert("Marca editada correctamente");
        onCancel();
      } else {
        alert(response.mensajeConsulta || "No se pudo editar");
      }
    } catch (error) {
      console.error("Error al editar:", error);
      alert("Error al editar la marca");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6">Editar Marca</h2>

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

      {/* Imagen actual / recortada */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Imagen de la marca</label>
        <div className="w-32 h-32 border border-dashed border-gray-400 rounded-md flex items-center justify-center bg-gray-50 mb-4 overflow-hidden relative">
          {imagenRecortada ? (
            <>
              <img
                src={imagenRecortada.url}
                alt="Nueva imagen"
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
          ) : imagenActual?.url ? (
            <img
              src={imagenActual.url}
              alt="Imagen actual"
              className="object-contain w-full h-full"
            />
          ) : (
            <span className="text-gray-400 text-sm text-center px-2">Sin imagen</span>
          )}
        </div>

        <label className="inline-block px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition-colors text-sm">
          Reemplazar imagen
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
          onClick={handleSubmit}
          disabled={cargando || !seModificoAlgo()}
          className="bg-green-600 text-white hover:bg-green-700"
        >
          {cargando ? "Guardando..." : "Guardar Cambios"}
        </Button>
        <Button
          onClick={onCancel}
          className="bg-gray-400 text-white hover:bg-gray-500"
        >
          Cancelar
        </Button>
      </div>

      <CropperModal
        imagenOriginal={imagenOriginal}
        isOpen={!!imagenOriginal}
        onClose={() => setImagenOriginal(null)}
        onCropped={handleImagenCortada}
      />
    </div>
  );
}
