"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { obtenerCoincidenciasBuscador } from "@/lib/api";
import { Search } from "lucide-react";

export default function Buscador() {
  const [texto, setTexto] = useState("");
  const [resultados, setResultados] = useState([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [tieneMas, setTieneMas] = useState(false);
  const contenedorRef = useRef(null);
  const router = useRouter();
  const inputRef = useRef(null);

  // Cerrar resultados al hacer clic fuera
  useEffect(() => {
    const handleClickFuera = (e) => {
      if (
        contenedorRef.current &&
        !contenedorRef.current.contains(e.target)
      ) {
        setMostrarResultados(false);
      }
    };

    document.addEventListener("mousedown", handleClickFuera);
    return () => {
      document.removeEventListener("mousedown", handleClickFuera);
    };
  }, []);

  function handleClickProducto(prod) {
    setMostrarResultados(false);
    setTexto("");
    router.push(`/producto/${prod.nombreSlug}`);
  }

  // Buscar coincidencias
  useEffect(() => {
    if (texto.trim().length < 3) {
      setResultados([]);
      setMostrarResultados(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await obtenerCoincidenciasBuscador(texto, 0, 7, "nombre", "asc");

        const productosConBlobs = await Promise.all(
          res.map(async (producto) => {
            let url1 = "/not-found.webp";
            if (producto.urlImagen1) {
              url1 = process.env.NEXT_PUBLIC_SIGNALR_URL + producto.urlImagen1;
            }
            return { ...producto, urlImagen1: url1 };
          })
        );

        const nuevosValidos = productosConBlobs.filter(p => p?.id_producto && p?.nombre);
        setTieneMas(nuevosValidos.length > 6);
        setResultados(nuevosValidos.slice(0, 6));
        setMostrarResultados(true);

      } catch (err) {
        console.error("Error en búsqueda:", err);
        setResultados([]);
        setMostrarResultados(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [texto]);

  const redirigirTienda = () => {
    setMostrarResultados(false);
    setTexto("");
    router.push(`/tienda?buscar=${encodeURIComponent(texto)}`);
  };

  return (
    <div className="relative col-span-1" ref={contenedorRef}>
      {/* Icono buscador */}
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" aria-hidden="true" />

      {/* Input */}
      <input
        id="buscador"
        ref={inputRef}
        type="text"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onFocus={() => setMostrarResultados(resultados.length > 0)}
        placeholder="Buscar productos..."
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Resultados */}
      {mostrarResultados && resultados.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl w-full max-h-96 overflow-y-auto">
          <div className="pb-1">
            {resultados.map((prod) => (
              <div
                key={prod.id_producto}
                className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleClickProducto(prod)}
              >
                <div className="w-12 h-12 flex-shrink-0">
                  <img
                    src={prod.urlImagen1}
                    alt={prod.nombre}
                    className="w-full h-full object-contain rounded border"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                    {prod.nombre}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    (SKU: {prod.codigo})
                  </p>
                </div>

                <div className="ml-auto text-sm font-bold text-green-600 whitespace-nowrap">
                  S/ {prod.precio?.toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {tieneMas && (
            <div
              className="sticky bottom-0 bg-white border-t border-gray-200 p-3 text-center text-indigo-600 text-sm cursor-pointer hover:underline"
              onClick={redirigirTienda}
            >
              VER TODOS LOS PRODUCTOS...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
