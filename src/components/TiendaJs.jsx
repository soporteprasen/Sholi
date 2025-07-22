"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductoCard from "./ProductosGrid";
import ProductoSkeleton from "./ProductoSkeleton";
import { createRoot } from "react-dom/client";
import {
  obtenerProductosFiltrados,
  obtenerCoincidenciasBuscador,
} from "@/lib/api";

export default function TiendaJs({
  productosIniciales = [],
  yaHayProductos = false,
  id_categoria = null,
  id_marca = null,
}) {
  const searchParams = useSearchParams();
  const textoBusqueda = searchParams.get("buscar")?.trim() || "";

  const [productos, setProductos] = useState(
    yaHayProductos ? productosIniciales : []
  );
  const [pagina, setPagina] = useState(yaHayProductos ? 1 : 0);
  const [cargando, setCargando] = useState(false);
  const [hayMas, setHayMas] = useState(true);
  const [orden, setOrden] = useState("nombre-asc");

  const cantidadPorPagina = 8;
  const [campo, direccion] = orden.split("-");

  // Incrustar el <select> en #zona-combobox
  useEffect(() => {
    const zona = document.getElementById("zona-combobox");
    if (!zona) return;

    const selectExistente = zona.querySelector("select");
    if (selectExistente && zona.contains(selectExistente)) {
      zona.removeChild(selectExistente);
    }

    const select = document.createElement("select");
    select.className = "border p-2 rounded-md text-sm";

    const opciones = [
      { value: "nombre-asc", label: "Nombre A-Z" },
      { value: "nombre-desc", label: "Nombre Z-A" },
      { value: "precio-asc", label: "Precio menor a mayor" },
      { value: "precio-desc", label: "Precio mayor a menor" },
      { value: "descuento-asc", label: "Descuento menor a mayor" },
      { value: "descuento-desc", label: "Descuento mayor a menor" },
    ];

    opciones.forEach((opt) => {
      const option = document.createElement("option");
      option.value = opt.value;
      option.textContent = opt.label;
      if (opt.value === orden) option.selected = true;
      select.appendChild(option);
    });

    select.addEventListener("change", (e) => {
      setOrden(e.target.value);
    });

    zona.appendChild(select);
  }, [orden]);

  useEffect(() => {
    if (textoBusqueda && productos.length === 0) {
      cargarMasProductos(true);
    }
  }, [textoBusqueda]);

  // Reactualizar productos cuando cambia el orden
  useEffect(() => {
    const reiniciarProductos = async () => {
      setCargando(true);
      try {
        const nuevos = textoBusqueda
          ? await obtenerCoincidenciasBuscador(
              textoBusqueda,
              0,
              cantidadPorPagina,
              campo,
              direccion
            )
          : await obtenerProductosFiltrados(
              id_marca,
              id_categoria,
              campo,
              direccion,
              0,
              cantidadPorPagina
            );

        const productosConUrl = await Promise.all(
          nuevos.map(async (producto) => {
            const urlValida = producto.urlImagen1?.trim();
            const url1 = urlValida
              ? process.env.NEXT_PUBLIC_SIGNALR_URL + urlValida
              : "/not-found.webp";
            return { ...producto, urlImagen1: url1 };
          })
        );

        const grid = document.getElementById("contenedor-grid");
        if (grid) {
          grid.innerHTML = "";
          productosConUrl.forEach((producto) => {
            const div = document.createElement("div");
            grid.appendChild(div);
            createRoot(div).render(<ProductoCard producto={producto} />);
          });
        }

        setProductos(productosConUrl);
        setPagina(1);
        setHayMas(productosConUrl.length === cantidadPorPagina);
      } catch (error) {
        console.error("Error al reiniciar productos:", error);
        setProductos([]);
        setHayMas(false);
      } finally {
        setCargando(false);
      }
    };

    reiniciarProductos();
  }, [orden]);
  
  // Scroll infinito
  useEffect(() => {
    let timeoutId;
    const handleScroll = () => {
      if (cargando || !hayMas) return;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const scrollY = window.scrollY + window.innerHeight;
        const bottom = document.documentElement.scrollHeight - 300;
        if (scrollY >= bottom) cargarMasProductos(false);
      }, 150);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [cargando, hayMas, productos]);

  const renderizarSkeletons = (cantidad) => {
    const grid = document.getElementById("contenedor-grid");
    if (!grid) return [];

    const placeholders = [];

    for (let i = 0; i < cantidad; i++) {
      const div = document.createElement("div");
      div.classList.add("skeleton-placeholder");
      grid.appendChild(div);
      createRoot(div).render(<ProductoSkeleton />);
      placeholders.push(div);
    }

    return placeholders;
  };


  // Cargar más productos
  const cargarMasProductos = async (esPrimerLlamado) => {
    if (!hayMas) return;
    setCargando(true);

    // Renderizar placeholders
    const skeletons = renderizarSkeletons(cantidadPorPagina);

    try {
      const desde = esPrimerLlamado ? 0 : pagina * cantidadPorPagina;
      let nuevos = [];

      if (textoBusqueda) {
        nuevos = await obtenerCoincidenciasBuscador(
          textoBusqueda,
          desde,
          cantidadPorPagina,
          campo,
          direccion
        );
      } else {
        nuevos = await obtenerProductosFiltrados(
          id_marca,
          id_categoria,
          campo,
          direccion,
          desde,
          cantidadPorPagina
        );
      }

      const productosConUrl = await Promise.all(
        nuevos.map(async (producto) => {
          const urlValida = producto.urlImagen1?.trim();
          const url1 = urlValida
            ? process.env.NEXT_PUBLIC_SIGNALR_URL + urlValida
            : "/not-found.webp";
          return { ...producto, urlImagen1: url1 };
        })
      );

      // Eliminar skeletons
      skeletons.forEach((div) => div.remove());

      const grid = document.getElementById("contenedor-grid");
      if (grid) {
        productosConUrl.forEach((producto) => {
          const div = document.createElement("div");
          grid.appendChild(div);
          createRoot(div).render(<ProductoCard producto={producto} />);
        });
      }

      if (productosConUrl.length < cantidadPorPagina) setHayMas(false);
      setProductos((prev) =>
        esPrimerLlamado ? productosConUrl : [...prev, ...productosConUrl]
      );
      setPagina((prev) => (esPrimerLlamado ? 1 : prev + 1));
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setHayMas(false);
    } finally {
      setCargando(false);
    }
  };


  return (
    <>
      {!hayMas && (
        <div className="col-span-full text-center text-gray-500 mt-8 text-sm">
        </div>
      )}
    </>
  );
}
