import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
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
    return [
      {
        // Redirect old /uploads/* URLs to the API route
        source: '/uploads/:path*',
        destination: '/api/uploads/:path*',
      },
    ]
  },
};

export default nextConfig;
