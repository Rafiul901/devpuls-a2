import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"], // Use only ESM for Vercel
  target: "node18", // Match Vercel's Node.js version
  outDir: "dist",
  clean: true,
  bundle: true,
  splitting: false,
  sourcemap: false, // Turn off for production
  minify: true, // Add minification
  platform: "node",
  noExternal: [/.*/], // Bundle all dependencies
  external: [], // No externals for serverless
});