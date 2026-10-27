/**
 * sn-signature-mouse — desktop H5 mouse drawing for the signature pad.
 *
 * The pad's stroke capture is touch-based; a desktop browser does not
 * translate mouse drags into touch events, so a touch-only pad was dead on
 * the desktop (the docs demo "无法签名"). `bindMouseDrawing(pad, handlers)`
 * adds the missing input, browser hosts only (`typeof document !==
 * 'undefined'`; mini-programs never call it) — the same pattern as
 * `sn-picker-view-drag.bindMouseGestures` (AGENTS.md §112.3a).
 *
 * ## Why document-level followers
 *
 * A drawing gesture may travel outside the pad (fast strokes exit the box);
 * `mousemove` / `mouseup` are therefore tracked on `document` while the pen
 * is down and detached on release, unmount or window exit. Text selection
 * along the stroke is suppressed with `preventDefault` on mousedown/move.
 *
 * ## Synthetic-event suppression
 *
 * Browsers emit a `mousedown` right after a real touch (tap → mousedown /
 * click). The 500 ms window below lets the component ignore it so a touch
 * never double-fires.
 */

/** Handlers the SFC feeds in — the same shape as its touch handlers. */
export interface MouseDrawingHandlers {
  /** Pen down at a pad-relative point. */
  begin(point: { x: number; y: number }): void;
  /** Pen moved; the engine has already filtered sub-sample travel. */
  extend(point: { x: number; y: number }): void;
  /** Pen lifted. */
  end(): void;
  /** Drawing is locked (disabled prop). */
  isDisabled(): boolean;
  /** True while a touch gesture is live (mouse input must not interfere). */
  isTouchActive(): boolean;
}

/** Ignore synthetic mousedowns that follow a real touch within this window. */
const TOUCH_SUPPRESS_MS = 500;

/**
 * Bind desktop mouse drawing to the pad element.
 *
 * Returns a disposer that removes every listener (AGENTS.md §41); calling it
 * twice is safe. No-op with a no-op disposer when there is no `document`.
 */
export function bindMouseDrawing(pad: HTMLElement, handlers: MouseDrawingHandlers): () => void {
  if (typeof document === 'undefined') return () => {};

  let penDown = false;
  let lastTouchAt = 0;
  let lastX = 0;
  let lastY = 0;

  const onTouch = (): void => {
    lastTouchAt = Date.now();
  };

  const toPoint = (event: MouseEvent): { x: number; y: number } => {
    const rect = pad.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const onPointerDown = (event: MouseEvent): void => {
    if (event.button !== 0) return;
    if (handlers.isDisabled()) return;
    if (handlers.isTouchActive() || Date.now() - lastTouchAt < TOUCH_SUPPRESS_MS) return;
    penDown = true;
    const point = toPoint(event);
    lastX = point.x;
    lastY = point.y;
    handlers.begin(point);
    // A stroke must not select page text along the way.
    event.preventDefault();
  };

  const onPointerMove = (event: MouseEvent): void => {
    if (!penDown) return;
    const point = toPoint(event);
    // Sample filter mirrors the touch path — sub-2px travel is noise.
    const dx = point.x - lastX;
    const dy = point.y - lastY;
    if (Math.sqrt(dx * dx + dy * dy) < 2) return;
    lastX = point.x;
    lastY = point.y;
    handlers.extend(point);
    event.preventDefault();
  };

  const onPointerUp = (): void => {
    if (!penDown) return;
    penDown = false;
    handlers.end();
  };

  const onLeaveWindow = (): void => {
    if (!penDown) return;
    penDown = false;
    handlers.end();
  };

  pad.addEventListener('touchstart', onTouch, { passive: true, capture: true });
  document.addEventListener('mousedown', onPointerDown);
  document.addEventListener('mousemove', onPointerMove, { passive: false });
  document.addEventListener('mouseup', onPointerUp);
  document.addEventListener('mouseleave', onLeaveWindow);
  window.addEventListener('blur', onLeaveWindow);

  return () => {
    pad.removeEventListener('touchstart', onTouch, { capture: true } as EventListenerOptions);
    document.removeEventListener('mousedown', onPointerDown);
    document.removeEventListener('mousemove', onPointerMove);
    document.removeEventListener('mouseup', onPointerUp);
    document.removeEventListener('mouseleave', onLeaveWindow);
    window.removeEventListener('blur', onLeaveWindow);
    penDown = false;
  };
}
