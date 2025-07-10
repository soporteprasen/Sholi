// components/ClientWrapper.jsx
"use client";

import { useAltura } from "./AlturaContext";
import Header from "./Header";
import Footer from "./Footer";
import FBlock from "./FBlock";
import Wasapp from "./WspFlot";

export default function ClientWrapper({ children }) {
  const { alturaHeader, alturaFooter } = useAltura();

  return (
    <>
      <Header />
      <main
        style={{
          paddingTop: `${alturaHeader}px`,
        }}
        className="bg-gray-50"
      >
        {children}
      </main>
      <Wasapp />
      <Footer />
      <div className="block md:hidden" style={{
          paddingBottom: `${alturaFooter}px`,
        }}>
        <FBlock />
      </div>
    </>
  );
}
