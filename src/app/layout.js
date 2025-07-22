// app/layout.js 
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Wasapp from "@/components/WspFlot";
import Footer from "@/components/Footer";
import FBlock from "@/components/Fblock";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://prasen.pe'),
  title: {
    default: 'Tienda de Iluminación - Productos LED',
    template: '%s | Tienda de Iluminación',
  },
  description: 'Compra productos LED como focos, lámparas y reflectores con envío a todo el Perú. Garantía y calidad certificada.',
  keywords: [
    "iluminación LED",
    "focos LED",
    "lámparas LED",
    "tienda de luces Perú",
    "productos eléctricos",
    "comprar online",
  ],
  openGraph: {
    title: 'Tienda de Iluminación - Productos LED',
    description: 'Explora nuestra tienda online con productos LED certificados y envío a todo el país.',
    url: 'https://prasen.pe',
    siteName: 'Prasen',
    images: [
      {
        url: 'https://prasen.pe/opengraph/home.webp',
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
    site: '@prasen_led',
    title: 'Prasen | Productos LED en Perú',
    description: 'Compra en línea iluminación LED con garantía y entrega rápida en Perú.',
    images: ['https://prasen.pe/opengraph/home.webp'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  alternates: {
    canonical: 'https://prasen.pe',
  },
  authors: [{ name: 'Prasen', url: 'https://prasen.pe' }],
  creator: 'Prasen',
  publisher: 'Prasen',
  category: 'ecommerce',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Header />
        <main
          className="bg-gray-50 md: pt-33"
        >
          {children}
        </main>
        <Wasapp />
        <Footer />
        <div className="block md:hidden pt-11">
          <FBlock />
        </div>
        <Script type="application/ld+json" id="schema-org">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Prasen",
            url: "https://prasen.pe",
            logo: "https://prasen.pe/logo-prasen.png",
            sameAs: [
              "https://facebook.com/praseniluminacion",
              "https://instagram.com/prasenled",
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
