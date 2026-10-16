/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["@paper-design/shaders"],
};

module.exports = nextConfig;
