"use client";

import React, { useEffect, useState } from "react";

import {  SidebarProvider,  SidebarTrigger} from "@/components/ui/sidebar";

import SidebarAdmin from "@/components/Administrador/Sidebar-Admin";
import { items } from "@/components/Administrador/Sidebar-Admin"

import { LogOut, ShieldCheck } from "lucide-react";

import { logout, verificarSesion } from "@/lib/api";

import AdministrarProductos from "@/components/Administrador/Productos/Administrar-productos";
import AdministrarCategorias from "@/components/Administrador/Categorias/Administrar-categorias";
import AdministrarUnidades from "@/components/Administrador/Unidades/Administrar-unidades";
import AdministrarMarcas from "@/components/Administrador/Marcas/Administrar-marcas";
import AdministrarWsp from "@/components/Administrador/wsp/AdministrarWsp";

export default function AdminPage() {
  const [opcionSeleccionada, setOpcionSeleccionada] = useState("inicio");
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedIndex = localStorage.getItem("sidebar-selected-index");
      if (savedIndex && !isNaN(savedIndex)) {
        const index = parseInt(savedIndex, 10);
        setOpcionSeleccionada(items[index - 1]?.value || "inicio");
      }
    }
  }, []);

  const [reloadKey, setReloadKey] = useState(0)
  const handleSelect = (value) => {
    setOpcionSeleccionada(value)
    setReloadKey(prev => prev + 1) // fuerza nuevo render aunque sea mismo value
  }

  const [sesionVerificada, setSesionVerificada] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verificar = async () => {
      try {
        const sesion = await verificarSesion();
        if (!sesion) {
          window.location.href = "/Sesion";
          return;
        }
        setSesionVerificada(true);
      } catch (err) {
        console.error("Error verificando sesión:", err);
        setError("No se pudo verificar la sesión.");
        setTimeout(() => {
          window.location.href = "/Sesion";
        }, 1500);
      } finally {
        setCargando(false);
      }
    };
    verificar();
  }, []);

  if (cargando) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600 text-sm animate-pulse">
          Verificando sesión...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!sesionVerificada) return null;

  return (
    <SidebarProvider>
      <ContenidoAdministrador
        opcionSeleccionada={opcionSeleccionada}
        onSelectOption={handleSelect}
        reloadKey={reloadKey}           
      />
    </SidebarProvider>
  );
}

// Componentes hijos separados para usar `useSidebar()` dentro del Provider
function ContenidoAdministrador({ opcionSeleccionada, onSelectOption, reloadKey }) {
  const handleLogout = () => {
    logout()
      .then(() => {
        window.location.href = "/Sesion";
      })
      .catch((error) => {
        alert("Error al cerrar sesión:", error);
      });
  };

  const renderContenido = () => {
    switch (opcionSeleccionada) {
      case "administrar-productos":
        return <AdministrarProductos key={`productos-${reloadKey}`}/>;
      case "administrar-categorias":
        return <AdministrarCategorias key={`categorias-${reloadKey}`}/>;
      case "administrar-marcas":
        return <AdministrarMarcas key={`marcas-${reloadKey}`}/>;
      case "administrar-unidades":
        return <AdministrarUnidades key={`unidades-${reloadKey}`}/>;
      case "administrar-wsp":
        return <AdministrarWsp key={`wsp-${reloadKey}`}/>;
      default:
        return (
          <div className="h-full w-full max-w-3xl mx-auto flex flex-col items-center justify-center text-center px-4 py-10 bg-gray-50 shadow-inner">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
              <ShieldCheck className="w-8 h-8" aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">
              Bienvenido al panel de administración
            </h1>
            <p className="text-gray-600 text-sm max-w-md">
              Utiliza el menú lateral para gestionar productos, categorías, marcas y unidades. Todo lo que necesitas está a tu alcance.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <SidebarAdmin onSelectOption={onSelectOption} />
      <main className="flex-1 w-full">
        {/* Barra superior solo visible en móviles */}
        <div className="md:hidden flex justify-between items-center p-2">
          <SidebarTrigger />
          <button
            className="flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 rounded"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar sesión</span>
          </button>
        </div>

        {/* Botón logout para escritorio */}
        <div className="hidden md:flex justify-end p-2">
          <button
            className="flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 rounded"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar sesión</span>
          </button>
        </div>

        {renderContenido()}
      </main>
    </div>
  );
}
