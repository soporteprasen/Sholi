import Link from "next/link";
import Image from "next/image";
import { Settings, ShoppingCart } from "lucide-react";
import MbarraCategorizada from "./MbarraCategorizada";
import BuscadorMobil from "./BuscadorMobile";
import BotonMenuLateral from "./BotonMenuLateral";

export default function MbarraPrincipal() {
  return (
    <div className="bg-[#112B5E] text-white w-full px-4 pt-3 pb-4">
      {/* Encabezado superior */}
      <div className="flex items-center justify-between">
        <BotonMenuLateral />

        <Link
          href="/"
          className="cursor-pointer flex flex-col items-center justify-center h-14 w-full text-center"
          aria-label="Ir al inicio de Prasen"
          title="Inicio Prasen"
        >
          <Image
            src={"/logo/logo-principal-prasen.webp"}
            alt="Logo"
            width={118}
            height={48}
            priority={true}
            className="h-full max-h-12 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center gap-4 text-lg">
          <a href="/Administrador">
            <Settings className="w-6 h-6" />
          </a>
          {/* <div className="relative">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-lime-300 text-xs text-[#112B5E] font-bold rounded-full w-4 h-4 flex items-center justify-center">0</span>
          </div> */}
        </div>
      </div>

      {/* Buscador separado */}
      <BuscadorMobil />

      {/* Menú lateral */}
      <MbarraCategorizada />
    </div>
  );
}
