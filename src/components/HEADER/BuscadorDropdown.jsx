// components/BuscadorDropdown.jsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBuscadorProductos } from "@/lib/hooks/useBuscadorProductos";
import { Search } from "lucide-react";

export default function BuscadorDropdown() {
  const [query, setQuery] = useState("");
  const { resultados, loading } = useBuscadorProductos(query);
  const router = useRouter();

  const irAVistaCompleta = () => {
    if (query.trim()) {
      router.push(`/tienda?busqueda=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        placeholder="Buscar productos..."
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {query && (
        <div className="absolute bg-white z-50 w-full mt-1 border border-gray-200 rounded shadow-md max-h-96 overflow-y-auto">
          {loading ? (
            <p className="p-3 text-sm text-gray-500">Buscando...</p>
          ) : resultados.length === 0 ? (
            <p className="p-3 text-sm text-gray-500">Sin resultados</p>
          ) : (
            <>
              {resultados.slice(0, 6).map((producto) => (
                <div
                  key={producto.Id_producto}
                  className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                  onClick={() => router.push(`/producto/${producto.NombreSlug}`)}
                >
                  <img src={producto.UrlImagen1} className="w-10 h-10 object-cover rounded" alt={producto.Nombre} />
                  <div className="text-sm">
                    <p className="font-semibold">{producto.Nombre}</p>
                    <p className="text-xs text-gray-500">S/ {producto.Precio.toFixed(2)}</p>
                  </div>
                </div>
              ))}
              {resultados.length > 6 && (
                <button
                  className="w-full text-center text-indigo-600 font-semibold py-2 border-t text-sm hover:bg-gray-50"
                  onClick={irAVistaCompleta}
                >
                  Ver más resultados
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
