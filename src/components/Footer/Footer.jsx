import { BookOpen } from "lucide-react";

export default function Footer() {
  const fechaActual = new Date();
  const añoActual = fechaActual.getFullYear();

  return (
    <footer
      id="footer-sholi"
      role="contentinfo"
      className="bg-gray-50 text-sm text-gray-700 border-t"
    >
      {/* Datos estructurados SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Prasen",
            url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
            logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo/logo-principal-prasen.webp`,
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+51-926951971",
              contactType: "Customer Support",
              areaServed: "PE",
              availableLanguage: "Spanish",
            },
            sameAs: [
              "https://www.facebook.com/praseniluminacion",
              "https://www.instagram.com/prasenled",
              "https://www.linkedin.com/company/tuEmpresa",
              "https://www.youtube.com/tuCanal",
              "https://www.tiktok.com/@tuUsuario",
            ],
          }),
        }}
      />

      {/* Bloques principales */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 📍 Centrales */}
        <div>
          <h3 className="font-bold text-xs text-gray-500 mb-2">CENTRALES</h3>
          <address className="not-italic space-y-2">
            <p>
              <strong>Sede principal:</strong> Av. XXXXX 123 – Lima, Perú
            </p>
            <p>
              <strong>Sucursal Bambas:</strong> Jr. XXXXX 456 – Lima, Perú
            </p>
            <p>
              <strong>Almacén:</strong> Callao, Perú
            </p>
          </address>

          {/* Redes sociales */}
          <div className="flex gap-4 mt-4 text-xl text-[#7c141b]">
            <a
              href="#"
              aria-label="Facebook"
              className="hover:opacity-80 transition"
            >
              {/* SVG */}
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="hover:opacity-80 transition"
            >
              {/* SVG */}
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="hover:opacity-80 transition"
            >
              {/* SVG */}
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="hover:opacity-80 transition"
            >
              {/* SVG */}
            </a>
            <a
              href="#"
              aria-label="TikTok"
              className="hover:opacity-80 transition"
            >
              {/* SVG */}
            </a>
          </div>
        </div>

        {/* ❓ ¿Tienes dudas? */}
        <div>
          <h3 className="font-bold text-xs text-gray-500 mb-2">
            ¿TIENES ALGUNA DUDA?
          </h3>
          <p>
            <strong>Central:</strong> +51 926 951 971
          </p>
          <p>contacto@prasen.pe</p>
          <h4 className="font-semibold mt-4 text-sm">HORARIO DE ATENCIÓN</h4>
          <p>Lunes a Viernes: 8:00 a.m – 6:00 p.m</p>
        </div>

        {/* ⚖️ Legales */}
        <div>
          <h3 className="font-bold text-xs text-gray-500 mb-2">LEGALES</h3>
          <ul className="space-y-1">
            <li>
              <a href="#">Términos y condiciones</a>
            </li>
            <li>
              <a href="#">Política de privacidad</a>
            </li>
            <li>
              <a href="#">Preguntas frecuentes</a>
            </li>
          </ul>
          <div className="mt-4">
            <button className="bg-[#7c141b] text-white px-3 py-2 text-xs rounded hover:bg-[#3C1D2A] transition flex items-center gap-2">
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              LIBRO DE RECLAMACIONES
            </button>
          </div>
        </div>
      </div>

      {/* Pie */}
      <div className="bg-white text-center text-xs py-6 border-t">
        <p className="mb-2">
          ©{añoActual} Prasen. Todos los derechos reservados
        </p>
        <p>
          Diseño por{" "}
          <a
            href="https://www.prasen.pe/"
            className="text-[#7c141b] hover:text-[#3C1D2A] font-medium"
          >
            PRASEN
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
