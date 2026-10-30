/**
 * sn-captcha-mouse — shared horizontal-drag interaction helpers used by the
 * verification gestures (`sn-captcha`, `sn-slide-verify`).
 *
 * ## 1. Desktop mouse input (additive — AUI-OPT-12, AGENTS.md §112.3a)
 *
 * The drag capture of both components is touch-based; a browser does not
 * translate mouse drags into touch events, so touch-only handles were dead on
 * desktop (the docs preview "拼图滑不动"). `bindHorizontalDragMouse(handle,
 * handlers)` adds the missing input, browser hosts only (`typeof document !==
 * 'undefined'`; mini-programs / App never call it) — the same pattern as
 * `sn-signature-mouse.bindMouseDrawing` and
 * `sn-picker-view-drag.bindMouseGestures`.
 *
 * A drag may travel outside the handle (the cursor may sweep past the stage),
 * so `mousemove` / `mouseup` are tracked on `document` while the button is down
 * and detached on release, unmount or window exit; text selection along the
 * sweep is suppressed with `preventDefault`.
 *
 * Browsers emit a `mousedown` right after a real touch (tap → mousedown /
 * click). The 500 ms window below plus `isTouchActive()` let the component
 * ignore it, so a touch never double-fires the drag.
 *
 * ## 2. The rpx ↔ pointer scale
 *
 * Handle offsets are stored in *design px* (`1 design px = 2rpx`), but a
 * pointer delta arrives in CSS px. `pxPerDesign()` returns the host factor:
 *
 *   - H5 compiles `rpx` through a root font-size derived from
 *     `min(viewportWidth, rpxCalcMaxDeviceWidth = 960)` — above that cap the
 *     375px design base is used — so one design px is `effectiveWidth / 375`
 *     CSS px (1 on a 375px viewport, 2 on a 750px one, back to 1 on wide
 *     desktops past the cap).
 *   - Mini-programs define `2rpx = windowWidth / 375` directly.
 *
 * Without the conversion a handle overshoots or lags the pointer on any
 * viewport other than 375px — the "滑不动 / 对不齐" report.
 *
 * Cross-component import follows the `sn-picker-view-drag` precedent (the
 * roller engine lives in `sn-picker-view`, `sn-datetime-picker-view` imports
 * it).
 */

/** Handlers the SFCs feed in — the same shape as their touch path. */
export interface HorizontalDragMouseHandlers {
  /** Button pressed at a page-x (CSS px). */
  begin(clientX: number): void;
  /** Pointer moved; the component applies its own scale + clamp. */
  move(clientX: number): void;
  /** Button released — the component resolves the verdict. */
  end(): void;
  /** The handle is locked (verified / disabled). */
  isLocked(): boolean;
  /** True while a real touch gesture is live (mouse input must not interfere). */
  isTouchActive(): boolean;
}

/** Ignore synthetic mousedowns that follow a real touch within this window. */
const TOUCH_SUPPRESS_MS = 500;

/** rpx design reference width: `750rpx` spans this many CSS px at the base. */
const DESIGN_VIEWPORT_WIDTH = 375;

/** uni H5 `rpxCalcMaxDeviceWidth` default — above it the 375 base applies. */
const RPX_MAX_DEVICE_WIDTH = 960;

/**
 * Viewport width in CSS px, or 0 when neither the uni runtime nor `window`
 * reports one (tests, exotic hosts).
 */
function viewportWidth(): number {
  const host = globalThis as {
    uni?: { getSystemInfoSync?: () => { windowWidth?: number } };
    innerWidth?: number;
  };
  const width = host.uni?.getSystemInfoSync?.()?.windowWidth ?? host.innerWidth;
  return typeof width === 'number' && width > 0 ? width : 0;
}

/**
 * CSS px per design px (`1 design px = 2rpx`) on the current host.
 *
 * Mirrors uni's own `rpx` conversion: the effective device width is capped at
 * 960px and falls back to the 375px design base above it. Returns 1 (the
 * 375px reference viewport) when the host reports no width.
 */
export function pxPerDesign(): number {
  const width = viewportWidth();
  if (width === 0) return 1;
  const effective = width <= RPX_MAX_DEVICE_WIDTH ? width : DESIGN_VIEWPORT_WIDTH;
  return effective / DESIGN_VIEWPORT_WIDTH;
}

/**
 * Resolve a template ref to its DOM node.
 *
 * uni H5 wraps `<view>` in a component, so a ref on it resolves to the
 * component instance and the node lives on `$el` (the unwrap `sn-picker-view`
 * applies); plain element refs (native tags, test stubs) pass through.
 */
export function resolveNodeEl(target: unknown): unknown {
  return (target as { $el?: unknown } | null)?.$el ?? target;
}

/**
 * Bind desktop mouse dragging to a handle.
 *
 * Returns a disposer that removes every listener (AGENTS.md §41); calling it
 * twice is safe. No-op with a no-op disposer when there is no `document`.
 */
export function bindHorizontalDragMouse(
  handle: HTMLElement,
  handlers: HorizontalDragMouseHandlers,
): () => void {
  if (typeof document === 'undefined') return () => {};

  let dragging = false;
  let lastTouchAt = 0;

  const onTouch = (): void => {
    lastTouchAt = Date.now();
  };

  const onDown = (event: MouseEvent): void => {
    if (event.button !== 0) return;
    if (handlers.isLocked()) return;
    if (handlers.isTouchActive() || Date.now() - lastTouchAt < TOUCH_SUPPRESS_MS) return;
    dragging = true;
    handlers.begin(event.clientX);
    // A drag must not select page text along the sweep.
    event.preventDefault();
  };

  const onMove = (event: MouseEvent): void => {
    if (!dragging) return;
    handlers.move(event.clientX);
    event.preventDefault();
  };

  const onUp = (): void => {
    if (!dragging) return;
    dragging = false;
    handlers.end();
  };

  const onLeaveWindow = (): void => {
    if (!dragging) return;
    dragging = false;
    handlers.end();
  };

  handle.addEventListener('touchstart', onTouch, { passive: true, capture: true });
  handle.addEventListener('mousedown', onDown);
  document.addEventListener('mousemove', onMove, { passive: false });
  document.addEventListener('mouseup', onUp);
  document.addEventListener('mouseleave', onLeaveWindow);
  window.addEventListener('blur', onLeaveWindow);

  return () => {
    handle.removeEventListener('touchstart', onTouch, { capture: true } as EventListenerOptions);
    handle.removeEventListener('mousedown', onDown);
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
    document.removeEventListener('mouseleave', onLeaveWindow);
    window.removeEventListener('blur', onLeaveWindow);
    dragging = false;
  };
}