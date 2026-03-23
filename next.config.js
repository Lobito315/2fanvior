/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      }
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  // Only apply assetPrefix in production (Cloudflare Pages).
  // In local dev this would break CSS/JS loading.
  assetPrefix: isProd ? '/assets' : undefined,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    return config;
  },
};


module.exports = nextConfig;
