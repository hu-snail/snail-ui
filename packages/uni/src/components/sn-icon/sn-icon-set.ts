/**
 * sn-icon shortcut data set — ~20 commonly-used lucide icons as frozen
 * ESM exports. Each export is a tiny standalone module; consumers named-
 * import only the icons they actually use, and Rollup / esbuild tree-
 * shake the rest out of the bundle.
 *
 *   import { ChevronRight, Search, Settings } from '@snui/uni'
 *   // → bundle contains only ChevronRight, Search, Settings SVG paths
 *
 * For a larger catalogue consumers should add their own icon pack under
 * `src/components/sn-icon/icons/` (one file per icon, named export of
 * a frozen `IconData`). This file is intentionally small to keep the
 * default bundle lean.
 *
 * Paths are taken from https://lucide.dev/icons — see
 * https://lucide.dev/license (ISC) for redistribution terms. Lucide is
 * a community fork of Feather Icons.
 */

import type { IconData } from './sn-icon.vue'

const d = (paths: string[], viewBox?: string): IconData => ({
  viewBox: viewBox ?? '0 0 24 24',
  paths,
})

export const ChevronRight = d(['m9 18 6-6-6-6'])
export const ChevronLeft = d(['m15 18-6-6 6-6'])
export const ChevronDown = d(['m6 9 6 6 6-6'])
export const ChevronUp = d(['m18 15-6-6-6 6'])
export const ArrowRight = d(['M5 12h14', 'm12 5 7 7-7 7'])
export const ArrowLeft = d(['M19 12H5', 'm12 19-7-7 7-7'])
export const Check = d(['M20 6 9 17l-5-5'])
export const X = d(['M18 6 6 18', 'm6 6 12 12'])
export const Plus = d(['M5 12h14', 'M12 5v14'])
export const Minus = d(['M5 12h14'])
export const Search = d([
  '<circle cx="11" cy="11" r="8" />',
  'm21 21-4.3-4.3',
])
export const Settings = d([
  'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.42l-.22.38a2 2 0 0 0 .42 2.73l.15.1a2 2 0 0 1 1 1.73v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.42 2.73l.22.38a2 2 0 0 0 2.73.42l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.42l.22-.39a2 2 0 0 0-.42-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .42-2.73l-.22-.38a2 2 0 0 0-2.73-.42l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z',
  '<circle cx="12" cy="12" r="3" />',
])
export const User = d([
  '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />',
  '<circle cx="12" cy="7" r="4" />',
])
export const Bell = d([
  'M10.268 21a2 2 0 0 0 3.464 0',
  'M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326',
])
export const Home = d([
  'm3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  '<polyline points="9 22 9 12 15 12 15 22" />',
])
export const Heart = d([
  'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z',
])
export const Star = d([
  '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 12 14.14 22 9.27 15.09 8.26 12 2" />',
])
export const Trash = d([
  'M3 6h18',
  'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6',
  'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
])
export const Edit = d([
  'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7',
  'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
])
export const Download = d(['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M7 10l5 5 5-5', 'M12 15V3'])
export const Upload = d(['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M17 8l-5-5-5 5', 'M12 3v12'])
export const Menu = d(['M4 4h16', 'M4 12h16', 'M4 20h16'])
export const MoreHorizontal = d(['M12 13v.01', 'M19 13v.01', 'M5 13v.01'])

/**
 * Total export surface intentionally kept small (~22 icons). Adding
 * more should be done file-per-icon (see module header) so each new
 * icon is a separate ESM module and tree-shakable on its own. If the
 * demand grows, we can also ship a `@snui/uni/icons` sub-path with a
 * bigger catalog.
 */