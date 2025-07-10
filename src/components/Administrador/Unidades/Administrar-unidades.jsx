"use client";

import { useEffect, useState } from "react";
import { obtenerUnidades, EliminarUnidad } from "@/lib/api";
import CrearUnidad from "@/components/Administrador/Acciones/Crear/CrearUnidad";
import EditarUnidad from "@/components/Administrador/Acciones/Editar/EditarUnidad";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdministrarMarcas() {
  const [unidad, setUnidad] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [modoCreacion, setModoCreacion] = useState(false);
  const [unidadSeleccionada, setUnidadSeleccionada] = useState(null);

  useEffect(() => {
    async function fetchUnidades() {
      try {
        const data = await obtenerUnidades();
        setUnidad(data || []);
      } catch (error) {
        alert("Error al obtener unidades:", error);
      } finally {
        setCargando(false);
      }
    }

    fetchUnidades();
  }, []);

  const handleEliminar = (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta unidad?")) {
      EliminarUnidad(id)
        .then((respuesta) => {
          if (respuesta.valorConsulta == "1") {
            setUnidad(unidad.filter((unidad) => unidad.id_unidad !== id));
            alert(respuesta.mensajeConsulta);
          } else {
            alert("Error al eliminar la unidad");
          }
        })
        .catch((error) => {
          console.error("Error al eliminar unidad:", error);
          alert("Error al eliminar la unidad");
        });
    }
  };

  const handleEditar = (data) => {
    setUnidadSeleccionada(data);
    setModoEdicion(true);
  };

  const handleCancelarAccion = () => {
    setUnidadSeleccionada(null);
    setModoEdicion(false);
    setModoCreacion(false);
  };

  const handleAgregarUnidad = () => {
    setModoCreacion(true);
  };

  return (
    <div className="p-4">
      {modoEdicion ? (
        <EditarUnidad unidad={unidadSeleccionada} onCancel={handleCancelarAccion} />
      ) : modoCreacion ? (
        <CrearUnidad onCancel={handleCancelarAccion} />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold">Administrar Unidades</h2>
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto"
              onClick={handleAgregarUnidad}
            >
              + Agregar Unidad
            </Button>
          </div>

          {cargando ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, idx) => (
                <div
                  key={idx}
                  className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border rounded bg-white shadow-sm"
                >
                  <Skeleton className="h-4 w-full md:w-4/5" /> {/* Nombre marca */}
                  <div className="flex gap-2 md:justify-end w-full md:w-1/5">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="min-w-full table-fixed border border-gray-200 text-sm md:text-base">
                <thead className="hidden md:table-header-group bg-gray-100">
                  <tr>
                    <th className="text-left p-2 border-b w-4/5">Nombre</th>
                    <th className="text-right p-2 border-b w-1/5">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {unidad.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="text-center p-4">
                        No hay unidades registradas.
                      </td>
                    </tr>
                  ) : (
                    unidad.map((unidad) => (
                      <tr
                        key={unidad.id_unidad}
                        className="border md:table-row flex flex-col md:flex-row mb-4 md:mb-0 bg-white rounded shadow-sm md:shadow-none"
                      >
                        <td className="p-3 border-b md:border-b-0 md:table-cell break-words w-4/5">
                          <span className="font-semibold md:hidden">Nombre: </span>
                          {unidad.nombre}
                        </td>
                        <td className="p-3 md:table-cell w-full md:w-1/5 whitespace-nowrap">
                          <span className="font-semibold md:hidden">Acciones: </span>
                          <div className="flex gap-2 justify-end">
                            <button
                              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                              onClick={() => handleEditar(unidad)}
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                              onClick={() => handleEliminar(unidad.id_unidad)}
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
