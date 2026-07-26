import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    // ponytail: pin root — a package.json in $HOME makes Next infer the wrong
    // workspace root and resolve a second React copy from ~/node_modules
    root: __dirname,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
