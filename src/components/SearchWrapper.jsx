"use client";
import { useSearchParams } from "next/navigation";

export default function SearchWrapper({ setTextoBusqueda }) {
  const searchParams = useSearchParams();
  const textoBusqueda = searchParams.get("buscar") || "";

  // Puedes pasarlo a un state superior o usarlo directamente
  setTextoBusqueda(textoBusqueda);

  return null; // No renderiza nada visible
}
