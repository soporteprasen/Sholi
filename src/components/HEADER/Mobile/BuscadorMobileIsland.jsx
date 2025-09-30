"use client";
import dynamic from "next/dynamic";
import useIdle from "@/hooks/useIdle";

const BuscadorMobil = dynamic(() => import("./BuscadorMobile"), {
  ssr: false,
  loading: () => null,
});

export default function BuscadorMobileIsland() {
  const ready = useIdle(800);
  if (!ready) {
    return (
      <div className="relative pt-2.5">
        <div className="flex items-center bg-[#7c141b] px-3 py-2">
          <input
            type="text"
            placeholder="Buscar productos ..."
            className="bg-transparent flex-grow text-white text-sm placeholder-white focus:outline-none"
            aria-label="Buscar productos"
          />
          <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 text-white">
            <path d="M10 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm11 17-5.2-5.2"
                stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    );
  }
  return <BuscadorMobil />;
}
