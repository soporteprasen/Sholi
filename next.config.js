/** @type {import('next').NextConfig} */

const nextConfig = {
  transpilePackages: [],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sholiserver-djeya2geetgxbqde.westus-01.azurewebsites.net',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
