import { X } from "lucide-react";
import Link from "next/link";
import Productos from "./CategoriaDesplegable/Productos";
import Marcas from "./CategoriaDesplegable/Marcas";

export default function MbarraCategorizada() {
  return (
    <>
      {/* Menú lateral */}
      <div
        id="menu-lateral"
        className="fixed top-0 left-0 right-0 bottom-0 bg-white shadow-lg z-50 transform transition-transform duration-300 -translate-x-full flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Menú lateral"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-[#7c141b]">Menú</h2>
          <button
            id="boton-cerrar-menu"
            aria-label="Cerrar menú"
            title="Cerrar menú"
            className="text-[#112B5E] hover:text-red-600 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto text-sm text-gray-800 font-medium pb-24">
          <li><Productos /></li>
          <li><Marcas /></li>
          <li className="px-4 py-3 border-b">
            <Link
              href="/nosotros"
              className="px-2 hover:text-indigo-600 transition inline-flex items-center cerrar-menu"
              aria-label="Ir a la página de nosotros"
              title="Nosotros"  
            >
              Nosotros
            </Link>
          </li>
          <li className="px-4 py-3 border-b">
            <Link
              href="/contacto"
              className="px-2 hover:text-indigo-600 transition inline-flex items-center cerrar-menu"
              aria-label="Ir a la página de contacto"
              title="Contacto"
            >
              Contacto
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
