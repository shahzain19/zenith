import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["lucide-react"],
  // @ts-ignore - Next.js 15/16 specific config for Turbopack root
  turbopack: {
    root: ".",
  },
};

export default nextConfig;
