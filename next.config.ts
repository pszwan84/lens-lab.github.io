import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/lens-lab.github.io',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
