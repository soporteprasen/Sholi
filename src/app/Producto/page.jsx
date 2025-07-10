"use client";

import { useState, useEffect } from "react";
import Contenido from "@/components/Contenido";
import { registrarProducto, obtenerMarcas, obtenerCategorias } from "@/lib/api";

export default function FormularioProducto() {
  const [form, setForm] = useState({
    codigo: "",
    nombre: "",
    descripcion: "",
    precio: "",
    descuento: "",
    stock: "",
    urlImagen1: "",
    urlImagen2: "",
    marca: "",
    categoria: "",
  });

  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    // Cargar marcas y categorías al iniciar
    obtenerMarcas().then(setMarcas).catch(() => alert("Error al cargar marcas"));
    obtenerCategorias().then(setCategorias).catch(() => alert("Error al cargar categorías"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultado = await registrarProducto(form);
      alert("Producto registrado correctamente");
      setForm({
        codigo: "",
        nombre: "",
        descripcion: "",
        precio: "",
        descuento: "",
        stock: "",
        urlImagen1: "",
        urlImagen2: "",
        marca: "",
        categoria: "",
      });
    } catch (error) {
      alert("Error al registrar producto");
    }
  };

  return (
    <Contenido>
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto p-4 space-y-4 bg-white rounded shadow"
      >
        <h2 className="text-2xl font-bold">Registrar Producto</h2>

        {[
          ["codigo", "Código"],
          ["nombre", "Nombre"],
          ["descripcion", "Descripción"],
          ["precio", "Precio"],
          ["descuento", "Descuento"],
          ["stock", "Stock"],
          ["urlImagen1", "URL Imagen 1"],
          ["urlImagen2", "URL Imagen 2"],
        ].map(([name, label]) => (
          <div key={name} className="flex flex-col">
            <label htmlFor={name} className="font-medium">{label}</label>
            <input
              type="text"
              id={name}
              name={name}
              value={form[name]}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
          </div>
        ))}

        {/* Combo Categoría */}
        <div className="flex flex-col">
          <label htmlFor="categoria" className="font-medium">Categoría</label>
          <select
            id="categoria"
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id_categoria} value={cat.id_categoria}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Combo Marca */}
        <div className="flex flex-col">
          <label htmlFor="marca" className="font-medium">Marca</label>
          <select
            id="marca"
            name="marca"
            value={form.marca}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          >
            <option value="">Selecciona una marca</option>
            {marcas.map((marca) => (
              <option key={marca.id_marcas} value={marca.id_marcas}>
                {marca.nombre}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Registrar
        </button>
      </form>
    </Contenido>
  );
}
