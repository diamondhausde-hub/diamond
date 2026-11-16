import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  // GitHub Pages serves this project at https://<user>.github.io/diamond/
  basePath: "/diamond",
  assetPrefix: "/diamond/",
  images: { unoptimized: true },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
