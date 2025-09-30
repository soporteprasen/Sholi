// app/nosotros/page.jsx
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

/** Fuerza SSR en App Router */
export const dynamic = "force-dynamic";
export const revalidate = 0;

function baseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") 
    || "https://sholi-dcbbftbdare6buhb.westus-01.azurewebsites.net";
}

export async function generateMetadata() {
  const base = baseUrl();
  const url = `${base}/nosotros`;
  const title = "Sobre Sholi | Iluminación y Materiales Eléctricos en Perú";
  const description = "Conoce quiénes somos: experiencia, misión, valores, certificaciones y cobertura nacional. Sholi suministra iluminación LED y materiales eléctricos con garantía.";

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Sholi Iluminación",
      type: "website",
      locale: "es_PE",
      images: [
        {
          url: `${base}/banners-paginas/Banner-Tienda-General.webp`,
          width: 1200,
          height: 630,
          alt: "Sholi | Quiénes somos",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${base}/banners-paginas/Banner-Tienda-General.webp`],
    },
    robots: { index: true, follow: true },
  };
}

export default async function NosotrosPage() {
  const base = baseUrl();
  const org = {
    name: "Sholi Iluminación",
    url: base,
    logo: `${base}/logo/logo-principal-prasen.webp`,
    telephone: "+51 926 951 971",
    email: "contacto@sholi.com",
    address: {
      streetAddress: "Av. Ejemplo 123",
      addressLocality: "Lima",
      addressCountry: "PE",
    },
  };

  return (
    <>
      {/* JSON-LD: AboutPage + Organization + Breadcrumb + FAQ */}
      <Script id="about-structured-data" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "Sobre nosotros - Sholi Iluminación",
          description:
            "Conoce más sobre Sholi: trayectoria, misión, valores, certificaciones y cobertura de envíos en Perú.",
          url: `${base}/nosotros`,
          mainEntity: {
            "@type": "Organization",
            name: org.name,
            url: org.url,
            logo: org.logo,
            contactPoint: {
              "@type": "ContactPoint",
              telephone: org.telephone,
              contactType: "customer service",
              areaServed: "PE",
              availableLanguage: ["es"],
            },
          },
        })}
      </Script>

      <Script id="breadcrumb-structured-data" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: base },
            { "@type": "ListItem", position: 2, name: "Nosotros", item: `${base}/nosotros` },
          ],
        })}
      </Script>

      <Script id="faq-structured-data" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "¿Hacen envíos a todo el Perú?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Sí, realizamos envíos a nivel nacional mediante operadores logísticos confiables. Ofrecemos costos y tiempos estimados en el checkout.",
              },
            },
            {
              "@type": "Question",
              name: "¿Los productos cuentan con garantía?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Sí. Los productos LED y eléctricos cuentan con garantía del fabricante. El periodo depende de la familia de producto.",
              },
            },
            {
              "@type": "Question",
              name: "¿Atienden proyectos y cotizaciones empresariales?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Claro. Nuestro equipo comercial atiende proyectos industriales y corporativos. Escríbenos y te asesoramos.",
              },
            },
          ],
        })}
      </Script>

      {/* BREADCRUMB */}
      <nav aria-label="miga de pan" className="bg-gray-50 border-b">
        <ol className="max-w-screen-xl mx-auto px-4 py-2 text-sm flex gap-2">
          <li>
            <Link href="/" className="text-gray-600 hover:text-[#7c141b]">
              Inicio
            </Link>
          </li>
          <li aria-hidden="true" className="text-gray-400">/</li>
          <li className="text-gray-800 font-medium">Nosotros</li>
        </ol>
      </nav>

      {/* HERO / LCP */}
      <header className="relative">
        <div className="max-w-screen-xl mx-auto px-4 py-10 md:py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#7c141b]">
              Sholi: energía, calidad y confianza
            </h1>
            <p className="mt-4 text-gray-700 md:text-lg">
              Somos especialistas en <strong>iluminación LED</strong> y{" "}
              <strong>materiales eléctricos</strong>. Acompañamos a hogares, comercios e
              industrias con soluciones eficientes, garantía real y cobertura nacional.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/tienda"
                className="inline-flex items-center justify-center rounded-lg px-5 py-3 font-semibold border border-[#7c141b] text-white"
                style={{ backgroundColor: "#7c141b" }}
              >
                Ver productos
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center rounded-lg px-5 py-3 font-semibold border text-[#7c141b] border-[#7c141b] bg-white hover:bg-[#7c141b]/5"
              >
                Contáctanos
              </Link>
            </div>

            {/* Datos de confianza */}
            <dl className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <dt className="text-sm text-gray-500">Años de experiencia</dt>
                <dd className="text-2xl font-bold text-gray-900">6+</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">SKUs activos</dt>
                <dd className="text-2xl font-bold text-gray-900">1,200+</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Clientes</dt>
                <dd className="text-2xl font-bold text-gray-900">10k+</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Cobertura</dt>
                <dd className="text-2xl font-bold text-gray-900">Perú</dd>
              </div>
            </dl>
          </div>

          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden ring-1 ring-gray-200">
            <Image
              src="/logo/logo-principal-prasen.webp"
              alt="Almacén y equipo de Sholi listos para despachar pedidos"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              fetchPriority="high"
            />
          </div>
        </div>
      </header>

      {/* QUIÉNES SOMOS */}
      <section className="bg-white">
        <div className="max-w-screen-xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-[#7c141b]">Quiénes somos</h2>
            <p className="text-gray-700">
              Nacimos con una misión clara: facilitar el acceso a soluciones de iluminación y
              materiales eléctricos confiables, eficientes y accesibles. Combinamos{" "}
              <strong>asesoría técnica</strong>, stock disponible y una experiencia de compra cuidada.
            </p>
            <p className="text-gray-700">
              Trabajamos con marcas y fabricantes certificados. Cada producto pasa controles de
              calidad y cuenta con respaldo y garantía. Atendemos desde compras retail hasta
              <strong> proyectos industriales</strong>.
            </p>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Asesoría pre y post venta</li>
              <li>Stock y reposición continua</li>
              <li>Precios competitivos y promociones</li>
              <li>Envíos a todo el Perú</li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden ring-1 ring-gray-200">
              <Image
                src="/banners-paginas/Banner-Tienda-General.webp"
                alt="Exhibición de productos de iluminación LED"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden ring-1 ring-gray-200">
              <Image
                src="/banners-paginas/Banner-Tienda-Categorias.webp"
                alt="Equipo de Sholi preparando pedidos"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden ring-1 ring-gray-200">
              <Image
                src="/banners-paginas/Banner-Tienda-Marcas.webp"
                alt="Almacén con inventario organizado"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden ring-1 ring-gray-200">
              <Image
                src="/banners-paginas/Banner-Tienda-General.webp"
                alt="Área de pruebas y control de calidad"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* MISIÓN / VISIÓN / VALORES */}
      <section className="bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#7c141b] mb-6">Nuestra esencia</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-xl border bg-white p-6">
              <h3 className="text-xl font-semibold text-gray-900">Misión</h3>
              <p className="mt-2 text-gray-700">
                Proveer soluciones de iluminación y materiales eléctricos eficientes, seguras
                y accesibles, ofreciendo soporte técnico y una experiencia de compra impecable.
              </p>
            </div>
            <div className="rounded-xl border bg-white p-6">
              <h3 className="text-xl font-semibold text-gray-900">Visión</h3>
              <p className="mt-2 text-gray-700">
                Ser la marca de referencia en Perú por calidad, innovación y servicio,
                impulsando el ahorro energético y la sostenibilidad.
              </p>
            </div>
            <div className="rounded-xl border bg-white p-6">
              <h3 className="text-xl font-semibold text-gray-900">Valores</h3>
              <ul className="mt-2 text-gray-700 list-disc pl-5 space-y-1">
                <li>Orientación al cliente</li>
                <li>Integridad y cumplimiento</li>
                <li>Mejora continua</li>
                <li>Sostenibilidad</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CERTIFICACIONES / GARANTÍAS */}
      <section className="bg-white">
        <div className="max-w-screen-xl mx-auto px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#7c141b] mb-6">
            Calidad, certificaciones y garantía
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border p-6">
              <h3 className="text-lg font-semibold text-gray-900">Respaldos</h3>
              <p className="mt-2 text-gray-700">
                Trabajamos con marcas certificadas (p. ej. ISO, IEC, RoHS según familia).
                Cada lote pasa controles y se documenta su trazabilidad.
              </p>
            </div>
            <div className="rounded-xl border p-6">
              <h3 className="text-lg font-semibold text-gray-900">Garantía</h3>
              <p className="mt-2 text-gray-700">
                Ofrecemos garantía oficial del fabricante. El periodo varía por categoría (por ejemplo,
                luminarias LED con garantía de 12–24 meses).
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="inline-flex items-center rounded-full border px-3 py-1 text-sm text-gray-700">
              IEC
            </span>
            <span className="inline-flex items-center rounded-full border px-3 py-1 text-sm text-gray-700">
              RoHS
            </span>
            <span className="inline-flex items-center rounded-full border px-3 py-1 text-sm text-gray-700">
              ISO
            </span>
          </div>
        </div>
      </section>

      {/* COBERTURA / LOGÍSTICA */}
      <section className="bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#7c141b] mb-6">Cobertura y logística</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-xl border bg-white p-6">
              <h3 className="font-semibold text-gray-900">Cobertura nacional</h3>
              <p className="mt-2 text-gray-700">
                Envíos a todos los departamentos del Perú mediante operadores logísticos
                confiables y seguimiento del paquete.
              </p>
            </div>
            <div className="rounded-xl border bg-white p-6">
              <h3 className="font-semibold text-gray-900">Tiempos y costos</h3>
              <p className="mt-2 text-gray-700">
                Calculamos costos y ETA en el checkout según destino, peso y volumen.
              </p>
            </div>
            <div className="rounded-xl border bg-white p-6">
              <h3 className="font-semibold text-gray-900">Pagos</h3>
              <p className="mt-2 text-gray-700">
                Aceptamos tarjetas y transferencias. Para corporativos, emitimos factura electrónica.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ accesible sin JS */}
      <section className="bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#7c141b] mb-6">
            Preguntas frecuentes
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                q: "¿Hacen envíos a todo el Perú?",
                a: "Sí, gestionamos envíos nacionales y compartimos el tracking. Los costos se calculan al finalizar la compra.",
              },
              {
                q: "¿Cómo solicito una cotización corporativa?",
                a: "Escríbenos desde la página de Contacto con lista de SKUs o requerimientos técnicos y te responderemos con una propuesta.",
              },
              {
                q: "¿Qué garantías ofrecen?",
                a: "Garantía oficial del fabricante contra defectos de fabricación. El plazo varía por producto.",
              },
              {
                q: "¿Pueden asesorarme en la elección de productos?",
                a: "Por supuesto. Te ayudamos a dimensionar potencia, flujo lumínico y accesorios necesarios.",
              },
            ].map(({ q, a }, i) => (
              <details key={i} className="rounded-xl border bg-white p-4">
                <summary className="cursor-pointer font-semibold text-gray-900">
                  {q}
                </summary>
                <p className="mt-2 text-gray-700">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-white border-t">
        <div className="max-w-screen-xl mx-auto px-4 py-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            ¿Listo para empezar tu proyecto?
          </h2>
          <p className="mt-2 text-gray-700">
            Cotiza con nuestro equipo y recibe asesoría personalizada.
          </p>
          <div className="mt-5 flex gap-3 justify-center">
            <Link
              href="/tienda"
              className="inline-flex items-center justify-center rounded-lg px-5 py-3 font-semibold border border-[#7c141b] text-white"
              style={{ backgroundColor: "#7c141b" }}
            >
              Ver tienda
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center rounded-lg px-5 py-3 font-semibold border text-[#7c141b] border-[#7c141b] bg-white hover:bg-[#7c141b]/5"
            >
              Contáctanos
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
