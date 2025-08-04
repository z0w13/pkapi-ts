import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entryPoints: ['src/**/*.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    minify: false,
    outDir: 'dist/',
    clean: true,
    sourcemap: false,
    bundle: false,
    splitting: false,
    treeshake: false,
    target: 'es2022',
    platform: 'node',
    tsconfig: './tsconfig.json',
    cjsInterop: true,
    keepNames: true,
    skipNodeModulesBundle: false,
  },

])
