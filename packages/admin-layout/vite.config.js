import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

/**
 * vite build config for @snui/admin-layout.
 *
 * Mirrors packages/vue-web/vite.config.js — vite (not vue-tsc) runs the build
 * because only @vue/compiler-sfc substitutes the `<script setup>` macros
 * (defineOptions / defineProps / withDefaults / defineEmits) into runtime
 * calls. Emitting raw macro source would crash every ESM consumer.
 *
 * Single entry: the package IS one product (the admin shell), so unlike
 * @snui/templates there is no per-piece subpath story — a consumer imports
 * the barrel and tree-shaking keeps only the pieces it uses (all four
 * components are usually mounted together anyway).
 *
 * Styles: component scoped CSS lands at dist/styles/index.css
 * (assetFileNames forces the path; same shape as vue-web). The token layer
 * is NOT re-emitted — a consumer of this package already ships
 * `@snui/vue-web/styles`, which contains @snui/tokens + @snui/tokens-web.
 * This barrel carries layout-shell classes only.
 *
 * Pipeline (per package.json `build`):
 *   1. `vite build` — emits dist/index.js + dist/styles/index.css
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
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'SnUILayout',
      formats: ['es'],
    },
    rollupOptions: {
      // vue + @snui/vue-web stay external: the host app already installs
      // both, and bundling them would duplicate Vue component instances
      // across the app / package boundary (same rule as @snui/templates).
      external: ['vue', '@snui/vue-web', 'lucide-vue-next'],
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
  // @snui/vue-web resolves through the workspace node_modules link to its
  // dist (turbo `dependsOn: ["^build"]` guarantees it exists) — same as
  // @snui/templates. Aliasing it to source would defeat the `external`
  // above and bundle the component library into this package.
});
