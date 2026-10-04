import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

/**
 * vite build config for @snui/vue-web (active build, replaces vue-tsc).
 *
 * Why we switched from vue-tsc to vite (AUI-FOUND-007 follow-up):
 *   - vue-tsc does NOT compile Vue SFCs — it only emits .d.ts declarations
 *     for the `<script setup lang="ts">` block. The emitted dist/*.vue.js
 *     files still contain raw compile-time macros (defineOptions,
 *     defineProps, withDefaults, defineEmits, defineSlots), and at the end
 *     of each file emit `export default {};` (an empty object, with no
 *     runtime macro substitution). Any ESM consumer (browser, vite
 *     optimizeDeps, downstream bundlers) loading these files crashed with
 *     `defineOptions is not defined`.
 *   - vite with @vitejs/plugin-vue runs `@vue/compiler-sfc` which actually
 *     transforms `<script setup>` macros into runtime calls. This is what
 *     library consumers expect.
 *
 * Pipeline (per package.json `build`):
 *   1. `vite build` — emits dist/index.js (lib ESM, all components inlined)
 *                     + sourcemap
 *   2. `vue-tsc --emitDeclarationOnly` — emits dist/index.d.ts + per-file
 *                                        .vue.d.ts (type-only)
 *   3. `node ./scripts/copy-styles.mjs` — copies src/styles/index.css →
 *                                          dist/styles/index.css (the
 *                                          `@snui/vue-web/styles` export)
 *
 * Output layout (consumed via package.json `exports` field):
 *   .                   → dist/index.js           (entry — SnButton, etc.)
 *   ./resolver          → dist/resolver.js        (unplugin-vue-components)
 *   ./styles            → dist/styles/index.css   (global token CSS)
 */

export default defineConfig({
  plugins: [vue()],
  build: {
    target: 'es2022',
    outDir: 'dist',
    emptyOutDir: false,
    sourcemap: true,
    minify: false,
    lib: {
      // Multi-entry: index.ts (SnButton etc.) + resolver.ts (SnUIResolver).
      // Vite emits dist/index.js + dist/resolver.js — matches the
      // package.json `exports` field (`./` and `./resolver`).
      entry: {
        index: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
        resolver: fileURLToPath(new URL('./src/resolver.ts', import.meta.url)),
      },
      name: 'SnUIWeb',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', '@snui/tokens', '@snui/tokens-web'],
      output: {
        // Each entry becomes a single ESM file (no per-component .vue.js
        // leaks). per-component `.d.ts` comes from the separate
        // vue-tsc --emitDeclarationOnly step.
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        // Component scoped CSS lands at dist/styles/index.css (instead of
        // dist/vue-web.css). copy-styles.mjs runs after and APPENDS the
        // global token CSS from src/styles/index.css onto the same file
        // so consumers get one `@snui/vue-web/styles` entry.
        assetFileNames: (info) => {
          // vite names extracted CSS after the chunk it came from (e.g.
          // `vue-web.css` for the shared chunk), but we want a single
          // canonical barrel at dist/styles/index.css. Force all CSS to
          // that path; non-CSS assets fall through to assets/[name][ext].
          if (info.name && info.name.endsWith('.css')) return 'styles/index.css'
          return 'assets/[name][extname]'
        },
      },
    },
  },
  resolve: {
    alias: {
      '@snui/tokens': fileURLToPath(new URL('../tokens/src/index.ts', import.meta.url)),
    },
  },
})