"use client";

import { Search, User, Settings, ShoppingCart } from "lucide-react"; 
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {obtenerCoincidenciasBuscador, ObtenerImagenProducto, RecorrerCarpetaImagenes} from "@/lib/api"; 

export default function DbarraPrincipal() {
  const [texto, setTexto] = useState("");
  const [resultados, setResultados] = useState([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [tieneMas, setTieneMas] = useState(false);
  const contenedorRef = useRef();
  const router = useRouter();
  const inputRef = useRef();

  useEffect(() => {
    const cargarLogo = async () => {
      try {
        const rutas = await RecorrerCarpetaImagenes("imagenes/logo-tienda");

        if (rutas.length > 0) {
          try {
            const blob = await ObtenerImagenProducto(rutas[0].urlImagen);
            const url = URL.createObjectURL(blob);
            setImagenLogo(url);
          } catch {
            setImagenLogo("/not-found.webp");
          }
        }
      } catch (error) {
        console.error("Error al cargar logo:", error);
        setImagenLogo("/not-found.webp");
      }
    };
    //cargarLogo();
  }, []);

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

  useEffect(() => {
    if (texto.trim().length < 3) {
      setResultados([]);
      setMostrarResultados(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await obtenerCoincidenciasBuscador(texto, 0, 7); // pedimos 7

        const productosConBlobs = await Promise.all(
          res.map(async (producto) => {
            let url1 = "";
            try {
              if (producto.id_producto !== null) {
                const blob1 = await ObtenerImagenProducto(producto.urlImagen1);
                url1 = URL.createObjectURL(blob1);
              }
            } catch (e) {
              alert("Error al cargar imágenes de producto", producto.nombre, producto.id_producto);
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
    router.push(`/tienda?buscar=${encodeURIComponent(texto)}`);
    setMostrarResultados(false);
  };

  return (
    <div className="bg-white shadow-sm py-3">
      <div className="relative max-w-screen-xl mx-auto px-4 grid grid-cols-3 items-center gap-4">
        
        <div className="relative col-span-1" ref={contenedorRef}>
          {/* Icono buscador */}
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" aria-hidden="true" />

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onFocus={() => setMostrarResultados(resultados.length > 0)}
            placeholder="Buscar productos..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Resultados */}
        {mostrarResultados && resultados.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl w-full max-h-96 overflow-y-auto" ref={contenedorRef}>
            <div className="pb-1">
              {resultados.map((prod) => (
                <div
                  key={prod.id_producto}
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => router.push(`/p/${prod.nombreSlug}`)}
                >
                  {/* Imagen */}
                  <div className="w-12 h-12 flex-shrink-0">
                    <img
                      src={prod.urlImagen1 || "/placeholder.png"}
                      alt={prod.nombre}
                      className="w-full h-full object-contain rounded border"
                    />
                  </div>

                  {/* Detalles */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                      {prod.nombre}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      (SKU: {prod.codigo})
                    </p>
                  </div>

                  {/* Precio */}
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

        {/* Logo */}
        <a
          href="/"
          className="cursor-pointer flex flex-col items-center justify-center h-14 w-full text-center"
          aria-label="Ir al inicio de Prasen"
          title="Inicio Prasen"
        >
          <img src={"/logo/prasen.png"} alt="Logo" className="h-full max-h-12 w-auto object-contain"/>
        </a>

        {/* Íconos */}
        <div className="flex justify-end items-center gap-5 text-gray-600 text-xl">
          {/* Usuario */}
          <button
            title="Usuario"
            aria-label="Ir a la cuenta de usuario"
            className="hover:text-indigo-600 transition"
          >
            <User className="w-6 h-6" aria-hidden="true" />
          </button>

          {/* Administrar */}
          <a href="/Administrador">
            <Settings className="w-6 h-6" aria-hidden="true" />
            <span className="sr-only">Ir al panel de administrador</span>
          </a>

          {/* Favoritos */}
          {/* <button
            title="Favoritos"
            aria-label="Ver lista de deseos"
            className="hover:text-red-500 transition"
          >
            <Heart className="w-6 h-6" aria-hidden="true" />
          </button> */}

          {/* Carrito */}
          <div
            role="link"
            title="Carrito de compras"
            aria-label="Ver carrito de compras"
            className="flex items-center gap-1 hover:text-indigo-600 transition cursor-pointer"
          >
            <ShoppingCart className="w-6 h-6" aria-hidden="true" />
            <span className="text-sm text-black font-semibold">S/ 0.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}
