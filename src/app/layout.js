{/* *************************************************************************************** */}
{/*                                Layout principal                                         */}
{/* *************************************************************************************** */}

{/* Importacion de bloque que se usaran */}

import "./globals.css"; // css global
import { Geist, Geist_Mono } from "next/font/google"; // cargadores de fuentes para las familias Geist y Geist Mono.
import Header from "@/components/Header2/Header.jsx"; // Header(contiene el encabezado tanto para Desktop como para Mobile)
import Footer from "@/components/Footer/Footer"; // Footer(contiene el footer tanto en desktop como en movil)
import FBlock from "@/components/Footer/Fblock"; // Bloque que solo aparece en movil
import Script from "next/script"; // Sirve para tipar y documentar cómo cargar scripts de terceros de forma optimizada en una app Next.
import AnimationHead from "@/components/AnimationHead";
import PageLoader from "@/components/PageLoader";

{/* configuración de la fuente Geist con next/font/google */}
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

{/* configuración de la fuente monoespaciada Geist Mono con next/font/google */}
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

{/* Metadatos de la pagina */}
export const metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_SITE_URL}`),
  title: {
    default: 'Sholi - Tienda de productos ferreteros',
    template: '%s | Tienda de productos ferreteros',
  },
  icons: {
    icon: "/favicon.svg",
  },
  description: 'Compra productos LED como focos, lámparas y reflectores con envío a todo el Perú. Garantía y calidad certificada.',
  openGraph: {
    title: 'Sholi - tienda de productos ferreteros',
    description: 'Explora nuestra tienda online con productos LED certificados y envío a todo el país.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
    siteName: 'Sholi',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo/logo-principal-prasen.webp`,
        width: 1200,
        height: 630,
        alt: 'Tienda de Iluminación LED',
      },
    ],
    locale: 'es_PE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@sholi_iluminacion',
    title: 'Sholi - productos ferreteros',
    description: 'Compra en línea iluminación LED con garantía y entrega rápida en Perú.',
    images: [`${process.env.NEXT_PUBLIC_SITE_URL}/logo/logo-principal-prasen.webp`],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}`,
  },
};

{/* Bloque principal */}
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <AnimationHead />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <PageLoader/>
        <Header />
        <main
          className="bg-gray-50 md: pt-[130px]"
        >
          {children}
        </main>
        <Footer />
        <div className="block md:hidden pt-11">
          <FBlock />
        </div>
        <Script type="application/ld+json" id="schema-org">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Sholi",
            url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
            logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo/logo-principal-prasen.webp`,
            sameAs: [
              "https://facebook.com/sholi",
              "https://instagram.com/sholi",
            ],
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+51-999-999-999",
              contactType: "Customer Service",
              areaServed: "PE",
              availableLanguage: ["Spanish"],
            },
          })}
        </Script>
      </body>
    </html>
  );
}
