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
      {
        protocol: "https",
        hostname: "irowiki.org",
        pathname: "/w/images/**",
      },
    ],
  },
};

export default nextConfig;
