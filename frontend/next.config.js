const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // webpack: (config) => {
  //   config.cache = false;
  //   return config;
  // }
};

module.exports = withBundleAnalyzer(nextConfig);
