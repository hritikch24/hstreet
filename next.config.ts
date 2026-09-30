import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { formats: ['image/avif', 'image/webp'] },
  // A stray lockfile one level up would otherwise be picked as the root.
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
