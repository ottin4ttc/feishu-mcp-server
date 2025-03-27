import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  banner: ({ format }) => {
    if (format === 'esm')
      return {
        js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
      };
    return {};
  },
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: true,
  dts: true,
  noExternal: [
    '@modelcontextprotocol/sdk',
    'axios',
    'dotenv',
    'qs',
    'tslib',
    'winston',
    'yargs',
    'zod',
    'fastify',
    '@fastify/cors',
  ],
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env.VERSION': '"0.0.1"',
  },
});
