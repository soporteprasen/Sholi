"use client";

import { useEffect, useState } from "react";
import { obtenerCategorias, ObtenerImagenProducto } from "@/lib/api";

export default function MmProductos() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const data = await obtenerCategorias();
        const categoriasValidas = data.filter((m) => m.valorConsulta === "1");

        const categoriasConLogo = await Promise.all(
          categoriasValidas.map(async (categoria) => {
            let logo = "/not-found.webp";

            if (categoria.imagen_categoria || categoria.imagen_categoria.trim() == "") {
              try {
                const blob = await ObtenerImagenProducto(categoria.imagen_categoria);
                logo = URL.createObjectURL(blob);
              } catch {
                console.error("Error al cargar imagen:", categoria.nombre);
              }
            }

            return {
              nombre: categoria.nombre,
              slug_categoria: categoria.slug_categoria,
              logo,
            };
          })
        );

        setCategorias(categoriasConLogo);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };

    cargarCategorias();
  }, []);

  return (
    <div className="p-6 grid grid-cols-5 gap-4 w-[900px] max-w-[95vw] mx-auto">
      {categorias.map((categoria, index) => (
        <a
          href={`/c/${categoria.slug_categoria}`}
          key={index}
          className="flex flex-col items-center text-center hover:opacity-90 transition"
        >
          <img
            src={categoria.logo}
            alt={`Logo de la categoría ${categoria.nombre}`}
            className="h-10 object-contain mb-1"
            loading="lazy"
          />
          <span className="text-sm text-gray-700" itemProp="brand">
            {categoria.nombre}
          </span>
        </a>
      ))}
    </div>
  );
}
