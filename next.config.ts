import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-auth"],
  cacheComponents: true,
  experimental: {
  },
};

export default nextConfig;
