import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['esm'],               
  target: 'node18',
  outDir: 'dist',
  clean: true,
  bundle: true,
  splitting: false,
  sourcemap: true,
  platform: 'node',
  // 👇 Tell tsup NOT to bundle Node.js built‑ins
  external: [
    'events', 'util', 'tty', 'os', 'fs', 'path', 'stream',
    'buffer', 'crypto', 'http', 'https', 'net', 'url',
    'querystring', 'zlib', 'child_process', 'cluster', 'dns',
    'readline', 'string_decoder', 'tls', 'dgram', 'inspector'
  ],
  // Disable auto‑injection of require shims
  shims: false,
  // Keep tree shaking
  treeshake: true,
});