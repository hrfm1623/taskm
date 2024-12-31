/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  distDir: ".next",
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["@heroicons/react", "@radix-ui/react-icons"],
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};

module.exports = nextConfig;
