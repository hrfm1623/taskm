import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静的エクスポートを無効化
  output: "standalone",
  // Cloudflare Pagesでmiddlewareを使用可能にする
  experimental: {
    runtime: "experimental-edge",
  },
};

if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

export default nextConfig;
