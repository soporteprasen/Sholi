import Link from "next/link";
import Image from "next/image";
import BotonMenuLateral from "./BotonMenuLateral";
import MbarraCategorizada from "./MbarraCategorizada";
import BuscadorMobileIsland from "./BuscadorMobileIsland"; // ← buscador diferido (idle/focus)

export default function MbarraPrincipal() {
  return (
    <div className="bg-[#7c141b] text-white w-full px-4 pt-3 pb-4">
      {/* Encabezado superior */}
      <div className="flex items-center justify-between">
        {/* ✅ Tu botón con la lógica original */}
        <BotonMenuLateral />

        <Link
          href="/"
          className="cursor-pointer flex flex-col items-center justify-center h-14 w-full text-center"
          aria-label="Ir al inicio de Prasen"
          title="Inicio Prasen"
        >
          <Image
            src="/logo/logo-secundario-prasen.webp"
            alt="Prasen - Compra online"
            width={119}
            height={48}
            className="object-contain"
            sizes="119px"
            priority
          />
        </Link>

        {/* <div className="flex items-center gap-4 text-lg">
          <a
            href="/administrador"
            className="inline-flex items-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
            aria-label="Panel de administración"
            title="Panel de administración"
          >
            */}{/* SVG inline para evitar cargar lucide-react en el layout*/} {/*
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

      {/* 🔹 Buscador diferido (reduce JS inicial del layout) */}
      <BuscadorMobileIsland />

      {/* ✅ Tu menú lateral con su lógica intacta */}
      <MbarraCategorizada />
    </div>
  );
}
