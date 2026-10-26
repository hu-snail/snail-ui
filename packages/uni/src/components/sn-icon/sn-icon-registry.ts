/**
 * sn-icon registry — module-level lookup for icon data objects keyed by
 * string name. Lives in its own module so the `<script setup>` block of
 * sn-icon.vue stays free of `export` declarations (which the Vue SFC
 * compiler does not allow inside `<script setup>`).
 *
 * ## Why a separate registry on uni-end (AUI-MP-002 follow-up)
 *
 * The web-end `SnIcon` accepts a Vue component (e.g. lucide-vue-next)
 * and the registry stores components. uni-end icons ship as plain data
 * (`IconData` objects — `{ viewBox, paths[] }`) and the registry stores
 * data. Both registries share the same public API contract
 * (`registerSnIcons` / `clearSnIcons` / `resolveIconByName`) so
 * SnButton can stay symmetric across ends.
 *
 * Consumers populate the registry at app bootstrap:
 *
 *   import { ChevronRight, Search } from '@snui/uni'
 *   import { registerSnIcons } from '@snui/uni'
 *   registerSnIcons({ ChevronRight, Search })
 *
 * The named import statements above are the tree-shaking contract: only
 * the two referenced icons end up in the production chunk.
 *
 * See: https://lucide.dev/icons
 */

import type { IconData } from './sn-icon.vue'

/**
 * Module-level registry. Plain object so `Object.create(null)` keeps the
 * prototype clean (no inherited Object keys to worry about).
 *
 * Module state is acceptable here:
 *   - the docs site and most apps are SPAs
 *   - the registry is write-once at app bootstrap
 *   - there's no SSR data-leak concern because every icon name is
 *     statically resolvable from the source code
 *
 * If SSR / multi-tenant safety ever becomes a requirement, switch the
 * implementation to a `provide` / `inject` key on the root app instance
 * (the public API does not need to change).
 */
const iconRegistry: Record<string, IconData> = Object.create(null)

/**
 * Register icon data objects for lookup by string name. Call this once
 * at app bootstrap, passing only the icons you actually use (named
 * imports — never `import * as`). The function is idempotent: calling
 * it again merges new entries into the existing registry, and overwrites
 * a previously registered name.
 */
export function registerSnIcons(map: Record<string, IconData>): void {
  for (const key in map) {
    iconRegistry[key] = map[key]!
  }
}

/**
 * Clear the icon registry. Intended for tests; rarely useful in app
 * code because icons are write-once at bootstrap.
 */
export function clearSnIcons(): void {
  for (const key in iconRegistry) {
    delete iconRegistry[key]
  }
}

/**
 * Look up an icon by name. Returns `undefined` if the icon is not
 * registered. Exported so consumers (e.g. a custom sn-icon wrapper)
 * can implement their own resolution logic.
 */
export function resolveIconByName(name: string): IconData | undefined {
  return iconRegistry[name]
}