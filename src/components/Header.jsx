"use client";

import { useLayoutEffect, useRef } from "react";
import { useAltura } from './AlturaContext';
import MbarraPrincipal from './HEADER/Mobile/MbarraPrincipal';
import MbarraCategorizada from './HEADER/Mobile/MbarraCategorizada';
import DbarraPrincipal from './HEADER/Desktop/DbarraPrincipal';
import DbarraCategorizada from './HEADER/Desktop/DbarraCategorizada';

export default function Header() {
  const headerRef = useRef(null);
  const { setAlturaHeader } = useAltura();

  useLayoutEffect(() => {
    if (headerRef.current) {
      setAlturaHeader(headerRef.current.offsetHeight);
    }
  }, [setAlturaHeader]);

  return (
    <header ref={headerRef} className="w-full fixed top-0 left-0 z-50 bg-white shadow">
      {/* Vista móvil */}
      <div className="block md:hidden">
        <MbarraPrincipal />
        <MbarraCategorizada />
      </div>

      {/* Vista escritorio */}
      <div className="hidden md:block">
        <DbarraPrincipal />
        <DbarraCategorizada />
      </div>
    </header>
  );
}
