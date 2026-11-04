import type { NextConfig } from "next";

const isGhPages = process.env.GITHUB_PAGES === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "standalone",
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  typescript: {
    // Keep the bar high: type errors must fail the build.
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  images: {
    unoptimized: isGhPages,
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
