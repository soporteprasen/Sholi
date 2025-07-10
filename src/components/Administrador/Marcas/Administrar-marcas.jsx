"use client";

import { useEffect, useState } from "react";
import { obtenerMarcas, EliminarMarca } from "@/lib/api"; 
import CrearMarca from "@/components/Administrador/Acciones/Crear/CrearMarca";
import EditarMarca from "@/components/Administrador/Acciones/Editar/EditarMarca";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdministrarMarcas() {
  const [marcas, setMarcas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [modoCreacion, setModoCreacion] = useState(false);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState(null);

  useEffect(() => {
    async function fetchMarcas() {
      try {
        const data = await obtenerMarcas();
        setMarcas(data || []);
      } catch (error) {
        console.error("Error al obtener marcas:", error);
      } finally {
        setCargando(false);
      }
    }

    fetchMarcas();
  }, []);

  const handleEliminar = (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta marca?")) {
      EliminarMarca(id)
        .then((respuesta) => {
          if (respuesta.valorConsulta === "1") {
            setMarcas(marcas.filter((marca) => marca.id_marcas !== id));
            alert("Marca eliminada correctamente");
          } else {
            alert(respuesta.mensajeConsulta);
          }
        })
        .catch((error) => {
          console.error("Error al eliminar marca:", error);
          alert("Error al eliminar la marca");
        });
    }
  };

  const handleEditar = (marca) => {
    setMarcaSeleccionada(marca);
    setModoEdicion(true);
  };

  const handleCancelarAccion = () => {
    setMarcaSeleccionada(null);
    setModoEdicion(false);
    setModoCreacion(false);
  };

  const handleAgregarMarca = () => {
    setModoCreacion(true);
  };

  return (
    <div className="p-4">
      {modoEdicion ? (
        <EditarMarca marca={marcaSeleccionada} onCancel={handleCancelarAccion} />
      ) : modoCreacion ? (
        <CrearMarca onCancel={handleCancelarAccion} />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold">Administrar Marcas</h2>
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto"
              onClick={handleAgregarMarca}
            >
              + Agregar Marca
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
                  {marcas.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="text-center p-4">
                        No hay marcas registradas.
                      </td>
                    </tr>
                  ) : (
                    marcas.map((marca) => (
                      <tr
                        key={marca.id_marcas}
                        className="border md:table-row flex flex-col md:flex-row mb-4 md:mb-0 bg-white rounded shadow-sm md:shadow-none"
                      >
                        <td className="p-3 border-b md:border-b-0 md:table-cell break-words w-4/5">
                          <span className="font-semibold md:hidden">Nombre: </span>
                          {marca.nombre}
                        </td>
                        <td className="p-3 md:table-cell w-full md:w-1/5 whitespace-nowrap">
                          <span className="font-semibold md:hidden">Acciones: </span>
                          <div className="flex gap-2 justify-end">
                            <button
                              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                              onClick={() => handleEditar(marca)}
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                              onClick={() => handleEliminar(marca.id_marcas)}
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
