/**
 * SnColorPicker session-wide "recently used colors" store — internal to
 * `src/color-picker/`.
 *
 * A single module-scoped reactive list shared by every picker instance on
 * the page (most recent first, deduped, capped). Values are normalized to
 * lowercase hex (`#rrggbb`, or `#rrggbbaa` when alpha < 1) so the swatch
 * grid can render them directly and re-select them through `parseColor`.
 *
 * Deliberately in-memory only — no localStorage persistence (SSR safety +
 * AGENTS.md §66: no surprise data retention). `resetRecentColors` exists
 * for tests; it is not part of the public component API.
 */

import { ref } from 'vue';
import { parseColor, rgbaToHex } from './sn-color-picker-types';

/** Cap on the session-wide recently-used list. */
export const RECENT_COLORS_MAX = 10;

/** Session-wide recently used colors — most recent first, deduped, hex. */
export const recentColors = ref<string[]>([]);

/**
 * Record a committed color: normalize to hex, dedup (move to front),
 * cap at `RECENT_COLORS_MAX`. Unparseable input is ignored.
 */
export function recordRecentColor(value: string): void {
  const parsed = parseColor(value);
  if (!parsed) return;
  const hex = rgbaToHex(parsed.r, parsed.g, parsed.b, parsed.a);
  const next = [hex, ...recentColors.value.filter((existing) => existing !== hex)];
  recentColors.value = next.slice(0, RECENT_COLORS_MAX);
}

/** Clear the session history (test hook; not exported from the package). */
export function resetRecentColors(): void {
  recentColors.value = [];
}
