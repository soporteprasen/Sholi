"use client";

import { useEffect, useState } from "react";
import { obtenerProductosAdmin, EliminarProducto } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import EditarProducto from "@/components/Administrador/Acciones/Editar/EditarProducto";
import CrearProducto from "@/components/Administrador/Acciones/Crear/CrearProducto";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdministrarProductos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [modoCreacion, setModoCreacion] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    async function fetchProductos() {
      try {
        const data = await obtenerProductosAdmin();
        if(data.valorConsulta === "1")
        {  
          setProductos(data);
        }
      } catch (error) {
        console.error("Error al obtener productos:", error);
      } finally {
        setCargando(false);
      }
    }

    fetchProductos();
  }, []);

  const handleEliminar = (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      const data = EliminarProducto(id)
      if(data.valorConsulta === "1")
      {
        alert("Producto eliminado correctamente")
      }
      else
      {
        alert("erro al intentar eliminar"+data.mensajeConsulta)
      }
    }
  };

  const handleEditar = (producto) => {
    setProductoSeleccionado(producto);
    setModoEdicion(true);
  };

  const handleCancelarAccion = () => {
    fetchProductos();
    recargarYVolverAlInicio();
    setProductoSeleccionado(null);
    setModoEdicion(false);
    setModoCreacion(false);
  };

  const fetchProductos = async () => {
    try {
      setCargando(true);
      const data = await obtenerProductosAdmin();
      setProductos(data || []);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    } finally {
      setCargando(false);
    }
  };

  const recargarYVolverAlInicio = async () => {
    await fetchProductos();
    setProductoSeleccionado(null);
    setModoEdicion(false);
    setModoCreacion(false);

    // Desplazar al inicio (opcional)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAgregarProducto = () => {
    setModoCreacion(true);
  };

  return (
    <div className="p-4">
      {modoEdicion ? (
        <EditarProducto producto={productoSeleccionado} onCancel={handleCancelarAccion} onFinalizar={recargarYVolverAlInicio}/>
      ) : modoCreacion ? (
        <CrearProducto onCancel={handleCancelarAccion}/>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold">Administrar Productos</h2>
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto"
              onClick={handleAgregarProducto}
            >
              + Agregar Producto
            </Button>
          </div>

          {cargando ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, idx) => (
                <div
                  key={idx}
                  className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border rounded bg-white shadow-sm"
                >
                  <Skeleton className="h-4 w-full md:w-1/4" /> {/* Nombre */}
                  <Skeleton className="h-4 w-full md:w-1/6" /> {/* Precio */}
                  <Skeleton className="h-4 w-full md:w-1/6" /> {/* Stock */}
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded" /> {/* Botón editar */}
                    <Skeleton className="h-8 w-8 rounded" /> {/* Botón eliminar */}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 text-sm md:text-base">
                <thead className="hidden md:table-header-group bg-gray-100">
                  <tr>
                    <th className="text-left p-2 border-b">Nombre</th>
                    <th className="text-left p-2 border-b">Precio</th>
                    <th className="text-left p-2 border-b">Stock</th>
                    <th className="text-left p-2 border-b">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center p-4">
                        No hay productos.
                      </td>
                    </tr>
                  ) : (
                    productos.map((producto) => (
                      <tr
                        key={producto.id_producto}
                        className="border md:table-row flex flex-col md:flex-row mb-4 md:mb-0 bg-white rounded shadow-sm md:shadow-none"
                      >
                        <td className="p-3 border-b md:border-b-0 md:table-cell max-w-full break-all overflow-hidden">
                          <span className="font-semibold md:hidden">Nombre: </span>
                          {producto.nombre}
                        </td>
                        <td className="p-3 border-b md:border-b-0 md:table-cell">
                          <span className="font-semibold md:hidden">Precio: </span>
                          S/ {producto.precio}
                        </td>
                        <td className="p-3 border-b md:border-b-0 md:table-cell">
                          <span className="font-semibold md:hidden">Stock: </span>
                          {producto.stock}
                        </td>
                        <td className="p-3 md:table-cell">
                          <div className="flex gap-2 justify-start md:justify-center">
                            <button
                              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                              onClick={() => handleEditar(producto)}
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                              onClick={() => handleEliminar(producto.id_producto)}
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
