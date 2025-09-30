'use client';
import { useEffect, useState } from 'react';

export default function MobileOnly({ children, maxWidth = 768 }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width:${maxWidth}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, [maxWidth]);

  return isMobile ? <>{children}</> : null;
}
