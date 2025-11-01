/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "api.prodiplan.id",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
    ],
  },
};

module.exports = nextConfig;
