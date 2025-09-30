"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from "@/components/ui/sidebar"

import { Package, FileText } from "lucide-react"
import { useState, useEffect } from "react"

export const items = [
  { label: "Administrar productos", value: "administrar-productos", icon: Package },
  { label: "Administrar categorías", value: "administrar-categorias", icon: FileText },
  { label: "Administrar marcas", value: "administrar-marcas", icon: FileText },
  { label: "Administrar unidades", value: "administrar-unidades", icon: FileText },
  { label: "Administrar Wsp", value: "administrar-wsp", icon: FileText },
];

export default function SidebarAdmin({ onSelectOption }) {
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(null)
  const { setOpenMobile, isMobile } = useSidebar()

  useEffect(() => {
    const savedIndex = localStorage.getItem("sidebar-selected-index")
    if (savedIndex) {
      const index = parseInt(savedIndex, 10)
      if (!isNaN(index) && items[index - 1]) {
        setOpcionSeleccionada(index)
        onSelectOption?.(items[index - 1].value)
      }
    }
  }, [])

  const handleOpcion = (index, value) => {
    setOpcionSeleccionada(index)
    localStorage.setItem("sidebar-selected-index", index.toString())

    const storageMap = {
      1: "EstadoAdministracionProducto",
      2: "EstadoAdministracionCategoria",
      3: "EstadoAdministracionMarca",
      4: "EstadoAdministracionUnidad",
    }

    const campo = storageMap[index]
    const estado = campo ? localStorage.getItem(campo) : null
    const numEstado = estado ? parseInt(estado, 10) : 0

    if (numEstado === 1) {
    } else {
      setOpcionSeleccionada(null)
      setTimeout(() => onSelectOption?.(value), 100)
    }

    if (isMobile) {
      setOpenMobile(false)
    }
  }


  return (
    <Sidebar className="bg-white border-r">
      <SidebarHeader className="px-4 py-3 border-b bg-gray-100">
        <h2 className="text-lg font-bold text-blue-700 tracking-wide">
          Panel de Administración
        </h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, index) => {
                const numero = index + 1
                return (
                  <SidebarMenuItem key={item.value}>
                    <SidebarMenuButton asChild>
                      <button
                        onClick={() => handleOpcion(numero, item.value)}
                        className={`flex items-center gap-2 w-full px-3 py-2 rounded transition 
                          ${opcionSeleccionada === numero
                            ? "bg-blue-100 text-blue-700 font-semibold"
                            : "hover:bg-gray-100"
                          }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{numero}. {item.label}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
