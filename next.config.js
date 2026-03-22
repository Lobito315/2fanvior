/** @type {import('next').NextConfig} */
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
    // Disable Turbopack to ensure compatibility with OpenNext manifest patching
    turbo: { enabled: false },
    serverExternalPackages: ['@prisma/client'],
  },
  outputFileTracing: true,
};

module.exports = nextConfig;
