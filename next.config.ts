import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/arc-scrap',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
