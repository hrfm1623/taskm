/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "export",
  distDir: ".vercel/output/static",
  experimental: {},
};

module.exports = nextConfig;
