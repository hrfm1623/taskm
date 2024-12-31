/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  distDir: ".next",
  experimental: {},
  images: {
    unoptimized: true,
  },
  compress: true,
  webpack: (config, { isServer }) => {
    // プロダクションビルドの最適化
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        maxInitialRequests: 25,
        minSize: 20000,
        maxSize: 24000000, // 24MB未満に制限
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: "commons",
            chunks: "all",
            minChunks: 2,
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];
              return `npm.${packageName.replace("@", "")}`;
            },
            chunks: "all",
          },
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;
