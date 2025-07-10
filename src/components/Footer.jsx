'use client';

import { useAltura } from './AlturaContext';
import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';

export default function Footer() {
  const { alturaFooter } = useAltura();
  const [margenInferior, setMargenInferior] = useState(0);

  useEffect(() => {
    setMargenInferior(alturaFooter);
  }, [alturaFooter]);

  return (
    <footer role="contentinfo" className="bg-gray-50 text-sm text-gray-700 border-t">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* CENTRALES */}
        <div>
          <h3 className="font-bold text-xs text-gray-500 mb-2">CENTRALES</h3>
          <p><strong>Sede principal:</strong> xxxxxxxxxxxxxxxxx - Lima Perú</p>
          <p><strong>Sucursal Bambas:</strong> xxxxxxxxxx - Lima, Perú</p>
          <p><strong>Almacén:</strong> xxxxxxxxxxxx - Callao, Perú</p>
          <div className="flex gap-3 mt-4 text-xl text-[#d7e600]">
            {/* Facebook */}
            <a href="#" aria-label="Facebook">
              <svg className="w-5 h-5 hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 320 512">
                <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S281.36 0 248.36 0c-73.16 0-121 44.38-121 124.72V195.3H97.54V288h29.82v224h92.66V288z" />
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" aria-label="Instagram">
              <svg className="w-5 h-5 hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 448 512">
                <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9S160.5 370.9 224.1 370.9 339 319.6 339 255.9 287.7 141 224.1 141zm146.4-27.2c0 14.9-12 26.9-26.9 26.9-14.9 0-26.9-12-26.9-26.9s12-26.9 26.9-26.9 26.9 12 26.9 26.9zM398.8 388c-7.8 19.5-22.8 34.5-42.3 42.3-29.2 11.7-98.5 9-132.5 9s-103.3 2.6-132.5-9c-19.5-7.8-34.5-22.8-42.3-42.3-11.7-29.2-9-98.5-9-132.5s-2.6-103.3 9-132.5c7.8-19.5 22.8-34.5 42.3-42.3 29.2-11.7 98.5-9 132.5-9s103.3-2.6 132.5 9c19.5 7.8 34.5 22.8 42.3 42.3 11.7 29.2 9 98.5 9 132.5s2.6 103.3-9 132.5z" />
              </svg>
            </a>
            {/* YouTube */}
            <a href="#" aria-label="YouTube">
              <svg className="w-5 h-5 hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 576 512">
                <path d="M549.655 124.083c-6.281-23.725-24.85-42.308-48.571-48.601C458.929 64 288 64 288 64s-170.929 0-213.084 11.482c-23.721 6.293-42.29 24.876-48.571 48.601C16 166.274 16 256 16 256s0 89.726 10.345 131.917c6.281 23.725 24.85 42.308 48.571 48.601C117.071 448 288 448 288 448s170.929 0 213.084-11.482c23.721-6.293 42.29-24.876 48.571-48.601C560 345.726 560 256 560 256s0-89.726-10.345-131.917zM232 336V176l142 80-142 80z" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="#" aria-label="LinkedIn">
              <svg className="w-5 h-5 hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 448 512">
                <path d="M100.28 448H7.4V148.9h92.88zm-46.44-341c-29.2 0-53.6-24.3-53.6-53.6S24.6 0 53.8 0c29.2 0 53.6 24.3 53.6 53.6S83 107 53.8 107zM447.9 448h-92.4V302.4c0-34.7-12.4-58.4-43.4-58.4-23.6 0-37.6 15.9-43.8 31.3-2.3 5.6-2.8 13.5-2.8 21.4V448h-92.5s1.2-243.5 0-268.1h92.5v38c12.3-19 34.3-46.1 83.5-46.1 60.9 0 106.7 39.7 106.7 125.2V448z" />
              </svg>
            </a>
            {/* TikTok */}
            <a href="#" aria-label="TikTok">
              <svg className="w-5 h-5 hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 448 512">
                <path d="M448,209.9v125.6c0,63.2-51.2,114.3-114.3,114.3c-30.3,0-57.8-11.8-78.1-31.1c-20.2-19.3-33.1-46-36.5-75.5c-2.5-21.9,0-44.6,7.2-65.4c7.2-20.7,18.9-39.3,34-54.1c15.1-14.8,33.6-25.7,53.7-31.8c8.7-2.5,17.7-3.8,26.9-3.8c5.5,0,11,0.5,16.3,1.4c13.2,2.2,25.7,7.2,36.9,14.5c11.2,7.4,21.2,17,29.2,28c8,11.1,13.5,23.7,16.4,36.9h61.9c-3.2-41.3-22.1-79.8-52.2-109.1c-30.2-29.3-70.2-45.6-112.6-45.6c-49.6,0-96,19.3-130.6,54C19.3,169.7,0,216,0,265.6v125.6C0,454.8,51.2,506,114.3,506s114.3-51.2,114.3-114.3V209.9h-61.9V391.7c0,29-23.6,52.6-52.6,52.6S62.6,420.7,62.6,391.7V265.6c0-29,23.6-52.6,52.6-52.6c29,0,52.6,23.6,52.6,52.6v126.1c0,0,0,0,0,0" />
              </svg>
            </a>
          </div>
        </div>

        {/* ¿TIENES DUDAS? */}
        <div>
          <h3 className="font-bold text-xs text-gray-500 mb-2">¿TIENES ALGUNA DUDA?</h3>
          <p><strong>Central:</strong> (01) 999 9999</p>
          <p>prasen.pe</p>
          <h4 className="font-semibold mt-4 text-sm">HORARIO DE ATENCIÓN</h4>
          <p>Lunes a Viernes: 8:00 a.m – 6:00 p.m</p>
        </div>

        {/* LEGALES */}
        <div>
          <h3 className="font-bold text-xs text-gray-500 mb-2">LEGALES</h3>
          <ul className="space-y-1">
            <li><a href="#">Términos y condiciones</a></li>
            <li><a href="#">Política de privacidad</a></li>
            <li><a href="#">Políticas de envío</a></li>
            <li><a href="#">Preguntas frecuentes</a></li>
          </ul>
          <div className="mt-4">
            <button className="border p-2 text-xs rounded hover:shadow flex items-center gap-2">
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              LIBRO DE RECLAMACIONES
            </button>
          </div>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h3 className="font-bold text-xs text-gray-500 mb-2">MANTENTE ACTUALIZADO</h3>
          <input
            type="email"
            placeholder="Email"
            className="w-full px-3 py-2 border rounded mb-2"
            aria-label="Correo electrónico"
          />
          <button className="bg-[#d7e600] text-sm px-4 py-2 rounded text-white font-semibold hover:brightness-110">
            ENVIAR
          </button>
          <div className="mt-2 text-xs">
            <label htmlFor="terms">
              <input id="terms" type="checkbox" className="mr-2" />
              He leído y acepto los términos de la web
            </label>
          </div>
        </div>
      </div>

      {/* PIE DE PÁGINA */}
      <div className="bg-white text-center text-xs py-6 border-t">
        <p className="mb-2">©2023 Prasen. Todos los derechos reservados</p>
        <p>
          Desarrollado por <a href="#" className="text-blue-700 font-medium">PRASEN</a>. 
          Diseño por <a href="#" className="text-blue-700 font-medium">danfer</a>.
        </p>
      </div>
    </footer>
  );
}
