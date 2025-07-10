"use client";

import { useEffect, useState } from "react";
import { obtenerCategorias, EliminarCategoria } from "@/lib/api";
import CrearCategoria from "@/components/Administrador/Acciones/Crear/CrearCategoria";
import EditarCategoria from "@/components/Administrador/Acciones/Editar/EditarCategoria";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdministrarCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [modoCreacion, setModoCreacion] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const data = await obtenerCategorias();
        setCategorias(data || []);
      } catch (error) {
        alert("Error al obtener categorías:", error);
      } finally {
        setCargando(false);
      }
    }

    fetchCategorias();
  }, []);

  const handleEliminar = (id) => {
    const categoria = categorias.find((cat) => cat.id_categoria === id);
    if (!categoria) return;

    if (window.confirm("¿Estás seguro de eliminar esta categoría?")) {
      EliminarCategoria(categoria.id_categoria, categoria.imagen_categoria || "")
        .then((respuesta) => {
          if (respuesta.valorConsulta === "1") {
            setCategorias(categorias.filter((cat) => cat.id_categoria !== id));
            alert(respuesta.mensajeConsulta);
          } else {
            alert(respuesta.mensajeConsulta);
          }
        })
        .catch((error) => {
          console.error("Error al eliminar categoría:", error);
          alert("Error al eliminar la categoría");
        });
    }
  };

  const handleEditar = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setModoEdicion(true);
  };

  const handleCancelarAccion = () => {
    setCategoriaSeleccionada(null);
    setModoEdicion(false);
    setModoCreacion(false);
  };

  const handleAgregarCategoria = () => {
    setModoCreacion(true);
  };

  return (
    <div className="p-4">
      {modoEdicion ? (
        <EditarCategoria
          categoria={categoriaSeleccionada}
          onCancel={handleCancelarAccion}
        />
      ) : modoCreacion ? (
        <CrearCategoria onCancel={handleCancelarAccion} />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold">Administrar Categorías</h2>
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto"
              onClick={handleAgregarCategoria}
            >
              + Agregar Categoría
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
                  {categorias.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="text-center p-4">
                        No hay categorías.
                      </td>
                    </tr>
                  ) : (
                    categorias.map((categoria) => (
                      <tr
                        key={categoria.id_categoria}
                        className="border md:table-row flex flex-col md:flex-row mb-4 md:mb-0 bg-white rounded shadow-sm md:shadow-none"
                      >
                        <td className="p-3 border-b md:border-b-0 md:table-cell break-words w-4/5">
                          <span className="font-semibold md:hidden">Nombre: </span>
                          {categoria.nombre}
                        </td>
                        <td className="p-3 md:table-cell w-full md:w-1/5 whitespace-nowrap">
                          <span className="font-semibold md:hidden">Acciones: </span>
                          <div className="flex gap-2 justify-end">
                            <button
                              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                              onClick={() => handleEditar(categoria)}
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                              onClick={() => handleEliminar(categoria.id_categoria)}
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
