"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { crearUnidadMedida } from "@/lib/api";

export default function CrearUnidadMedida({ onCancel }) {
  const [formulario, setFormulario] = useState({
    nombre: "",
    abreviatura: "",
  });

  const [guardando, setGuardando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    if (!formulario.nombre?.trim() || !formulario.abreviatura?.trim()) {
      alert("Nombre y abreviatura son obligatorios.");
      return;
    }

    setGuardando(true);
    try {
      const response = await crearUnidadMedida(formulario);
      if (response.valorConsulta === "1") {
        alert("Unidad de medida registrada correctamente.");
        if (onCancel) onCancel();
      } else {
        alert("Error: " + response.mensajeConsulta);
      }
    } catch (error) {
      console.error(error);
      alert("Error inesperado al guardar la unidad.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6">Crear Unidad de Medida</h2>

      {/* Nombre */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Nombre</label>
        <input
          type="text"
          name="nombre"
          value={formulario.nombre}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded p-2"
          placeholder="Ej. Kilogramo"
        />
      </div>

      {/* Abreviatura */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Abreviatura</label>
        <input
          type="text"
          name="abreviatura"
          value={formulario.abreviatura}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded p-2"
          placeholder="Ej. kg"
        />
      </div>

      {/* Botones */}
      <div className="flex gap-4 mt-6">
        <Button
          onClick={handleGuardar}
          disabled={guardando}
          className="bg-green-600 text-white hover:bg-green-700"
        >
          {guardando ? "Guardando..." : "Guardar"}
        </Button>
        <Button
          onClick={onCancel}
          className="bg-gray-400 text-white hover:bg-gray-500"
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
}
