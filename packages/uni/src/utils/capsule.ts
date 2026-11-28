/**
 * Custom-navigation metrics for WeChat mini-program pages (AUI-MP-002).
 *
 * WeChat floats its capsule (menu button) inside the navigation band at the
 * top-right of every page. A page that sets `navigationStyle: "custom"` owns
 * that band itself, so it must reserve two things the CSS alone cannot give:
 *
 *   - `statusBarHeight` — `--status-bar-height` is H5/App-only; in WXSS the
 *     variable is absent (fallback 0), so a header using it slides under the
 *     clock / notch.
 *   - `capsulePadRight` — the capsule's width plus a gap, used as the top
 *     row's right padding so actions never sit underneath it.
 *
 * `navBarHeight` is the nav band height implied by the capsule's vertical
 * position (`gap * 2 + height`, at least 44px). H5 / App have no capsule: the
 * metrics stay zeroed and callers keep their normal rhythm.
 *
 * Internal helper (AGENTS.md §15): imported by the demo shell / overview and
 * by template pages, not exported from the package barrel.
 */

export interface CapsuleMetrics {
  /** Status-bar height in px (0 on H5 / App, where CSS vars handle it). */
  statusBarHeight: number;
  /** Navigation band height in px — the row the capsule is centred in. */
  navBarHeight: number;
  /** Right inset (px) that clears the capsule; 0 when there is none. */
  capsulePadRight: number;
  /** Whether a WeChat capsule was measured. */
  hasCapsule: boolean;
}

/** Fallback nav row height (px) when the capsule is missing or malformed. */
const DEFAULT_NAV_HEIGHT = 44;
/** Breathing room between the capsule's left edge and page actions. */
const CAPSULE_GAP = 8;

let cached: CapsuleMetrics | null = null;

/** Measure (and memoize) the capsule geometry. */
export function getCapsuleMetrics(): CapsuleMetrics {
  if (cached !== null) return cached;

  let statusBarHeight = 0;
  let navBarHeight = DEFAULT_NAV_HEIGHT;
  let capsulePadRight = 0;
  let hasCapsule = false;

  // #ifdef MP
  // Static `uni.*` calls (not globalThis) so the uni-app compiler bundles the
  // APIs — a dynamic lookup is invisible to its static analysis and leaves the
  // status bar at 0 on MP (see src/uni-env.d.ts).
  if (typeof uni !== 'undefined' && typeof uni.getSystemInfoSync === 'function') {
    try {
      const sys = uni.getSystemInfoSync();
      statusBarHeight = sys?.statusBarHeight ?? 0;

      // #ifdef MP-WEIXIN
      if (typeof uni.getMenuButtonBoundingClientRect === 'function') {
        const rect = uni.getMenuButtonBoundingClientRect();
        if (rect && (rect.width ?? 0) > 0 && (rect.top ?? 0) > statusBarHeight) {
          const gap = (rect.top ?? 0) - statusBarHeight;
          navBarHeight = Math.max(gap * 2 + (rect.height ?? 0), DEFAULT_NAV_HEIGHT);
          capsulePadRight = (sys?.windowWidth ?? 375) - (rect.left ?? 0) + CAPSULE_GAP;
          hasCapsule = true;
        }
      }
      // #endif
    } catch {
      // A host without system info keeps the H5-shaped defaults.
    }
  }
  // #endif

  cached = { statusBarHeight, navBarHeight, capsulePadRight, hasCapsule };
  return cached;
}

/**
 * Drop the memoized measurement — tests only (the metrics are launch-stable).
 * @internal
 */
export function resetCapsuleMetrics(): void {
  cached = null;
}
