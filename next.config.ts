import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return {
      // afterFiles rewrites only apply when no static file matches,
      // so videos/images in public/uploads/ are served directly (fast)
      // and only missing files fall through to the API route
      afterFiles: [
        {
          source: '/uploads/:path*',
          destination: '/api/uploads/:path*',
        },
      ],
    }
  },
};

export default nextConfig;
