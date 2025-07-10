"use client";

import { useEffect, useState } from "react";
import { obtenerMarcas, ObtenerImagenProducto } from "@/lib/api";

export default function MmMarcas() {
  const [marcas, setMarcas] = useState([]);

  useEffect(() => {
    const cargarMarcas = async () => {
      try {
        const data = await obtenerMarcas();
        const marcasValidas = data.filter((m) => m.valorConsulta === "1");

        const marcasConLogo = await Promise.all(
          marcasValidas.map(async (marca) => {
            let logo = "/not-found.webp";

            if (marca.imagen_marca || marca.imagen_marca.trim() == "") {
              try {
                const blob = await ObtenerImagenProducto(marca.imagen_marca);
                logo = URL.createObjectURL(blob);
              } catch {
                console.error("Error cargando imagen:", marca.nombre);
              }
            }

            return {
              nombre: marca.nombre,
              slug_marca: marca.slug_marca, // 👈 asegúrate de tener este campo en tu API
              logo,
            };
          })
        );

        setMarcas(marcasConLogo);
      } catch (error) {
        console.error("Error al cargar marcas:", error);
      }
    };

    cargarMarcas();
  }, []);

  return (
    <div className="p-6 grid grid-cols-5 gap-4 w-[900px] max-w-[95vw] mx-auto">
      {marcas.map((marca, index) => (
        <a
          key={index}
          href={`/tienda/${marca.slug_marca}`}
          className="flex flex-col items-center text-center hover:opacity-90 transition"
        >
          <img
            src={marca.logo}
            alt={`Logo de la marca ${marca.nombre}`}
            className="h-10 object-contain mb-1"
            loading="lazy"
          />
          <span className="text-sm text-gray-700" itemProp="brand">
            {marca.nombre}
          </span>
        </a>
      ))}
    </div>
  );
}
