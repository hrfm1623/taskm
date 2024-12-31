/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  distDir: ".next",
  experimental: {},
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
