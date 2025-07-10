"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, Settings, ShoppingCart, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import MbarraCategorizada from "./MbarraCategorizada";
import { obtenerCoincidenciasBuscador, ObtenerImagenProducto, RecorrerCarpetaImagenes } from "@/lib/api";

export default function MbarraPrincipal() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [texto, setTexto] = useState("");
  const [resultados, setResultados] = useState([]);
  const [imagenLogo, setImagenLogo] = useState("/not-found.webp");
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [tieneMas, setTieneMas] = useState(false);
  const router = useRouter();
  const contenedorRef = useRef();

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
      cargarLogo();
  }, []);

  useEffect(() => {
    if (menuAbierto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuAbierto]);

  useEffect(() => {
    const handleClickFuera = (e) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
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
        const res = await obtenerCoincidenciasBuscador(texto, 0, 7);
        const productosConBlobs = await Promise.all(
          res.map(async (producto) => {
            let url1 = "";
            try {
              if (producto.id_producto !== null) {
                const blob1 = await ObtenerImagenProducto(producto.urlImagen1);
                url1 = URL.createObjectURL(blob1);
              }
            } catch (e) {
              console.error("Error al cargar imagen", producto.nombre);
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
    <div className="bg-[#112B5E] text-white w-full px-4 pt-3 pb-4">
      {/* Encabezado superior */}
      <div className="flex items-center justify-between">
        {/* Menú */}
        <button
          onClick={() => setMenuAbierto(true)}
          className="flex items-center gap-2 text-sm font-semibold"
          aria-label="Abrir menú"
        >
          <Menu className="w-6 h-6" />
          <span>MENÚ</span>
        </button>

        {/* Logo */}
        <a
          href="/"
          className="cursor-pointer flex flex-col items-center justify-center h-14 w-full text-center"
          aria-label="Ir al inicio de Prasen"
          title="Inicio Prasen"
        >
          <img src={imagenLogo} alt="Logo" className="h-full max-h-12 w-auto object-contain"/>
        </a>

        {/* Iconos */}
        <div className="flex items-center gap-4 text-lg">
          <a href="/Administrador">
            <Settings className="w-6 h-6" aria-label="Administrar" />
          </a>
          <div className="relative">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-lime-300 text-xs text-[#112B5E] font-bold rounded-full w-4 h-4 flex items-center justify-center">0</span>
          </div>
        </div>
      </div>

      {/* Buscador */}
      <div className="mt-3 relative" ref={contenedorRef}>
        <div className="flex items-center bg-[#1f3d7a] rounded px-3 py-2">
          <input
            type="text"
            placeholder="Buscar productos ..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onFocus={() => setMostrarResultados(resultados.length > 0)}
            className="bg-transparent flex-grow text-sm placeholder-white focus:outline-none"
            aria-label="Buscar"
          />
          <Search className="w-5 h-5 text-white" />
        </div>

        {/* Resultados móviles */}
        {mostrarResultados && resultados.length > 0 && (
          <div className="absolute z-50 left-0 right-0 mt-1 bg-white text-black rounded-xl shadow-xl border max-h-96 overflow-y-auto">
            {resultados.map((prod) => (
              <div
                key={prod.id_producto}
                onClick={() => router.push(`/p/${prod.nombreSlug}`)}
                className="flex items-center gap-3 p-3 border-b last:border-0 cursor-pointer hover:bg-gray-100"
              >
                <img
                  src={prod.urlImagen1 || "/placeholder.png"}
                  alt={prod.nombre}
                  className="w-12 h-12 object-contain border rounded"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{prod.nombre}</p>
                  <p className="text-xs text-gray-500">(SKU: {prod.codigo})</p>
                </div>
                <div className="text-sm font-bold text-green-600 whitespace-nowrap">
                  S/ {prod.precio?.toFixed(2)}
                </div>
              </div>
            ))}

            {tieneMas && (
              <div
                className="sticky bottom-0 bg-white border-t p-3 text-center text-indigo-600 text-sm cursor-pointer hover:underline"
                onClick={redirigirTienda}
              >
                VER TODOS LOS PRODUCTOS...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Menú lateral */}
      <MbarraCategorizada abierto={menuAbierto} cerrar={() => setMenuAbierto(false)} />
    </div>
  );
}
