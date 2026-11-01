/**
 * sn-paging browser-host gesture fallback (uni-end, internal).
 *
 * Where a real uni runtime exists (MP / App / uni-h5) the pull-to-refresh and
 * scroll-to-bottom detection belong to `scroll-view` itself and this module is
 * never wired up. But when the component renders as an inert custom element —
 * the docs browser preview — neither the native refresher nor
 * `@scrolltolower` exists, so this module restores both gestures with plain
 * DOM listeners on the scroll host:
 *
 *   - pull-to-refresh: touch drag below the top (scrollTop <= 0), damped,
 *     clamped and rAF-coalesced, reported through `onPull` while dragging;
 *     releasing past the threshold fires `onRefreshArm`, releasing past the
 *     second-floor threshold fires `onSecondFloorArm` instead.
 *   - load-more: a native `scroll` listener comparing geometry against the
 *     lower threshold.
 *
 * ## Pull physics (rubber band)
 *
 * Incremental damping, mirroring the z-paging refresher contract:
 * every gesture delta scales by `PULL_RATE` (0.75) while the pull is below
 * the arming threshold; past the threshold each delta keeps only
 * `1 - OUT_RATE` (0.35) of itself, and a single-event finger jump is capped —
 * so the pull chases the finger, then resists, then stops: the rubber band.
 * The total pull is clamped to `MAX_PULL_RATIO × threshold` so one hard yank
 * can never run away.
 *
 * Reports are coalesced through `requestAnimationFrame` and rounded to whole
 * pixels — at most one style write per frame, and the component renders the
 * distance with `transform` only (no layout), which keeps dragging off the
 * main-thread layout path (§80).
 *
 * All DOM access lives behind the `typeof document` guard at the entry point
 * so the uni-x transform only ever sees optional calls (§116.2). The returned
 * dispose function removes every listener (§41/§42).
 */

export interface BrowserPagingGestureOptions {
  /** Whether the refresher gesture is currently enabled (prop-driven). */
  isRefresherEnabled: () => boolean;
  /** Arming pull distance in px (prop-driven). */
  refresherThreshold: () => number;
  /** Whether the second floor is armed on release (prop-driven). */
  isSecondFloorEnabled: () => boolean;
  /** Release distance that enters the second floor, in px (prop-driven). */
  secondFloorThreshold: () => number;
  /** Distance from the bottom that fires load-more, in px (prop-driven). */
  lowerThreshold: () => number;
  /** A query is in flight — dragging must not stack another one. */
  isBusy: () => boolean;
  /** Damped pull distance update while dragging; `0` springs back. */
  onPull: (distance: number) => void;
  /** Released past the refresh threshold — host starts the refresh query. */
  onRefreshArm: () => void;
  /** Released past the second-floor threshold — host opens the second floor. */
  onSecondFloorArm: () => void;
  /** Scrolled near the bottom — host loads the next page. */
  onReachBottom: () => void;
}

/** Share of each gesture delta kept while below the arming threshold. */
const PULL_RATE = 0.75;
/** Share REMOVED from each delta once past the arming threshold. */
const OUT_RATE = 0.65;
/** Cap for one event's finger jump — a sudden yank must not teleport the pull. */
const DELTA_CAP_PX = 100;
/** Total pull clamp, as a multiple of the arming threshold. */
export const MAX_PULL_RATIO = 2.4;

/**
 * Install the fallback gestures on `el`. Returns a dispose function; returns
 * `null` when DOM APIs are unavailable (non-browser host).
 */
export function createBrowserPagingGesture(
  el: HTMLElement,
  options: BrowserPagingGestureOptions,
): (() => void) | null {
  if (typeof document === 'undefined') return null;

  const raf: (cb: () => void) => number =
    typeof requestAnimationFrame === 'function'
      ? requestAnimationFrame
      : (cb) => window.setTimeout(cb, 16);
  const cancelRaf: (id: number) => void =
    typeof cancelAnimationFrame === 'function'
      ? cancelAnimationFrame
      : (id) => window.clearTimeout(id);

  let armed = false;
  let lastRawY = 0;
  let currentDis = 0;
  let rafId: number | null = null;

  const report = (): void => {
    rafId = null;
    options.onPull(Math.round(currentDis));
  };

  const scheduleReport = (): void => {
    if (rafId === null) rafId = raf(report);
  };

  const cancelPendingReport = (): void => {
    if (rafId !== null) {
      cancelRaf(rafId);
      rafId = null;
    }
  };

  const onTouchStart = (event: TouchEvent): void => {
    const touch = event.touches[0];
    if (!touch) return;
    armed = options.isRefresherEnabled() && !options.isBusy() && el.scrollTop <= 0;
    lastRawY = touch.clientY;
    currentDis = 0;
  };

  const onTouchMove = (event: TouchEvent): void => {
    if (!armed) return;
    const touch = event.touches[0];
    if (!touch) return;
    const rawY = touch.clientY;
    let delta = rawY - lastRawY;
    lastRawY = rawY;
    if (delta > 0) {
      if (delta > DELTA_CAP_PX) delta = DELTA_CAP_PX;
      delta *= currentDis >= options.refresherThreshold() ? 1 - OUT_RATE : PULL_RATE;
    }
    const maxPull = options.refresherThreshold() * MAX_PULL_RATIO;
    currentDis = Math.max(0, Math.min(currentDis + delta, maxPull));
    scheduleReport();
    if (currentDis > 0 && event.cancelable) event.preventDefault();
  };

  const onTouchEnd = (): void => {
    if (!armed) return;
    armed = false;
    cancelPendingReport();
    const dis = currentDis;
    currentDis = 0;
    if (options.isSecondFloorEnabled() && dis >= options.secondFloorThreshold()) {
      options.onSecondFloorArm();
    } else if (dis >= options.refresherThreshold()) {
      options.onRefreshArm();
    } else {
      options.onPull(0);
    }
  };

  /* A cancelled gesture (system takeover) never arms — it just springs back. */
  const onTouchCancel = (): void => {
    if (!armed) return;
    armed = false;
    cancelPendingReport();
    currentDis = 0;
    options.onPull(0);
  };

  const onScroll = (): void => {
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceFromBottom <= options.lowerThreshold()) options.onReachBottom();
  };

  /* Touch listeners need `preventDefault` authority while dragging. */
  el.addEventListener('touchstart', onTouchStart, { passive: true });
  el.addEventListener('touchmove', onTouchMove, { passive: false });
  el.addEventListener('touchend', onTouchEnd, { passive: true });
  el.addEventListener('touchcancel', onTouchCancel, { passive: true });
  el.addEventListener('scroll', onScroll, { passive: true });

  return () => {
    cancelPendingReport();
    el.removeEventListener('touchstart', onTouchStart);
    el.removeEventListener('touchmove', onTouchMove);
    el.removeEventListener('touchend', onTouchEnd);
    el.removeEventListener('touchcancel', onTouchCancel);
    el.removeEventListener('scroll', onScroll);
  };
}
