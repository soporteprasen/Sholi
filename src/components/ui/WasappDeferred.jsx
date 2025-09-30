'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Carga el botón recién cuando el hilo esté ocioso
const Wasapp = dynamic(() => import('@/components/WspFlot'), { ssr: false, loading: () => null });

export default function WasappDeferred() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onIdle = () => setReady(true);
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const id = window.requestIdleCallback(onIdle);
      return () => window.cancelIdleCallback && window.cancelIdleCallback(id);
    }
    const t = setTimeout(onIdle, 1500);
    return () => clearTimeout(t);
  }, []);

  return ready ? <Wasapp /> : null;
}
