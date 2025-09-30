'use client';
import { useRef, useState, useEffect } from 'react';
import CrearUnidadMedida from './Unidades/CrearUnidad';
import CrearCategoria from './Categorias/CrearCategoria';
import CrearMarca from './Marcas/CrearMarca';
import { Minus, X } from 'lucide-react';

export default function FloatingWindow({ title = "Ventana", children, tipo, onClose }) {
  const windowRef = useRef(null);
  const [minimized, setMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [mostrarContenido, setMostrarContenido] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const centerX = window.innerWidth / 2 - 200;
    setPosition({ x: centerX, y: 100 });

    const body = document.body;
    const hadScrollbar = window.innerWidth > document.documentElement.clientWidth;

    if (hadScrollbar) {
      body.style.paddingRight = '17px'; // Compensación visual por el scroll desaparecido
    }

    body.style.overflow = 'hidden'; // Oculta scroll

    setTimeout(() => setMostrarContenido(true), 100);

    return () => {
      body.style.paddingRight = '';
      body.style.overflow = '';
    };
  }, []);


  const handleMouseDown = (e) => {
    setDragging(true);
    const rect = windowRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const componentMap = {
    unidad: <CrearUnidadMedida onCancel={onClose} />,
    categoria: <CrearCategoria onCancel={onClose} />,
    marca: <CrearMarca onCancel={onClose} />,
  };

  const ComponenteDinamico = componentMap[tipo];

  return (
    <div
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onClose();
        }
      }}
      className="fixed inset-0 z-[9998] bg-black/20"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        ref={windowRef}
        className={`absolute bg-white border border-gray-300 rounded-xl shadow-2xl w-[400px] z-[9999] ease-out ${mostrarContenido ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      >
        {/* Header draggable */}
        <div
          className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center cursor-move rounded-t-xl select-none"
          onMouseDown={handleMouseDown}
        >
          <span className="text-lg font-semibold truncate">{title}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMinimized(!minimized)}
              className="hover:text-gray-300"
              title="Minimizar"
            >
              <Minus size={18} />
            </button>
            <button
              onClick={onClose}
              className="hover:text-red-400"
              title="Cerrar"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div
          className={`transition-all duration-300 ease-in-out ${mostrarContenido ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <div className="max-h-[80vh] overflow-y-auto p-5">
            {children || ComponenteDinamico}
          </div>
        </div>
      </div>
    </div>
  );
}
