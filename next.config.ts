import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Browser tests and local previews also use the numeric loopback address.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
