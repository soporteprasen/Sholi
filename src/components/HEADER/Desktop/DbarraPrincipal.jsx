import Image from "next/image";
import Link from "next/link";
import BuscadorDesktopIsland from "./BuscadorDesktopIsland";

export default function DbarraPrincipal() {
  return (
    <div className="bg-white shadow-sm py-3">
      <div className="relative max-w-screen-xl mx-auto px-4 grid grid-cols-3 items-center gap-4">
        {/* Buscador diferido */}
        <BuscadorDesktopIsland />

        {/* Logo */}
        <Link
          href="/"
          className="cursor-pointer flex flex-col items-center justify-center h-14 w-full text-center"
          aria-label="Ir al inicio de Prasen"
          title="Inicio Prasen"
        >
          <Image
            src="/logo/logo-principal-prasen.webp"
            alt="Prasen - Compra online"
            width={119}
            height={48}
            className="object-contain"
            sizes="119px"
          />
        </Link>

        {/* Icono admin inline (evita lucide-react aquí) */}
        {/* <div className="flex justify-end items-center gap-5 text-gray-600 text-xl">
          <a href="/Administrador" aria-label="Ir al panel de administrador">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-settings-icon lucide-settings"
            >
              <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </a>
        </div> */}
      </div>
    </div>
  );
}
