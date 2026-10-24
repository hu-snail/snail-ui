import { fileURLToPath, URL } from 'node:url'
import type { Plugin } from 'vite'

/**
 * Convert uni-app `rpx` (responsive pixel) units to browser `px` units so that
 * uni-end component styles render correctly in the docs preview.
 *
 * ## Why
 *
 * uni-app uses `rpx` as a cross-device sizing unit. The mapping is
 *   `1rpx = viewport-width / 750 px`
 * The standard 750rpx design width maps to a 375px viewport → `1rpx = 0.5px`.
 *
 * Browser CSS parsers do NOT recognize `rpx`. Any property whose value
 * contains an `rpx` token is dropped (the property falls back to its
 * initial value). This breaks every geometric property — padding, border,
 * border-radius, font-size, height, gap, margin — in uni-end components like
 * `SnButton` / `SnDivider`. Colors (`var(--sn-mp-color-*)`) keep working
 * because CSS variables are independent of length units, so docs demos
 * render the right colors but with no box model.
 *
 * We must not edit the uni package source SFCs to switch `rpx` to `px`,
 * because the whole point of `rpx` is to scale correctly on real devices
 * (iOS / Android / 微信小程序), and removing it there would break the
 * canonical cross-end artifact. The conversion belongs in the docs preview.
 *
 * ## Scope
 *
 * We must hook TWO file id shapes:
 *
 *   1. `@snui/uni/dist/styles/index.css` — the package barrel CSS imported
 *      via `import '@snui/uni/styles'` in theme/index.ts. The dist build
 *      already concatenates vite-extracted scoped CSS, so the file contains
 *      all uni component CSS in one place.
 *
 *   2. SFC scoped style emitted by vite-plugin-vue when docs demos import
 *      via `@snui/uni-src` (the alias to `packages/uni/src`). Each request
 *      triggers a fresh SFC compile; the emitted style id is something like
 *      `/Volumes/JZ-miniGo/.../packages/uni/src/components/sn-button/
 *       sn-button.vue?vue&type=style&index=0&scoped=true&lang.css` —
 *      this id does NOT contain `@snui/uni` (it carries the resolved
 *      absolute path), so we filter by the package's source path too.
 *
 * The `@snui/vue-web` package is on purpose NOT matched: it already uses
 * `px` / `rem`, and accidentally transforming web CSS could break layout
 * if a number happens to be followed by `rpx` as a substring.
 *
 * The 0.5 ratio is the standard 750rpx → 375px mapping. Docs preview is
 * always rendered in a browser viewport of 375px CSS width or wider; the
 * ratio stays accurate at any width because rpx is meant to be a constant
 * pixel ratio anyway (uni-app's rpx adapts on real devices via runtime
 * viewport-width detection, which the browser preview approximates with
 * the fixed 0.5 ratio).
 *
 * ## Idempotency
 *
 * Numeric token regex is `(number)rpx\b`. Free-text mentions like
 * `use rpx (px × 2...)` are NOT matched (no preceding digits).
 * Comments like `1px = 2rpx` will have the `2rpx` portion collapsed to
 * `1px`, which is harmless (the comment is purely descriptive).
 */

/**
 * Collapse every `<number>rpx` token to its `px` equivalent (0.5 ratio).
 *
 * Exported so the same rule is testable on its own and so the `transform` /
 * `generateBundle` hooks share one implementation — the two paths must never
 * disagree about the ratio.
 */
export function convertRpx(code: string): string {
  return code.replace(
    /(-?\d+(?:\.\d+)?)rpx\b/g,
    (_match, raw: string) => `${parseFloat(raw) * 0.5}px`,
  )
}
export function rpxTransform(): Plugin {
  // Absolute path of the uni package source (matches @snui/uni-src alias
  // resolution). Used as a stable filter anchor in addition to the
  // package name so workers don't need to recompute the path each time.
  // Path is anchored from THIS file's URL (apps/docs/.vitepress/utils/),
  // so 4 `..` steps walk back to the monorepo root before descending into
  // packages/uni/src. One `..` fewer lands inside apps/packages, which
  // doesn't exist — that bug shipped in commit 0622e1e and caused the
  // source-import path to be silently skipped.
  const uniSrcAbsPath = fileURLToPath(new URL('../../../../packages/uni/src', import.meta.url))
  // @snui/templates ships uni-end templates whose own CSS carries rpx
  // literals; they need the same conversion or the demo renders unstyled.
  const templatesSrcAbsPath = fileURLToPath(
    new URL('../../../../packages/templates/src/uni', import.meta.url),
  )
  // The demo files themselves are part of the uni-end preview surface: their
  // scoped `<style>` blocks are written in rpx (mobile rhythm — a 16rpx gap
  // is the uni-app equivalent of 8px). Without this anchor the demo wrapper
  // CSS keeps its `rpx` units, the browser drops every geometric declaration,
  // and a demo that is supposed to be a flex column renders as a run-on line
  // even though the components inside it are styled correctly.
  const demoAbsPath = fileURLToPath(new URL('../../demo', import.meta.url))
  const demoEnAbsPath = fileURLToPath(new URL('../../demo-en', import.meta.url))
  return {
    name: 'snui-rpx-to-px',
    enforce: 'post',
    transform(code, id) {
      // Match any of:
      //   - `@snui/uni` package import (resolved by vite to the dist barrel)
      //   - SFC scoped CSS emitted from `packages/uni/src` (the
      //     `@snui/uni-src` alias path) — id is the absolute file path
      //   - Direct file fetch of `packages/uni/dist/...` — vite dev
      //     serves the dist barrel via `/@fs/<abs-path>` and the plugin
      //     sees the bare absolute path
      // The trailing slash on the source / dist paths is required so
      // packages/unii/... or similar names don't accidentally match.
      //
      // The two demo anchors are directory prefixes, so the trailing slash is
      // what keeps `demo-en/` from also matching the `demo/` anchor.
      if (
        !id.includes('@snui/uni') &&
        !id.includes(`${uniSrcAbsPath}/`) &&
        !id.includes(`${templatesSrcAbsPath}/`) &&
        !id.includes('/packages/uni/dist/') &&
        !id.includes(`${demoAbsPath}/`) &&
        !id.includes(`${demoEnAbsPath}/`)
      ) {
        return
      }
      const transformed = convertRpx(code)
      if (transformed === code) return
      return { code: transformed, map: null }
    },
    /**
     * Production CSS pass.
     *
     * `transform` alone is not enough for a build: vite routes every extracted
     * stylesheet through its own CSS pipeline (postcss → minify) and the
     * scoped-SFC style modules never reach this plugin's `transform` hook in
     * that path. The result was a `vitepress build` whose CSS still carried
     * ~670 `rpx` tokens — the browser drops every one of them, so the
     * *published* site rendered uni components with no padding / radius /
     * height while `vitepress dev` looked correct.
     *
     * `generateBundle` runs after all CSS has been concatenated into the final
     * asset, which is the last point where the conversion can still happen.
     * Only `.css` assets are touched; JS chunks are left alone.
     */
    generateBundle(_options, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type !== 'asset') continue
        if (!file.fileName.endsWith('.css')) continue
        const source = typeof file.source === 'string'
          ? file.source
          : Buffer.from(file.source).toString('utf8')
        const converted = convertRpx(source)
        if (converted !== source) file.source = converted
      }
    },
  }
}
