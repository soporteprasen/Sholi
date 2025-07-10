"use client";
import React, { useState } from "react";  

import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import SidebarAdmin from "@/components/Administrador/Sidebar-Admin";

import { ShieldCheck } from "lucide-react";

import AdministrarProductos from "@/components/Administrador/Productos/Administrar-productos";
import AdministrarCategorias from "@/components/Administrador/Categorias/Administrar-categorias";
import AdministrarUnidades from "@/components/Administrador/Unidades/Administrar-unidades";
import AdministrarMarcas from "@/components/Administrador/Marcas/Administrar-marcas";
import AdministrarWsp from "@/components/Administrador/wsp/AdministrarWsp";

export default function AdminPage() {
  const [opcionSeleccionada, setOpcionSeleccionada] = useState("inicio");

  return (
    <SidebarProvider>
      <ContenidoAdministrador
        opcionSeleccionada={opcionSeleccionada}
        setOpcionSeleccionada={setOpcionSeleccionada}
      />
    </SidebarProvider>
  );
}

// ✅ Componentes hijos separados para usar `useSidebar()` dentro del Provider
function ContenidoAdministrador({ opcionSeleccionada, setOpcionSeleccionada }) {

  const renderContenido = () => {
    switch (opcionSeleccionada) {
      case "administrar-productos":
        return <AdministrarProductos />;
      case "administrar-categorias":
        return <AdministrarCategorias />;
      case "administrar-marcas":
        return <AdministrarMarcas />;
      case "administrar-unidades":
        return <AdministrarUnidades />;
      case "administrar-wsp":
        return <AdministrarWsp />;
      default:
        return (
          <div className="h-full w-full max-w-3xl mx-auto flex flex-col items-center justify-center text-center px-4 py-10 bg-gray-50 rounded-lg shadow-inner">
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
      <SidebarAdmin onSelectOption={setOpcionSeleccionada}/>
      <main className="flex-1 w-full">
        <div className="md:hidden">
          <SidebarTrigger />
        </div>
        {renderContenido()}
      </main>
    </div>
  );
}
