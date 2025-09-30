/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  transpilePackages: [],

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "sholiserver-djeya2geetgxbqde.westus-01.azurewebsites.net",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "7256",
        pathname: "/**",
      },
    ],
  },

  async headers() {
    return [
      {
        // imágenes optimizadas por next/image
        source: "/_next/image(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, must-revalidate",
          },
        ],
      },
      {
        // imágenes servidas desde /public/imagenes
        source: "/imagenes/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, must-revalidate",
          },
        ],
      },
    ];
  },

  reactStrictMode: false,

  // ⚡️ Optimización: solo importa el ícono que uses de lucide-react
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{member}}",
    },
  },
};

module.exports = nextConfig;
