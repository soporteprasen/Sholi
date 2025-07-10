"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // para redireccionar
import { User, Lock } from "lucide-react";
import { Login } from "@/lib/api";

export default function LoginAdminPage() {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await Login(usuario, clave);

      if (data.valorConsulta === "1") {
        alert("¡Inicio de sesión exitoso!");
        router.push("/Administrador");
      } else {
        alert("Credenciales incorrectas. Inténtalo de nuevo.");
      }
    } catch (error) {
      alert("Error de conexión. Inténtalo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Panel de Administración
        </h1>
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Usuario */}
          <div>
            <label htmlFor="usuario" className="block text-gray-700 mb-2 font-medium">
              Usuario
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-3">
              <User className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                placeholder="admin"
                className="w-full pl-3 outline-none border-none text-gray-700"
              />
            </div>
          </div>

          {/* Clave */}
          <div>
            <label htmlFor="clave" className="block text-gray-700 mb-2 font-medium">
              Contraseña
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-3">
              <Lock className="w-5 h-5 text-gray-400" />
              <input
                type="password"
                id="clave"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                required
                placeholder="********"
                className="w-full pl-3 outline-none border-none text-gray-700"
              />
            </div>
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
            } text-white py-3 rounded-md font-semibold text-lg transition duration-300`}
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}
