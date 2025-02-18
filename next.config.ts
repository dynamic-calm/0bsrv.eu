import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.geojson$/,
      type: "json",
    });
    return config;
  },
};

export default nextConfig;
