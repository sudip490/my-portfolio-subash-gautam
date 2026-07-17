import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    /* Pin the workspace root to this project. Without it, Turbopack walks up
       looking for a lockfile, finds a stray ~/package-lock.json, and infers
       /home/subash as the root — widening filesystem watching to the whole
       home directory. */
    root: path.join(__dirname),
  },
};

export default nextConfig;
