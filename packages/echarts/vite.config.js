import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

/**
 * vite build config for @snui/echarts.
 *
 * Mirrors packages/layout/vite.config.js: vite (not vue-tsc) runs the build
 * because only @vue/compiler-sfc substitutes the `<script setup>` macros into
 * runtime calls.
 *
 * Two entries:
 *   index.ts — Vue layer (SnChart + install plugin + resolver helpers)
 *   core.ts  — framework-agnostic layer (theme / layout presets / icon
 *              registry / tooltip builder / option merge). Importable from a
 *              non-Vue host or a Node-side chart-option generator without
 *              pulling Vue in.
 *
 * Externals:
 *   - vue / @snui/vue-web — the host app already installs both (duplicating
 *     them would create two Vue instances across the package boundary);
 *   - echarts (plus every `echarts/*` subpath) — ECharts is a peer
 *     dependency: the host owns the echarts version, the registration of
 *     chart/component modules, and the final bundle size. `^echarts` matches
 *     `echarts/core`, `echarts/charts`, `echarts/components` … so a host
 *     using the tree-shaken modular entry point is supported too.
 *
 * Styles: component scoped CSS lands at dist/styles/index.css
 * (assetFileNames forces the path; same shape as vue-web / layout). The token
 * layer is NOT re-emitted — a consumer of this package already ships
 * `@snui/vue-web/styles`, which contains @snui/tokens + @snui/tokens-web.
 *
 * Pipeline (per package.json `build`):
 *   1. `vite build` — emits dist/index.js + dist/core.js + dist/styles/index.css
 *   2. `vue-tsc --emitDeclarationOnly` — emits dist/** d.ts declarations
 */

export default defineConfig({
  plugins: [vue()],
  build: {
    target: 'es2022',
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    lib: {
      entry: {
        index: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
        core: fileURLToPath(new URL('./src/core.ts', import.meta.url)),
      },
      name: 'SnUIECharts',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', '@snui/vue-web', /^echarts(\/|\b)/],
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: (info) => {
          if (info.name && info.name.endsWith('.css')) return 'styles/index.css';
          return 'assets/[name][extname]';
        },
      },
    },
  },
});
