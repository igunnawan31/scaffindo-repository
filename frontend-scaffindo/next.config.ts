import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "chaintrack.id",
	port: "",
        pathname: "/files/**",
      },
    ],
  },
};

export default nextConfig;
