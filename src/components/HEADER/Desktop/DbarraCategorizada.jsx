import Link from "next/link";
import MmProductos from "./Megamenus/MmProductos";
import MmMarcas from "./Megamenus/MmMarcas";

export default function DbarraCategorizada() {
  return (
    <nav className="bg-white shadow-sm border-t border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4">
        <ul className="flex justify-center gap-6 text-sm font-medium text-gray-700 h-12 items-center relative">
          {/* Productos */}
          <li className="relative group h-full flex items-center">
            <Link
              href="/categorias"
              className="inline-flex items-center h-full px-4 hover:text-indigo-600 transition"
            >
              Productos
            </Link>

            <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-[1px] z-50 opacity-0 scale-95 pointer-events-none transition-all duration-200 ease-out group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto bg-white border border-gray-200 shadow-xl rounded-md w-[1000px] max-w-[95vw]">
              <MmProductos />
            </div>
          </li>

          {/* Marcas */}
          <li className="relative group h-full flex items-center">
            <span className="inline-flex items-center h-full px-4 hover:text-indigo-600 transition cursor-pointer">
              Marcas
            </span>

            <div className="absolute top-full left-1/2 -translate-x-1/2 z-50 opacity-0 scale-95 pointer-events-none transition-all duration-200 ease-out group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto bg-white border border-gray-200 shadow-xl rounded-md w-[1000px] max-w-[95vw]">
              <MmMarcas />
            </div>
          </li>

          {/* Contacto */}
          <li className="h-full flex items-center">
            <Link
              href="/Contacto"
              className="inline-flex items-center h-full px-4 hover:text-indigo-600 transition"
            >
              Contacto
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
