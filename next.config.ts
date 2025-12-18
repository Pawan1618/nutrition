import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // images: { unoptimized: true },
  reactCompiler: true,
};

export default nextConfig;

