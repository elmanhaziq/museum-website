import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/museum-website",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;