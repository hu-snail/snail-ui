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

import type { IconData } from './sn-icon.vue';

const d = (paths: string[], viewBox?: string): IconData => ({
  viewBox: viewBox ?? '0 0 24 24',
  paths,
});

export const ChevronRight = d(['m9 18 6-6-6-6']);
export const ChevronLeft = d(['m15 18-6-6 6-6']);
export const ChevronDown = d(['m6 9 6 6 6-6']);
export const ChevronUp = d(['m18 15-6-6-6 6']);
export const ArrowRight = d(['M5 12h14', 'm12 5 7 7-7 7']);
export const ArrowLeft = d(['M19 12H5', 'm12 19-7-7 7-7']);
export const Check = d(['M20 6 9 17l-5-5']);
export const X = d(['M18 6 6 18', 'm6 6 12 12']);
export const RefreshCw = d([
  'M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8',
  'M21 3v5h-5',
  'M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16',
  'M8 16H3v5',
]);
export const Plus = d(['M5 12h14', 'M12 5v14']);
export const Minus = d(['M5 12h14']);
export const Search = d(['M11 3a8 8 0 1 0 0 16 8 8 0 1 0 0-16', 'm21 21-4.3-4.3']);
export const Settings = d([
  'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.42l-.22.38a2 2 0 0 0 .42 2.73l.15.1a2 2 0 0 1 1 1.73v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.42 2.73l.22.38a2 2 0 0 0 2.73.42l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.42l.22-.39a2 2 0 0 0-.42-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .42-2.73l-.22-.38a2 2 0 0 0-2.73-.42l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z',
  'M12 9a3 3 0 1 0 0 6 3 3 0 1 0 0-6',
]);
export const User = d([
  'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2',
  'M12 3a4 4 0 1 0 0 8 4 4 0 1 0 0-8',
]);
export const Bell = d([
  'M10.268 21a2 2 0 0 0 3.464 0',
  'M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326',
]);
export const Home = d(['m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10']);
export const Heart = d([
  'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z',
]);
export const Star = d([
  'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
]);
export const Trash = d([
  'M3 6h18',
  'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6',
  'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
]);
export const Edit = d([
  'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7',
  'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
]);
export const Download = d([
  'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4',
  'M7 10l5 5 5-5',
  'M12 15V3',
]);
export const Upload = d([
  'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4',
  'M17 8l-5-5-5 5',
  'M12 3v12',
]);
export const Menu = d(['M4 4h16', 'M4 12h16', 'M4 20h16']);
export const MoreHorizontal = d(['M12 13v.01', 'M19 13v.01', 'M5 13v.01']);
/* Password visibility toggle icons (per AGENTS.md §113 — UI icons must
 * come from SnIcon / SnIcon registry; emoji 🙈 / 👁 is forbidden). */
export const Eye = d([
  'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z',
  'M12 9a3 3 0 1 0 0 6 3 3 0 1 0 0-6',
]);
export const EyeOff = d([
  'M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-10-7-10-7a18.45 18.45 0 0 1 4.06-5.94',
  'M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19',
  'M2 2L22 22',
]);

/* ── Extended navigation / list / form icons (still lucide, ISC) ────────────
 * Consumed by cell / collapse / drop-menu / steps / popover / fab / tag demos
 * and component internals. Each export stays a standalone binding so Rollup /
 * esbuild tree-shaking still drops unused ones. */

export const ArrowUp = d(['M12 19V5', 'm5 12 7-7 7 7']);
export const ArrowDown = d(['M12 5v14', 'm19 12-7 7-7-7']);
export const Calendar = d([
  'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  'M8 2v4',
  'M16 2v4',
  'M3 10h18',
]);
export const Clock = d(['M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20', 'M12 6v6l4 2']);
export const MapPin = d([
  'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0',
  'M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
]);
export const Phone = d([
  'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
]);
export const Mail = d([
  'M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z',
  'm22 7-10 6L2 7',
]);
export const MessageCircle = d(['M7.9 20A9 9 0 1 0 4 16.1L2 22z']);
export const Camera = d([
  'M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z',
  'M15 13a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
]);
export const Image = d([
  'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z',
  'M9 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4',
  'm21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21',
]);
export const ShoppingCart = d([
  'M2 3h2l2.66 12.32a2 2 0 0 0 2 1.68h7.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12',
  'M10 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2',
  'M19 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2',
]);
export const ShoppingBag = d([
  'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z',
  'M3 6h18',
  'M16 10a4 4 0 0 1-8 0',
]);
export const CreditCard = d([
  'M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z',
  'M2 11h20',
]);
export const Wallet = d([
  'M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2',
  'M21 9v6h-4a3 3 0 0 1 0-6z',
]);
export const Gift = d([
  'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8',
  'M2 7h20v5H2z',
  'M12 22V7',
  'M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z',
  'M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
]);
export const Truck = d([
  'M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2',
  'M15 18H9',
  'M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14',
  'M9 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0',
  'M19 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0',
]);
export const Zap = d(['M13 2 3 14h9l-1 8 10-12h-9l1-8z']);
export const Coffee = d([
  'M10 2v2',
  'M14 2v2',
  'M6 2v2',
  'M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1',
]);
export const Music = d([
  'M9 18V5l12-2v13',
  'M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  'M21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
]);
export const FileText = d([
  'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
  'M14 2v6h6',
  'M16 13H8',
  'M16 17H8',
  'M10 9H8',
]);
export const Lock = d([
  'M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z',
  'M7 11V7a5 5 0 0 1 10 0v4',
]);
export const Link = d([
  'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71',
  'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
]);
export const Share2 = d([
  'M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6',
  'M6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6',
  'M18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6',
  'm8.59 13.51 6.83 3.98',
  'm15.41 6.51-6.82 3.98',
]);
export const Send = d(['m22 2-7 20-4-9-9-4z', 'M22 2 11 13']);
export const Filter = d(['M22 3H2l8 9.46V19l4 2v-8.54z']);
export const Crown = d([
  'M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.735H5.81a1 1 0 0 1-.957-.735L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z',
]);
export const Bookmark = d(['M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z']);
export const MoreVertical = d(['M12 6v.01', 'M12 12v.01', 'M12 18v.01']);
export const Wifi = d([
  'M5 12.55a11 11 0 0 1 14.08 0',
  'M8.53 16.11a6 6 0 0 1 6.95 0',
  'M12 20h.01',
  'M1.42 9a16 16 0 0 1 21.16 0',
]);
export const ThumbsUp = d([
  'M7 10v12',
  'M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z',
]);
export const Info = d([
  'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20',
  'M12 16v-4',
  'M12 8h.01',
]);
export const CircleAlert = d([
  'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20',
  'M12 8v4',
  'M12 16h.01',
]);
export const HelpCircle = d([
  'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20',
  'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3',
  'M12 17h.01',
]);
export const Play = d(['m6 3 14 9-14 9z']);
export const Sparkles = d([
  'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z',
  'M20 3v4',
  'M22 5h-4',
  'M4 17v2',
  'M5 18H3',
]);

/**
 * ~55 icons total. Keep every export a standalone frozen binding so
 * tree-shaking still drops unused ones; grow this set only for icons
 * that official components / demos actually consume, and keep each
 * path set sourced from lucide (ISC). */
