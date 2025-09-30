"use client";

import { useEffect, useState } from "react";
import { editarMensajeWsp, obtenerMensajesWsp } from "@/lib/api";
import BotonWsp from "@/components/BotonWsp";

export default function AdministrarWsp() {
  const guardarEstadoAdministracion = () => {
    localStorage.setItem("EstadoAdministracionCategoria", 0);
    localStorage.setItem("EstadoAdministracionProducto", 0);
    localStorage.setItem("EstadoAdministracionMarca", 0);
    localStorage.setItem("EstadoAdministracionUnidad", 0);
  }

  useEffect(() => {
    guardarEstadoAdministracion();
  }, []);

  const [MensajeProducto, setMensajeProducto] = useState("");
  const [MensajeGlobal, setMensajeGlobal] = useState("");
  const [Numero, setNumero] = useState("");
  const [mensajeStatus, setMensajeStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [valoresOriginales, setValoresOriginales] = useState({
    mensajeProducto: "",
    mensajeGlobal: "",
    numero: "",
  });

  useEffect(() => {
    const fetchMensajes = async () => {
      try {
        const data = await obtenerMensajesWsp();
        if (data) {
          setMensajeProducto(data.mensajeProducto);
          setMensajeGlobal(data.mensajeGlobal);
          setNumero(data.numero);
          setValoresOriginales({
          mensajeProducto: data.mensajeProducto,
          mensajeGlobal: data.mensajeGlobal,
          numero: data.numero,
        });
        }
      } catch (error) {
        alert("Error al obtener mensajes:", error);
      }
    };

    fetchMensajes();
  }, []);

  const restaurarMensajeProducto = () => setMensajeProducto(valoresOriginales.mensajeProducto);
  const restaurarMensajeGlobal = () => setMensajeGlobal(valoresOriginales.mensajeGlobal);
  const restaurarNumero = () => setNumero(valoresOriginales.numero);

  const restaurarTodo = () => {
    setMensajeProducto(valoresOriginales.mensajeProducto);
    setMensajeGlobal(valoresOriginales.mensajeGlobal);
    setNumero(valoresOriginales.numero);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeStatus("");
    setLoading(true);

    try {
      const cambio = await editarMensajeWsp(
        MensajeProducto || null,
        MensajeGlobal || null,
        Numero || null,
      );

      if (cambio.valorConsulta == 1) {
        setMensajeStatus(cambio.mensajeConsulta);
      } else {
        setMensajeStatus(cambio.mensajeConsulta);
      }
    } catch (error) {
      setMensajeStatus("Error al actualizar el mensaje.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[95%] max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-6 border border-gray-200"
    >
      <h2 className="text-3xl font-extrabold text-center mb-2">
        Gestión de WhatsApp
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Aquí puedes actualizar el número, mensajes base y flotantes de contacto por WhatsApp.
      </p>

      {/* Número de WhatsApp */}
      <div className="space-y-2">
        <label htmlFor="Numero" className="text-lg font-medium text-gray-700 flex justify-between">
          Número de WhatsApp:
          <button
            type="button"
            onClick={restaurarNumero}
            className="text-sm text-blue-600 underline hover:text-blue-800"
          >
            Restaurar número original
          </button>
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

      {/* Botones de ejemplo */}
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-700">
          Enlaces directos a WhatsApp desde un producto:
        </label>
        <div className="flex gap-4 items-center">
          <div className="flex-1 text-center">
            <BotonWsp tipo="tienda" />
          </div>
          <div className="flex-1 text-center">
            <BotonWsp tipo="producto" />
          </div>
        </div>
      </div>

      {/* Mensaje base producto */}
      <div className="space-y-2">
        <label htmlFor="MensajeProducto" className="text-lg font-medium text-gray-700 flex justify-between">
          Mensaje base para productos:
          <button
            type="button"
            onClick={restaurarMensajeProducto}
            className="text-sm text-blue-600 underline hover:text-blue-800"
          >
            Restaurar original
          </button>
        </label>
        <textarea
          id="MensajeProducto"
          value={MensajeProducto}
          onChange={(e) => setMensajeProducto(e.target.value)}
          rows="4"
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Previsualización del mensaje */}
      <div className="space-y-2">
        <label htmlFor="PreviewProducto" className="text-lg font-medium text-gray-700">
          Previsualización del mensaje con código y link:
        </label>
        <textarea
          id="PreviewProducto"
          value={`${MensajeProducto}\n\n*Código: XXXXXXXXXX Producto: XXXXXXXX Link: https://sholi.com/producto/XXXXXXXXXX*`}
          disabled
          rows="4"
          className="w-full p-3 border rounded-md bg-gray-100 text-gray-800"
        />
      </div>

      {/* Mensaje flotante global */}
      <div className="space-y-2">
        <label htmlFor="MensajeGlobal" className="text-lg font-medium text-gray-700 flex justify-between">
          Mensaje del logo flotante:
          <button
            type="button"
            onClick={restaurarMensajeGlobal}
            className="text-sm text-blue-600 underline hover:text-blue-800"
          >
            Restaurar original
          </button>
        </label>
        <textarea
          id="MensajeGlobal"
          value={MensajeGlobal}
          onChange={(e) => setMensajeGlobal(e.target.value)}
          rows="4"
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Previsualización global */}
      <div className="space-y-2">
        <label htmlFor="PreviewGlobal" className="text-lg font-medium text-gray-700">
          Previsualización flotante:
        </label>
        <textarea
          id="PreviewGlobal"
          value={MensajeGlobal}
          disabled
          rows="4"
          className="w-full p-3 border rounded-md bg-gray-100 text-gray-800"
        />
      </div>

      {/* Botones de acción */}
      <div className="flex flex-wrap justify-between items-center gap-4 mt-6">
        <button
          type="submit"
          disabled={loading}
          className={`${loading
            ? "bg-green-300"
            : "bg-green-500 hover:bg-green-600"
            } text-white font-bold py-2 px-6 rounded-md transition-colors`}
        >
          {loading ? "Actualizando..." : "Actualizar Mensaje"}
        </button>

        <button
          type="button"
          onClick={restaurarTodo}
          className="text-sm text-blue-600 underline hover:text-blue-800"
        >
          Restaurar todo a valores originales
        </button>
      </div>

      {/* Estado final */}
      {mensajeStatus && (
        <p className="mt-6 text-center font-semibold text-green-600">{mensajeStatus}</p>
      )}
    </form>
  );
}
