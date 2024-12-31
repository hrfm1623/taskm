/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["@heroicons/react", "@radix-ui/react-icons"],
  },
};

module.exports = nextConfig;
