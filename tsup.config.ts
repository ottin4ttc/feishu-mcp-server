import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: true,
  noExternal: ['@modelcontextprotocol/sdk', 'zod', 'axios', 'tslib', 'dotenv'],
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env.VERSION': '"0.0.1"',
  },
});
