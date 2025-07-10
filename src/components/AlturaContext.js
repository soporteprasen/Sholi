'use client';

import { createContext, useContext, useState } from 'react';

const AlturaContext = createContext();

export function AlturaProvider({ children }) {
  const [alturaHeader, setAlturaHeader] = useState(0);
  const [alturaFooter, setAlturaFooter] = useState(0);

  return (
    <AlturaContext.Provider value={{ alturaHeader, alturaFooter, setAlturaHeader, setAlturaFooter }}>
      {children}
    </AlturaContext.Provider>
  );
}

export function useAltura() {
  const context = useContext(AlturaContext);
  if (!context) throw new Error('useAltura debe usarse dentro de AlturaProvider');
  return context;
}
