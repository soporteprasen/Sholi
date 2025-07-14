// app/layout.js o app/layout.tsx
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { AlturaProvider } from "@/components/AlturaContext";
import ClientWrapper from "@/components/ClientWrapper";

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
  description: 'Compra productos LED con envío a todo el Perú.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AlturaProvider>
          <ClientWrapper>
            {children}
          </ClientWrapper>
        </AlturaProvider>
      </body>
    </html>
  );
}
