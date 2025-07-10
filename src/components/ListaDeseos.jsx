// components/WishListFloating.jsx
"use client";

import { useState } from "react";
import { Heart, X } from "lucide-react";

export default function WishListFloating({ deseos = [] }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setAbierto(true)}
        className="fixed bottom-6 right-6 z-50 bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg"
      >
        <Heart className="w-6 h-6" />
        <span className="absolute top-0 right-0 bg-white text-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {deseos.length}
        </span>
      </button>

      {/* Modal de lista de deseos */}
      {abierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-40">
          <div className="bg-white w-80 h-full shadow-lg p-4 flex flex-col relative">
            {/* Cerrar */}
            <button
              onClick={() => setAbierto(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            {/* Contenido */}
            <h2 className="text-lg font-semibold mb-4">Lista de deseos</h2>
            <div className="flex-1 overflow-y-auto space-y-4">
              {deseos.length === 0 ? (
                <p className="text-gray-500">Tu lista está vacía.</p>
              ) : (
                deseos.map((producto) => (
                  <div
                    key={producto.id}
                    className="flex items-center space-x-3 border-b pb-2"
                  >
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <h3 className="text-sm font-medium">{producto.nombre}</h3>
                      <p className="text-xs text-gray-500">${producto.precio}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
