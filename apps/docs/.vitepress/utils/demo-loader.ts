/**
 * Demo loader — resolves a demo file name to an async Vue component.
 *
 * ## Why this is a shared module
 *
 * Two components need to render demo bodies:
 *
 *   - `Demo.vue`    — the inline preview on web pages, and the inline fallback
 *                     on uni pages when the dock is unavailable
 *   - `DemoDock.vue` — the fixed device preview on uni pages
 *
 * Duplicating the `import.meta.glob` tables would double the build-time
 * metadata and, worse, let the two copies drift (one resolving the English
 * shadow, the other not).
 *
 * ## Bilingual resolution
 *
 * The English site prefers `demo-en/<name>.vue` and falls back to the Chinese
 * demo. Shadow files are ordinary sources, so the code panel always matches
 * what is rendered (naive-ui's docs use the same shape).
 *
 * ## Why `import.meta.glob` and not a dynamic path
 *
 * A fully dynamic `import('../demo/' + name)` is not statically analysable, so
 * Vite cannot split the demos into chunks and every page would pull the entire
 * demo corpus. `import.meta.glob` gives one lazily-imported chunk per demo.
 */

import { defineAsyncComponent, h, type Component } from 'vue'

const demoModules = {
  ...import.meta.glob('../demo/*.vue'),
  ...import.meta.glob('../demo-en/*.vue'),
}

/**
 * Resolve the demo module for a name, honouring the site language.
 *
 * Returns `undefined` when neither the English shadow nor the Chinese demo
 * exists — the caller renders a visible error instead of a blank frame.
 */
function resolveModule(name: string, isEn: boolean): (() => Promise<unknown>) | undefined {
  const enKey = `../demo-en/${name}.vue`
  const zhKey = `../demo/${name}.vue`
  if (isEn && demoModules[enKey] !== undefined) return demoModules[enKey]
  return demoModules[zhKey]
}

/**
 * Build an async component for `name`.
 *
 * `delay: 0` renders the fallback immediately rather than flashing nothing,
 * and a failed chunk load degrades to an inline error card instead of
 * rejecting the whole page's render.
 */
export function loadDemoComponent(name: string, isEn: boolean): Component {
  return defineAsyncComponent({
    loader: () => {
      const mod = resolveModule(name, isEn)
      if (mod === undefined) {
        return Promise.resolve({
          render: () => h('div', { class: 'sn-demo-error' }, `demo not found: ${name}`),
        })
      }
      return mod()
        .then((m: { default: unknown }) => m as { default: Component })
        .catch((err: unknown) => {
          // eslint-disable-next-line no-console
          console.error(`[Demo] failed to load ${name}:`, err)
          return {
            render: () =>
              h('div', { class: 'sn-demo-error' }, `demo failed to load: ${name}`),
          }
        })
    },
    delay: 0,
  })
}

/**
 * List the uni demo names of one component, e.g. `paging` →
 * `['paging-mp-app', 'paging-mp-basic', …]`. Powers the preview route's
 * scenario switcher; sorted so the chip order is stable across builds.
 */
export function listMpDemoNames(comp: string): string[] {
  const prefix = `../demo/${comp}-mp`
  return Object.keys(demoModules)
    .filter((key) => key.startsWith(prefix))
    .map((key) => key.slice('../demo/'.length).replace(/\.vue$/, ''))
    .sort()
}

/** Raw source of a demo file (for the code panel), preferring the English shadow. */
type RawModule = string

const sourceModules = {
  ...import.meta.glob<RawModule>('../demo/*.vue', {
    query: '?raw',
    import: 'default',
    eager: true,
  }),
  ...import.meta.glob<RawModule>('../demo-en/*.vue', {
    query: '?raw',
    import: 'default',
    eager: true,
  }),
}

/**
 * Look up the raw source of `name`.
 *
 * `import.meta.glob`'s key shape is build-dependent (it may or may not carry
 * the `?raw` suffix), so match by filename suffix rather than a literal key.
 */
export function loadDemoSource(name: string, isEn: boolean): string {
  const enBase = `/demo-en/${name}.vue`
  const zhBase = `/demo/${name}.vue`
  const keys = Object.keys(sourceModules)
  const pick = (base: string): string | undefined =>
    keys.find((k) => k.endsWith(base) || k.endsWith(`${base}?raw`))

  const key = (isEn ? pick(enBase) : undefined) ?? pick(zhBase)
  if (key !== undefined) {
    const mod = sourceModules[key]
    if (typeof mod === 'string') return mod
  }
  return `// Demo source not found: ${name}`
}
