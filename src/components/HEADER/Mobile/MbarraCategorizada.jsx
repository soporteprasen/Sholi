import { X} from "lucide-react"; // 👈 Nuevos íconos Lucide
import Link from "next/link";

import Productos from './CategoriaDesplegable/Productos';

export default function MbarraCategorizada({ abierto, cerrar }) {
  return (
    <>
      {/* Overlay oscuro, más claro para mejor visibilidad */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 transition-opacity duration-300 z-40 ${abierto ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={cerrar}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 right-0 bottom-[45px] bg-white shadow-lg z-50 transform transition-transform duration-300 ${abierto ? 'translate-x-0' : '-translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label="menu-titulo"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 id="menu-titulo" className="text-lg font-semibold text-[#112B5E]">
            Menu
          </h2>
          <button
            onClick={cerrar}
            aria-label="Cerrar menú"
            className="text-[#112B5E] hover:text-red-600 transition"
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>

        <ul className="text-sm text-gray-800 font-medium overflow-y-auto pb-24">
          <li>
            <Productos />
          </li>
          <li className="px-4 py-3 border-b">
            <Link
              href="/Contacto"
              className="px-2 hover:text-indigo-600 transition inline-flex h-full items-center"
            >
              Contacto
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
