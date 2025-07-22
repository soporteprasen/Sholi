"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { editarUnidadMedida } from "@/lib/api";

export default function EditarUnidadMedida({ unidad, onCancel }) {
  const [formulario, setFormulario] = useState({
    id_unidad: unidad.id_unidad,
    nombre: unidad.nombre || "",
    abreviatura: unidad.abreviatura || "",
    Token: unidad.Token
  });

  const [estadoInicial, setEstadoInicial] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setEstadoInicial({
      nombre: unidad.nombre || "",
      abreviatura: unidad.abreviatura || "",
    });
  }, [unidad]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const seModificoAlgo = () => {
    if (!estadoInicial) return false;
    return (
      formulario.nombre !== estadoInicial.nombre ||
      formulario.abreviatura !== estadoInicial.abreviatura
    );
  };

  const handleGuardar = async () => {
    if (!formulario.nombre?.trim() || !formulario.abreviatura?.trim()) {
      alert("Nombre y abreviatura son obligatorios.");
      return;
    }

    if (!seModificoAlgo()) {
      alert("No se ha realizado ningún cambio.");
      return;
    }

    setGuardando(true);
    try {
        formulario.Token = "TOKENSUPERSECRETO"
      const response = await editarUnidadMedida(formulario);
      if (response.valorConsulta === "1") {
        alert("Unidad de medida editada correctamente.");
        if (onCancel) onCancel();
      } else {
        alert("Error: " + response.mensajeConsulta);
      }
    } catch (error) {
      console.error(error);
      alert("Error inesperado al editar la unidad.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6">Editar Unidad de Medida</h2>

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
          disabled={guardando || !seModificoAlgo()}
          className="bg-green-600 text-white hover:bg-green-700"
        >
          {guardando ? "Guardando..." : "Guardar Cambios"}
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
