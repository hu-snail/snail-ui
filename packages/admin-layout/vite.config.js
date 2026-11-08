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
 * ## One build per entry (ADR-0008: one entry per layout style)
 *
 * Every published entry gets its OWN build:
 *
 *   index            → dist/index.js            + dist/styles/index.css
 *   pro-layout/index → dist/pro-layout/index.js + dist/styles/pro-layout.css
 *   pro-classic/index→ dist/pro-classic/index.js+ dist/styles/pro-classic.css
 *   pro-aurora/index → dist/pro-aurora/index.js + dist/styles/pro-aurora.css
 *   pro-workbench/…  → dist/pro-workbench/…     + dist/styles/pro-workbench.css
 *
 * `scripts/build-entries.mjs` runs them in order (the vite CLI only accepts a
 * single config object; the programmatic `build()` API accepts one config per
 * call). `npm run dev` still points at the default export — the barrel.
 *
 * Why one build per entry instead of several `lib.entry` keys: with several
 * entries in ONE build, Rollup hoists every module they share into a single
 * shared chunk, and that chunk's CSS lands in its own stylesheet — so
 * `layouts/classic/style.css` would silently miss the shared pieces' rules
 * (logo, search, notice, user). One build per entry + `cssCodeSplit: false`
 * gives each entry exactly one stylesheet containing everything that entry can
 * reach, which is what makes
 *
 *   import '@snui/admin-layout/layouts/classic/style.css'
 *
 * self-contained and genuinely on-demand: importing one style never pulls
 * another style's rules. The barrel entry keeps emitting the FULL stylesheet at
 * dist/styles/index.css, so the pre-existing `@snui/admin-layout/styles` import
 * keeps working unchanged.
 *
 * The token layer is NOT re-emitted — a consumer of this package already ships
 * `@snui/vue-web/styles`, which contains @snui/tokens + @snui/tokens-web.
 *
 * Pipeline (per package.json `build`):
 *   1. `node scripts/build-entries.mjs` — emits dist/**.js + dist/styles/**.css
 *   2. `vue-tsc --emitDeclarationOnly`  — emits dist/** d.ts declarations
 */

const srcPath = (relative) => fileURLToPath(new URL(relative, import.meta.url));

/**
 * One single-entry library build.
 *
 * `cssFile` names the one stylesheet this build emits; `entryName` doubles as
 * the JS entry path (`pro-layout/index` → dist/pro-layout/index.js).
 * `emptyOutDir` is true only for the first build — the following ones append to
 * the same dist so every entry survives.
 */
export function layoutEntryConfig({ entry, entryName, cssFile, emptyOutDir }) {
  return defineConfig({
    plugins: [vue()],
    build: {
      target: 'es2022',
      outDir: 'dist',
      emptyOutDir,
      sourcemap: true,
      minify: false,
      // Self-contained stylesheet per entry — see the header note.
      cssCodeSplit: false,
      lib: {
        entry,
        name: 'SnUILayout',
        formats: ['es'],
      },
      rollupOptions: {
        // vue + @snui/vue-web + @snui/echarts stay external: the host app
        // already installs them, and bundling them would duplicate Vue
        // component instances across the app / package boundary (same rule as
        // @snui/templates). `echarts` itself is external too — the host owns
        // its version and module registration (§57), so only the wrapper is
        // imported. Matched by regex to cover `echarts/core` etc.
        external: ['vue', '@snui/vue-web', '@snui/echarts', 'lucide-vue-next', /^echarts(\/|\b)/],
        output: {
          entryFileNames: `${entryName}.js`,
          chunkFileNames: 'chunks/[name]-[hash].js',
          assetFileNames: (info) =>
            info.name !== undefined && info.name.endsWith('.css')
              ? `styles/${cssFile}`
              : 'assets/[name][extname]',
        },
      },
    },
    // @snui/vue-web resolves through the workspace node_modules link to its
    // dist (turbo `dependsOn: ["^build"]` guarantees it exists) — same as
    // @snui/templates. Aliasing it to source would defeat the `external`
    // above and bundle the component library into this package.
  });
}

/** Every published entry, in build order. */
export const layoutEntryConfigs = [
  // 1. Package barrel — every style + every shared piece (and the full stylesheet).
  layoutEntryConfig({
    entry: srcPath('./src/index.ts'),
    entryName: 'index',
    cssFile: 'index.css',
    emptyOutDir: true,
  }),
  // 2. `standard` style — the four-shape shell (side / top / mix / dual).
  layoutEntryConfig({
    entry: srcPath('./src/pro-layout/index.ts'),
    entryName: 'pro-layout/index',
    cssFile: 'pro-layout.css',
    emptyOutDir: false,
  }),
  // 3. `classic` style — grouped sidebar + user card + content header.
  layoutEntryConfig({
    entry: srcPath('./src/pro-classic/index.ts'),
    entryName: 'pro-classic/index',
    cssFile: 'pro-classic.css',
    emptyOutDir: false,
  }),
  // 4. `aurora` style — full-bleed background + top bar + floating rail.
  layoutEntryConfig({
    entry: srcPath('./src/pro-aurora/index.ts'),
    entryName: 'pro-aurora/index',
    cssFile: 'pro-aurora.css',
    emptyOutDir: false,
  }),
  // 5. Workbench — the shared dashboard content every style embeds. Separate
  //    entry on purpose: it pulls @snui/echarts, and hosts that only want a
  //    layout shell must not be forced to ship a chart engine (§81).
  layoutEntryConfig({
    entry: srcPath('./src/pro-workbench/index.ts'),
    entryName: 'pro-workbench/index',
    cssFile: 'pro-workbench.css',
    emptyOutDir: false,
  }),
];

// Default config = the barrel entry, so `vite build` / `vite build --watch`
// (npm run dev) keep working without arguments.
export default layoutEntryConfigs[0];
