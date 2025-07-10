"use client";

import { useEffect, useState } from "react";
import { obtenerProductos } from "@/lib/api";

export default function Tienda() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    obtenerProductos()
      .then((data) => setProductos(data))
      .catch(() => setError("Error al cargar los productos"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Productos en Tienda</h1>

      {loading && <p className="text-center">Cargando productos...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
        {productos.map((producto) => (
          <div
            key={producto.id_producto}
            className="group border rounded-lg overflow-hidden shadow-sm bg-white hover:shadow-md transition w-full max-w-[280px] flex flex-col"
          >
            {/* Imagen doble con hover */}
            <div className="relative aspect-[1/1] bg-gray-100">
              <img
                src={producto.urlImagen1}
                alt={producto.nombre}
                className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500 opacity-100 group-hover:opacity-0"
              />
              <img
                src={producto.urlImagen2}
                alt={producto.nombre}
                className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500 opacity-0 group-hover:opacity-100"
              />
            </div>

            {/* Contenido */}
            <div className="p-4 flex flex-col flex-grow">
              {/* Título: máximo 2 líneas */}
              <h2 className="text-md font-semibold leading-tight line-clamp-2">
                {producto.nombre}
              </h2>

              {/* Descripción: máximo 4 líneas */}
              <p className="text-gray-600 text-sm mt-1 line-clamp-4">
                {producto.descripcion}
              </p>

              {/* Precio */}
              <p className="text-green-700 font-bold mt-auto pt-3">
                S/. {(producto.precio ?? 0).toFixed(2)}
              </p>

              {/* Botón */}
              <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                Comprar
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
