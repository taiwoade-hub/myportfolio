import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    // Keep the bar high: type errors must fail the build.
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // GitHub avatars — used by the live GitHub section when configured.
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
