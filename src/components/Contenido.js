'use client';

import { useAltura } from './AlturaContext';

export default function Contenido({ children }) {
  const { alturaHeader, alturaFooter } = useAltura();

  return (
    <div
      style={{
        paddingTop: `${alturaHeader}px`,
      }}
      className="min-h-screen bg-gray-50"
    >
      {children}
    </div>
  );
}
