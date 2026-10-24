/**
 * Demo dock store — the coordination layer between `Demo.vue` (one instance
 * per demo section) and `DemoDock.vue` (one instance per page).
 *
 * ## Why module state instead of provide/inject or props
 *
 * The demos are mounted by the VitePress markdown pipeline: a page's `<Demo>`
 * tags are compiled into components that the markdown renderer mounts, and
 * `DemoDock` is mounted separately through the theme's `doc-after` slot. There
 * is no shared Vue parent we can pass props through, and the demos are
 * registered globally (see theme/index.ts), so neither props nor inject can
 * reach across that boundary.
 *
 * A module-level reactive store is the standard answer for this shape: the
 * page is a single client-side route, the store is reset on every route change
 * (see `resetDock`), and there is no SSR data-leak concern because the store
 * only ever holds the current page's demo names.
 *
 * ## Lifecycle contract
 *
 * 1. `DemoDock` mounts → calls `setDockOpen(true)` for uni routes
 * 2. each `Demo` mounts → `registerDemo({ name, label, description })`
 * 3. the first registered demo becomes `active` if none is set
 * 4. `Demo` renders inline unless `active === its own name`
 * 5. the dock renders the active demo into its host node
 * 6. route change → `resetDock()` clears entries and re-seeds `open`
 *
 * Step 4 is what keeps exactly one device frame on screen: the dock is a
 * single host, so only the selected demo is mounted there; the others fall
 * back to inline rendering (which is also the narrow-viewport behaviour).
 */

import { reactive } from 'vue'

export interface DockEntry {
  /** Demo file basename, e.g. `tag-mp-basic`. Unique per page. */
  name: string
  /** Short label for the dock's section switcher. */
  label: string
  /** Optional one-line description shown under the preview. */
  description: string
}

export interface DockState {
  /** Whether the dock should render at all (uni page + wide viewport + open). */
  open: boolean
  /** Name of the demo currently shown in the dock. Empty = none. */
  active: string
  /** Every demo on the current page, in mount order (= document order). */
  entries: DockEntry[]
}

export const dockState = reactive<DockState>({
  open: false,
  active: '',
  entries: [],
})

/** Register a demo with the dock. Idempotent per name. */
export function registerDemo(entry: DockEntry): void {
  const existing = dockState.entries.find((e) => e.name === entry.name)
  if (existing !== undefined) {
    existing.label = entry.label
    existing.description = entry.description
    return
  }
  dockState.entries.push({ ...entry })
  // First demo on the page claims the preview slot; later ones only take it
  // over when the reader picks them.
  if (dockState.active === '') dockState.active = entry.name
}

/** Unregister a demo (route change or unmount). */
export function unregisterDemo(name: string): void {
  dockState.entries = dockState.entries.filter((e) => e.name !== name)
  if (dockState.active === name) {
    dockState.active = dockState.entries[0]?.name ?? ''
  }
}

/** Pick which demo the dock shows. */
export function setActive(name: string): void {
  dockState.active = name
}

/** Open / close the dock (the close button and the viewport guard use this). */
export function setDockOpen(open: boolean): void {
  dockState.open = open
}

/**
 * Clear every entry. Called on route change so a page never inherits the
 * previous page's demo list (which would leave stale section tabs behind).
 */
export function resetDock(): void {
  dockState.entries = []
  dockState.active = ''
}
