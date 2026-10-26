/**
 * SnIcon registry — module-level lookup for icon components keyed by
 * string name. Lives in its own module so the `<script setup>` block of
 * SnIcon.vue stays free of `export` declarations (which the Vue SFC
 * compiler does not allow inside `<script setup>`).
 *
 * This module also owns the `IconComponent` / `IconComponentProps`
 * type contract that SnIcon.vue consumes. Keeping the contract here
 * (not in SnIcon.vue) breaks the would-be circular import — the Vue
 * file only needs types from us, we don't import from it.
 *
 * Consumers populate the registry at app bootstrap:
 *
 *   import { ChevronRight, Settings, Search } from 'lucide-vue-next'
 *   import { registerSnIcons } from '@snui/vue-web'
 *   registerSnIcons({ ChevronRight, Settings, Search })
 *
 * The named import statement above is the tree-shaking contract: only
 * the three referenced icons end up in the production chunk, even though
 * the registry is keyed by string. See SnIcon.vue for the full rationale.
 *
 * See: https://lucide.dev/guide/packages/lucide-vue-next
 */

import type { FunctionalComponent } from 'vue'

/**
 * Icon component contract — every prop is optional because not every
 * icon library exposes all of them. The component just renders the SVG;
 * SnIcon wraps and forwards the standard props.
 *
 * `exactOptionalPropertyTypes: true` in tsconfig requires `undefined`
 * in the union so consumers can spread `?: ... | undefined` without a
 * TS error.
 *
 * The component is loosely typed as `FunctionalComponent<Record<string,
 * unknown>>` so individual icon libraries (lucide-vue-next uses
 * `size: number`, ionicons5 uses `size?: number | string`, tabler uses
 * `size?: number | string`) can all be passed in. SnIcon only forwards
 * the four props (`size`, `color`, `stroke-width`, `absolute-stroke-width`)
 * via `<component :is>` — Vue silently drops any prop the inner component
 * doesn't declare. Extra `defaultClass` lands via the `<span>` wrapper.
 */
export interface IconComponentProps {
  size?: number | string | undefined
  color?: string | undefined
  strokeWidth?: number | string | undefined
  absoluteStrokeWidth?: boolean | undefined
  defaultClass?: string | undefined
  [key: string]: unknown
}

export type IconComponent = FunctionalComponent<Record<string, unknown>>

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
const iconRegistry: Record<string, IconComponent> = Object.create(null)

/**
 * Register icon components for lookup by string name. Call this once
 * at app bootstrap, passing only the icons you actually use (named
 * imports — never `import * as`). The function is idempotent: calling
 * it again merges new entries into the existing registry, and overwrites
 * a previously registered name.
 */
export function registerSnIcons(map: Record<string, IconComponent>): void {
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
 * registered. Exported so consumers (e.g. a custom SnIcon wrapper)
 * can implement their own resolution logic.
 */
export function resolveIconByName(name: string): IconComponent | undefined {
  return iconRegistry[name]
}