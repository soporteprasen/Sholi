/* ./components/MbuscadorProductos.jsx */
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { obtenerCoincidenciasBuscador } from "@/lib/api";
import { Search } from "lucide-react";

export default function BuscadorMobil() {
  const [texto, setTexto] = useState("");
  const [resultados, setResultados] = useState([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [tieneMas, setTieneMas] = useState(false);
  const contenedorRef = useRef(null);
  const router = useRouter();

  /* Cerrar lista si clickeás fuera */
  useEffect(() => {
    const clickFuera = (e) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
        setMostrarResultados(false);
      }
    };
    document.addEventListener("mousedown", clickFuera);
    return () => document.removeEventListener("mousedown", clickFuera);
  }, []);

  /* Búsqueda con debounce */
  useEffect(() => {
    if (texto.trim().length < 3) {
      setResultados([]);
      setMostrarResultados(false);
      return;
    }

    const t = setTimeout(async () => {
      try {
        const res = await obtenerCoincidenciasBuscador(texto, 0, 7, "nombre", "asc");
        const válidos = res
          .filter((p) => p?.id_producto && p?.nombre)
          .map((p) => ({
            ...p,
            urlImagen1: p.urlImagen1
              ? process.env.NEXT_PUBLIC_SIGNALR_URL + p.urlImagen1
              : "/not-found.webp",
          }));

        setTieneMas(válidos.length > 6);
        setResultados(válidos.slice(0, 6));
        setMostrarResultados(true);
      } catch (err) {
        console.error("Error búsqueda:", err);
        setResultados([]);
        setMostrarResultados(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [texto]);

  const irAProducto = (prod) => {
    setMostrarResultados(false);
    setTexto("");
    router.push(`/producto/${prod.nombreSlug}`);
  };

  const irATienda = () => {
    setMostrarResultados(false);
    setTexto("");
    router.push(`/tienda?buscar=${encodeURIComponent(texto)}`);
  };

  /* UI */
  return (
    <div className="relative pt-2.5" ref={contenedorRef}>
      {/* Input + icono */}
      <div className="flex items-center bg-[#1f3d7a] px-3 py-2">
        <input
          type="text"
          placeholder="Buscar productos ..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onFocus={() => setMostrarResultados(resultados.length > 0)}
          className="bg-transparent flex-grow text-white text-sm placeholder-white focus:outline-none"
        />
        <Search className="w-5 h-5 text-white" />
      </div>

      {/* Resultados */}
      {mostrarResultados && resultados.length > 0 && (
        <div className="absolute inset-x-0 mt-1 bg-white text-white rounded-xl shadow-xl border z-50 max-h-96 overflow-y-auto">
          {resultados.map((prod) => (
            <div
              key={prod.id_producto}
              onClick={() => irAProducto(prod)}
              className="flex items-center gap-3 p-3 border-b last:border-0 cursor-pointer hover:bg-gray-100"
            >
              <img
                src={prod.urlImagen1}
                alt={prod.nombre}
                className="w-12 h-12 object-contain border rounded"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {prod.nombre}
                </p>
                <p className="text-xs text-gray-500">(SKU: {prod.codigo})</p>
              </div>
              <span className="text-sm font-bold text-green-600 whitespace-nowrap">
                S/ {prod.precio?.toFixed(2)}
              </span>
            </div>
          ))}

          {tieneMas && (
            <div
              className="sticky bottom-0 bg-white border-t p-3 text-center text-indigo-600 text-sm cursor-pointer hover:underline"
              onClick={irATienda}
            >
              VER TODOS LOS PRODUCTOS...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
