"use client";

import { useLayoutEffect, useRef } from "react";
import { useAltura } from './AlturaContext';

export default function FBlock() {
  const footerRef = useRef(null);
  const { setAlturaFooter } = useAltura();

  useLayoutEffect(() => {
  const timeout = setTimeout(() => {
    if (footerRef.current) {
      setAlturaFooter(footerRef.current.offsetHeight);
    }
  }, 50);
  return () => clearTimeout(timeout);
  }, [setAlturaFooter]);

  return (
    <div ref={footerRef} className="fixed bottom-0 left-0 w-full bg-[#142B5C] text-[#E1E51F] z-50">
      <div className="flex justify-center items-center gap-2 py-2 text-lg font-semibold cursor-pointer hover:opacity-90 transition">
        <i className="fas fa-phone-alt"></i>
        <span>Contáctanos</span>
      </div>
    </div>
  );
}