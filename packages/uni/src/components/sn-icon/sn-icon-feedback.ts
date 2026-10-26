/**
 * Feedback status glyphs — success / info / warning / danger, as frozen
 * `IconData` objects (AGENTS.md §113: inline SVG paths, never emoji).
 *
 * Kept out of `sn-icon-set.ts` on purpose: that file is the consumer-facing
 * shortcut set (icons an app author picks by name), while these four glyphs are
 * the *semantic* status marks that feedback components (sn-dialog, sn-toast,
 * sn-notify, sn-notice-bar, sn-loadmore) render from a `type` prop. A component
 * looks them up by the same string it exposes in its API, so no consumer
 * registration is required.
 *
 * Import them directly (no registry round-trip):
 *
 *   import { resolveFeedbackIcon } from '../sn-icon/sn-icon-feedback'
 *   const icon = resolveFeedbackIcon('success')   // IconData | null
 */

import { markRaw } from 'vue';
import type { IconData } from './sn-icon.vue';

/** Success mark — a circle with a tick. */
export const FeedbackSuccess: IconData = markRaw({
  viewBox: '0 0 24 24',
  paths: ['M21.801 10A10 10 0 1 1 17 3.335', 'm9 11 3 3L22 4'],
});

/** Info mark — a circle with an "i". */
export const FeedbackInfo: IconData = markRaw({
  viewBox: '0 0 24 24',
  paths: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20', 'M12 16v-4', 'M12 8h.01'],
});

/** Warning mark — a triangle with an exclamation. */
export const FeedbackWarning: IconData = markRaw({
  viewBox: '0 0 24 24',
  paths: ['M12 3 2 21h20L12 3', 'M12 9v5', 'M12 17h.01'],
});

/** Danger / error mark — a circle with a cross. */
export const FeedbackDanger: IconData = markRaw({
  viewBox: '0 0 24 24',
  paths: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20', 'm15 9-6 6', 'm9 9 6 6'],
});

/** Alias table keyed by the `type` strings the components expose. */
const FEEDBACK_ICONS: Record<string, IconData> = {
  success: FeedbackSuccess,
  info: FeedbackInfo,
  warning: FeedbackWarning,
  danger: FeedbackDanger,
  error: FeedbackDanger,
};

/**
 * Resolve a status icon by its API name (`success` / `info` / `warning` /
 * `danger`, plus the `error` alias used by the toast family). Returns `null`
 * for unknown names so the caller can fall back to a registry lookup.
 */
export function resolveFeedbackIcon(name: string): IconData | null {
  return FEEDBACK_ICONS[name] ?? null;
}
