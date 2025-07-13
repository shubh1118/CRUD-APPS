import type { NextConfig } from "next";

// next.config.js
module.exports = {
  images: {
    domains: ["source.unsplash.com"], // allow this domain for next/image
  },
};

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
};

export default nextConfig;
