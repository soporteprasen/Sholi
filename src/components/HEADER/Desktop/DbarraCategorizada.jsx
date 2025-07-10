"use client";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import MmProductos from "./Megamenus/MmProductos";
import MmMarcas from "./Megamenus/MmMarcas";
import Link from "next/link";

export default function DbarraCategorizada() {
  const [menuActivo, setMenuActivo] = useState("");
  

  return (
    <nav className="bg-white shadow-sm border-t border-gray-200">
      <NavigationMenu className="w-full">
        <NavigationMenuList className="flex justify-center gap-4 px-4 text-sm font-medium text-gray-700 h-12">
          {/* Productos */}
          <NavigationMenuItem className="relative">
            <NavigationMenuTrigger
              className="hover:text-indigo-600 transition bg-transparent"
              onPointerEnter={() => setMenuActivo("productos")}
            >
              <a href="/categorias" className="inline-flex items-center justify-center h-12 px-4 text-sm font-medium">
                Productos
              </a>
            </NavigationMenuTrigger>
            <NavigationMenuContent className="w-auto mx-auto">
              {menuActivo === "productos" && <MmProductos />}
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Marcas */}
          <NavigationMenuItem className="relative">
            <NavigationMenuTrigger
              className="hover:text-indigo-600 transition bg-transparent"
              onPointerEnter={() => setMenuActivo("marcas")}
            >
              Marcas
            </NavigationMenuTrigger>
            <NavigationMenuContent className="w-auto mx-auto">
              {menuActivo === "marcas" && <MmMarcas />}
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Nosotros */}
          {/* <NavigationMenuItem className="relative">
            <NavigationMenuTrigger
              className="hover:text-indigo-600 transition bg-transparent"
              onPointerEnter={() => setMenuActivo("nosotros")}
            >
              Nosotros
            </NavigationMenuTrigger>
            <NavigationMenuContent className="w-auto mx-auto">
              {menuActivo === "nosotros" && (
                <ul className="bg-white shadow-md rounded-md min-w-[200px] py-2">
                  {["Historia", "Equipo", "Misión"].map((item, idx) => (
                    <li
                      key={idx}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </NavigationMenuContent>
          </NavigationMenuItem> */}

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                href="/Contacto"
                className="px-2 hover:text-indigo-600 transition inline-flex h-full items-center"
              >
                Contacto
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}
