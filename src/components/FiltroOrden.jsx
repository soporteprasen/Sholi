// Dentro del render de page.jsx (por ejemplo arriba del grid)

"use client";
import { useState } from "react";

export function FiltroOrdenamiento({ onChange }) {
  const [orden, setOrden] = useState("nombre-asc");

  const handleChange = (e) => {
    setOrden(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="mb-6 flex justify-end">
      <select
        value={orden}
        onChange={handleChange}
        className="border p-2 rounded-md text-sm"
      >
        <option value="nombre-asc">Nombre A-Z</option>
        <option value="nombre-desc">Nombre Z-A</option>
        <option value="precio-asc">Precio menor a mayor</option>
        <option value="precio-desc">Precio mayor a menor</option>
        <option value="descuento-asc">Descuento menor a mayor</option>
        <option value="descuento-desc">Descuento mayor a menor</option>
      </select>
    </div>
  );
}
