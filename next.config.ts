import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pins the workspace root to this project so Turbopack doesn't get
  // confused by an unrelated lockfile further up the filesystem tree.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
