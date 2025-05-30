import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'flagcdn.com',
    }]
  },
  logging: {
    fetches: {
      fullUrl: true
    }
  },
  experimental: {
    optimisticClientCache: false,
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
    ppr: true,
    dynamicIO: true
  },
};

export default nextConfig;
