"use client";

import { useEffect, useState } from "react";
import { editarMensajeWsp, obtenerMensajesWsp } from "@/lib/api";
import BotonWsp from "@/components/BotonWsp";

export default function AdministrarWsp() {
  const [MensajeProducto, setMensajeProducto] = useState("");
  const [MensajeGlobal, setMensajeGlobal] = useState(""); // Opcional
  const [Numero, setNumero] = useState("");
  const [mensajeStatus, setMensajeStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMensajes = async () => {
      try {
        const data = await obtenerMensajesWsp();
        console.log("Datos obtenidos:", data);
        if (data) {
          setMensajeProducto(data.mensajeProducto );
          setMensajeGlobal(data.mensajeGlobal);
          setNumero(data.numero );
        }
      } catch (error) {
        alert("Error al obtener mensajes:", error);
      }
    };

    fetchMensajes();
  });

  const PrevisualizacionP = `${MensajeProducto}\n\n*Código: XXXXXXXXXX Producto: XXXXXXXX Link: https://sholi.com/p/XXXXXXXXXX*`
  const PrevisualizacionG = `${MensajeGlobal}\n\n*Código: Producto: Link: *`

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeStatus("");
    setLoading(true);

    try {
      await editarMensajeWsp(
        MensajeProducto || null,
        MensajeGlobal || null
      );
      setMensajeStatus("¡Mensaje actualizado con éxito!");
      setMensajeProducto("");
      setMensajeGlobal("");
    } catch (error) {
      setMensajeStatus("Error al actualizar el mensaje.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4">Actualizar Informacion relacionada a Whatsap</h2>

        {/* Numero de whatssap */}
        <div className="mb-4">
          <label
            htmlFor="Numero"
            className="block text-gray-700 font-semibold mb-2"
          >
            Número de WhatsApp:
          </label>
          <input
            id="Numero"
            type="text"
            value={Numero}
            onChange={(e) => setNumero(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese el número de WhatsApp"
          />
        </div>

        {/* Campo opcional: MensajeProducto */}
        <label
            htmlFor="Numero"
            className="block text-gray-700 font-semibold mb-2"
          >
            Enlaces directos a WhatsApp desde un producto:
          </label>
        <BotonWsp tipo="tienda"/><BotonWsp tipo="producto"/>

        <label
            htmlFor="Numero"
            className="block text-gray-700 font-semibold mb-2"
          >
            Mensaje:
        </label>
        <textarea
          id="MensajeProducto"
          value={MensajeProducto}
          onChange={(e) => setMensajeGlobal(e.target.value)}
          rows="4"
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label
            htmlFor="Numero"
            className="block text-gray-700 font-semibold mb-2"
          >
            Previsualizacion del texto a enviar:
        </label>
        <textarea
          id="MensajeProducto"
          value={PrevisualizacionP}
          onChange={(e) => setMensajeGlobal(e.target.value)}
          rows="4"
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Campo opcional: MensajeGlobal */}
        <div className="mb-4">
          <label
            htmlFor="MensajeGlobal"
            className="block text-gray-700 font-semibold mb-2"
          >
            Logo de Whatsap flotante:
          </label>
          <textarea
            id="MensajeGlobal"
            value={MensajeGlobal}
            onChange={(e) => setMensajeGlobal(e.target.value)}
            rows="4"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`${
            loading ? "bg-green-300" : "bg-green-500 hover:bg-green-600"
          } text-white font-bold py-2 px-6 rounded-md transition-colors`}
        >
          {loading ? "Actualizando..." : "Actualizar Mensaje"}
        </button>

        {mensajeStatus && (
          <p className="mt-4 text-center font-semibold">
            {mensajeStatus}
          </p>
        )}
      </form>
    </>
  );
}
