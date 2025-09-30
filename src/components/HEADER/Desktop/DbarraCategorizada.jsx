import Link from "next/link";
import MmProductos from "./Megamenus/MmProductos";
import MmMarcas from "./Megamenus/MmMarcas";

export default function DbarraCategorizada() {
  return (
    <nav className="bg-white shadow-sm border-t border-[#7c141b]">
      <div className="max-w-screen-xl mx-auto px-4">
        <ul className="flex justify-center gap-6 text-sm font-medium text-[#3C1D2A] h-12 items-center relative">
          {/* Productos */}
          <li className="relative group h-full flex items-center">
            <Link
              href="/categorias"
              className="inline-flex items-center h-full px-4 hover:text-[#7c141b] transition"
            >
              Productos
            </Link>

            <div className="fixed top-[128px] left-1/2 -translate-x-1/2 z-50 
                opacity-0 scale-95 pointer-events-none 
                transition-all duration-200 ease-out 
                group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto 
                bg-white border-b border-gray-200 shadow-xl rounded-b-md 
                w-[1000px] max-w-[95vw]">
              <MmProductos />
            </div>
          </li>

          {/* Marcas */}
          <li className="relative group h-full flex items-center">
            <span className="inline-flex items-center h-full px-4 hover:text-[#7c141b] transition cursor-pointer">
              Marcas
            </span>

            <div className="fixed top-[128px] left-1/2 -translate-x-1/2 z-50 
                opacity-0 scale-95 pointer-events-none 
                transition-all duration-200 ease-out 
                group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto 
                bg-white border-b border-gray-200 shadow-xl rounded-b-md 
                w-[1000px] max-w-[95vw]">
              <MmMarcas />
            </div> 
          </li>
          
          <li className="h-full flex items-center" >
            <Link 
              href="/nosotros"
              className="inline-flex items-center h-full px-4 hover:text-[#7c141b] transition"
            >
              Nosotros
            </Link>
          </li>

          {/* Contacto */}
          <li className="h-full flex items-center">
            <Link
              href="/contacto"
              className="inline-flex items-center h-full px-4 hover:text-[#7c141b] transition"
            >
              Contacto
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

