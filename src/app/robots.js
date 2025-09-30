export default function robots() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        disallow: ["/admin", "/*?*buscar="],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
