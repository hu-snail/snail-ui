/**
 * useOverlayFollow — shared "keep the floating panel glued to its trigger"
 * behavior for teleported fixed-position overlays (select menu, cascader
 * menu, date/time panels, color popover, mention candidates...).
 *
 * Why capture=true on the scroll listener: `scroll` events do not bubble,
 * and the page may scroll through any scrollable ancestor (the window, a
 * modal body, a drawer, a table wrapper...). A capture-phase listener on
 * `window` sees every scroll on its way down to the scrolling element, so
 * one listener covers page-level and nested-container scrolling without
 * knowing the DOM path between the two.
 *
 * Contract:
 *   start() — attach the scroll/resize followers (idempotent; a second call
 *             while active is a no-op).
 *   stop()  — detach them and cancel any queued frame (idempotent).
 * The reposition callback stays component-owned: this composable only
 * re-triggers it (rAF-throttled), it never measures layout or writes styles.
 *
 * Lifecycle (§41/§42): the composable removes its own listeners in its
 * host's onBeforeUnmount, so a host that forgets to stop() cannot leak a
 * window listener. No DOM references are retained beyond the refs the host
 * already owns.
 *
 * Note: start() is only called from user-interaction paths (open panel) in
 * a live browser, so `window` access below never runs in a non-DOM host.
 */

import { onBeforeUnmount, type Ref } from 'vue';

/** How the host reports "the overlay is currently shown". */
type EnabledSource = Ref<boolean> | (() => boolean);

export interface OverlayFollowHandle {
  /** Begin re-triggering `repositionFn` on scroll/resize while shown. */
  start: () => void;
  /** Stop following and release the listeners (idempotent). */
  stop: () => void;
}

function isEnabled(source: EnabledSource): boolean {
  return typeof source === 'function' ? source() : source.value;
}

export function useOverlayFollow(
  /** The trigger element the panel is anchored to (rect source). */
  triggerRef: Ref<HTMLElement | null>,
  /** The floating panel element (null while closed / before mount). */
  panelRef: Ref<HTMLElement | null>,
  /** Component-owned reposition pass (reads fresh rects, writes styles). */
  repositionFn: () => void | Promise<void>,
  /** Whether the overlay is currently shown; frames while hidden are dropped. */
  enabled: EnabledSource,
): OverlayFollowHandle {
  let isActive = false;
  let frameId: number | null = null;

  function runFrame(): void {
    frameId = null;
    // Closed (or mid-close): nothing to keep aligned. The refs are the
    // source of truth — panelRef nulls out when the v-if'd panel unmounts.
    if (!isActive || !isEnabled(enabled)) return;
    if (triggerRef.value === null || panelRef.value === null) return;
    void repositionFn();
  }

  /** rAF throttle: coalesce a scroll burst into one reposition per frame. */
  function scheduleFollow(): void {
    if (frameId !== null) return;
    frameId = requestAnimationFrame(runFrame);
  }

  function onWindowScroll(event: Event): void {
    // The panel's own scrollbar (menu body etc.) does not move the trigger;
    // skip it so internal scrolling cannot spam repositions.
    if (event.target instanceof Node && panelRef.value?.contains(event.target)) return;
    scheduleFollow();
  }

  function onWindowResize(): void {
    scheduleFollow();
  }

  function start(): void {
    if (isActive) return;
    isActive = true;
    window.addEventListener('scroll', onWindowScroll, { capture: true });
    window.addEventListener('resize', onWindowResize);
  }

  function stop(): void {
    if (!isActive) return;
    isActive = false;
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }
    // Same capture flag as addEventListener — capture listeners only come
    // off when the options match.
    window.removeEventListener('scroll', onWindowScroll, { capture: true });
    window.removeEventListener('resize', onWindowResize);
  }

  // §82: the composable cleans up even if the host forgets to stop().
  onBeforeUnmount(stop);

  return { start, stop };
}
