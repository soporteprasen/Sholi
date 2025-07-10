"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from "@/components/ui/sidebar";

import {
  Package,
  FileText,
  LogOut,
} from "lucide-react";

import { logout } from "@/lib/api";
import { useState } from "react";

const items = [
  {
    label: "Administrar productos",
    value: "administrar-productos",
    icon: Package,
  },
  {
    label: "Administrar categorías",
    value: "administrar-categorias",
    icon: FileText,
  },
  {
    label: "Administrar marcas",
    value: "administrar-marcas",
    icon: FileText,
  },
  {
    label: "Administrar unidades",
    value: "administrar-unidades",
    icon: FileText,
  },
  {
    label: "Administrar Wsp",
    value: "administrar-wsp",
    icon: FileText,
  },
];

export default function SidebarAdmin({ onSelectOption, onCloseSidebar }) {
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);
  const { setOpenMobile, isMobile } = useSidebar();

  const handleOpcion = (value) => {
    setOpcionSeleccionada(value);
    onSelectOption?.(value);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleLogout = () => {
    logout()
      .then(() => {
        window.location.href = "/Sesion";
      })
      .catch((error) => {
        alert("Error al cerrar sesión:", error);
      });
  };

  return (
    <Sidebar className="bg-white border-r">
      <SidebarHeader className="px-4 py-3 border-b bg-gray-100">
        <h2 className="text-lg font-bold text-blue-700 tracking-wide">Panel de Administración</h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={() => handleOpcion(item.value)}
                      className={`flex items-center gap-2 w-full px-3 py-2 rounded transition 
                        ${opcionSeleccionada === item.value ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100"}`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                className="flex items-center gap-2 w-full px-3 py-2 text-red-500 hover:bg-red-50 rounded"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                <span>Cerrar sesión</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
