"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function SearchWrapper({ setTextoBusqueda }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const texto = searchParams.get("buscar") || "";
    setTextoBusqueda(texto);
  }, [searchParams, setTextoBusqueda]);

  return null;
}
