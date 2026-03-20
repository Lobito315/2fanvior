/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }]
  },
  async redirects() {
    return [
      { source: "/dashboard", destination: "/creator/dashboard", permanent: true },
      { source: "/upload", destination: "/creator/upload", permanent: true },
      { source: "/tiers", destination: "/creator/tiers", permanent: true }
    ];
  }
};

export default nextConfig;
