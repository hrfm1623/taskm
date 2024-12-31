/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  distDir: ".next",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
