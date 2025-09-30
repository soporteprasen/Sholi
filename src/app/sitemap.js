// app/sitemap.js
import { obtenerMarcas, obtenerProductos, obtenerCategorias } from "@/lib/api";

// slugify: minúsculas, sin acentos, con guiones
const slugify = (s = "") =>
  s.toString()
   .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
   .toLowerCase()
   .replace(/[^a-z0-9]+/g, "-")
   .replace(/(^-|-$)/g, "");

const isStr = (s) => typeof s === "string" && s.trim().length > 0;
const lastMod = (o) =>
  new Date(o?.updatedAt || o?.updated_at || o?.fechaActualizacion || o?.modifiedAt || Date.now());

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://sholi-dcbbftbdare6buhb.westus-01.azurewebsites.net";

  const [catsRaw, brandsRaw, prodsRaw] = await Promise.all([
    obtenerCategorias(),
    obtenerMarcas(),
    obtenerProductos(),
  ]);

  // Categorías y marcas (usando tus campos)
  const categories = (catsRaw || [])
    .map((c) => ({ ...c, _slug: slugify(c.slug_categoria ?? "") }))
    .filter((c) => isStr(c._slug) && c._slug !== "generico");

  const brands = (brandsRaw || [])
    .map((b) => ({ ...b, _slug: slugify(b.slug_marca ?? "") }))
    .filter((b) => isStr(b._slug) && b._slug !== "generico");

  const catSet = new Set(categories.map((c) => c._slug));
  const brandSet = new Set(brands.map((b) => b._slug));

  // Productos: usa product.nombreSlug para la URL del producto
  const products = (prodsRaw || [])
    .filter((p) => !p.draft)
    .map((p) => {
      const productSlug = slugify(p.nombreSlug ?? p.slug ?? p.slug_producto ?? p.name ?? p.nombre ?? "");
      const catSlugFromProd =
        p.slug_categoria ?? p.categorySlug ?? p.categoriaSlug ?? p.category ?? p.categoria ?? "";
      const brandSlugFromProd =
        p.slug_marca ?? p.brandSlug ?? p.marcaSlug ?? p.brand ?? p.marca ?? "";

      return {
        ...p,
        _slug: productSlug,
        _category: slugify(catSlugFromProd),
        _brand: slugify(brandSlugFromProd),
      };
    })
    .filter((p) => isStr(p._slug));

  const urls = [
    // Estáticas
    { url: `${base}/`,           lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${base}/categorias`, lastModified: new Date(), changeFrequency: "weekly",  priority: 0.6 },
    { url: `${base}/nosotros`,   lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contacto`,   lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    // Tienda general
    { url: `${base}/tienda`,     lastModified: new Date(), changeFrequency: "weekly",  priority: 0.6 },
  ];

  // /tienda/[marca]
  for (const b of brands) {
    urls.push({
      url: `${base}/tienda/${b._slug}`,
      lastModified: lastMod(b),
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  // /categoria/[categoria]
  for (const c of categories) {
    urls.push({
      url: `${base}/categoria/${c._slug}`,
      lastModified: lastMod(c),
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  // /categoria/[categoria]/[marca] — combos reales inferidos de productos
  const pairSeen = new Set();
  for (const p of products) {
    if (!isStr(p._category) || !isStr(p._brand)) continue;
    if (!catSet.has(p._category) || !brandSet.has(p._brand)) continue;
    if (p._category === "generico" || p._brand === "generico") continue;

    const key = `${p._category}|${p._brand}`;
    if (pairSeen.has(key)) continue;
    pairSeen.add(key);

    urls.push({
      url: `${base}/categoria/${p._category}/${p._brand}`,
      lastModified: lastMod(p),
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  // /producto/[slug] (usando nombreSlug)
  const seenProducts = new Set();
  for (const p of products) {
    if (seenProducts.has(p._slug)) continue;
    seenProducts.add(p._slug);
    urls.push({
      url: `${base}/producto/${p._slug}`,
      lastModified: lastMod(p),
      priority: 0.8,
    });
  }

  // Deduplicado final
  const seen = new Set();
  const unique = urls.filter((x) => {
    if (seen.has(x.url)) return false;
    seen.add(x.url);
    return true;
  });

  return unique;
}
