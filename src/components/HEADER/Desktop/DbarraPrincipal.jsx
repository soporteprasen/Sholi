import { User, ShoppingCart} from "lucide-react"; 
import Buscador from "./BuscadorDesktop";
import Image from "next/image";
import Link from "next/link";

export default function DbarraPrincipal() {
  return (
    <div className="bg-white shadow-sm py-3">
      <div className="relative max-w-screen-xl mx-auto px-4 grid grid-cols-3 items-center gap-4">
        {/* Buscador*/}
        <Buscador/>

        {/* Logo */}
        <Link
          href="/"
          className="cursor-pointer flex flex-col items-center justify-center h-14 w-full text-center"
          aria-label="Ir al inicio de Prasen"
          title="Inicio Prasen"
        >
          <Image
            src={"/logo/logo-principal-prasen.webp"}
            alt="Prasen - Compra online"
            width={118}
            height={48}
            className="h-full max-h-12 w-auto object-contain"
          />
        </Link>

        {/* Íconos */}
        <div className="flex justify-end items-center gap-5 text-gray-600 text-xl">
          {/* Administrar */}
          <a href="/Administrador">
            <User className="w-6 h-6" aria-hidden="true" />
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
          {/* <div
            role="link"
            title="Carrito de compras"
            aria-label="Ver carrito de compras"
            className="flex items-center gap-1 hover:text-indigo-600 transition cursor-pointer"
          >
            <ShoppingCart className="w-6 h-6" aria-hidden="true" />
            <span className="text-sm text-black font-semibold">S/ 0.00</span>
          </div> */}
        </div>
      </div>
    </div>
  );
}
