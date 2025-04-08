import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    ppr: true,
    dynamicIO: true,
  },
};

export default nextConfig;
