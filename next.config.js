/** @type {import('next').NextConfig} */

const nextConfig = {
  transpilePackages: [],
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.0.113',
        port: '5681', // si estás usando un puerto específico
        pathname: '/**', // para aceptar todas las rutas
      },
    ],
  },
  reactStrictMode: false,
};

module.exports = nextConfig;