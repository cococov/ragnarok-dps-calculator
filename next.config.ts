import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "browiki.org",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
