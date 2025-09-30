"use client";
import dynamic from "next/dynamic";
import useIdle from "@/hooks/useIdle";

const Buscador = dynamic(() => import("./BuscadorDesktop"), {
  ssr: false,
  loading: () => null,
});

export default function BuscadorDesktopIsland() {
  const ready = useIdle(800);

  return (
    <div className="col-span-1"> 
      {ready ? (
        <Buscador />
      ) : (
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm"
            aria-label="Buscar productos"
            disabled
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M10 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm11 17-5.2-5.2"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
