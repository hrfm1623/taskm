/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  distDir: ".next",
  output: "standalone",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
