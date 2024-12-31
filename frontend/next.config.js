/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "export",
  distDir: ".vercel/output/static",
  experimental: {
    runtime: "edge",
  },
};

module.exports = nextConfig;
