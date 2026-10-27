/**
 * sn-image-preview gesture math — pure helpers for the WeChat-style viewer.
 *
 * Reference behaviour: WeChat's image viewer (drag-to-page with rubber band,
 * pinch zoom, double-tap zoom, drag-down dismiss with curtain fade).
 *
 * Pure functions only: every decision the touch handlers make is computed
 * here so the state machine stays a thin shell and the math is unit-testable
 * (AGENTS.md §46 — behaviour over implementation detail).
 */

/** Dominant-axis lock: `'x'` pages, `'y'` dismisses, `null` = not locked yet. */
export type PreviewAxis = 'x' | 'y' | null;

/** Horizontal intent wins ties (dx === dy) — paging is the primary gesture. */
export function lockAxis(dx: number, dy: number, threshold: number): PreviewAxis {
  const adx = Math.abs(dx);
  const ady = Math.abs(dy);
  if (adx < threshold && ady < threshold) return null;
  return adx >= ady ? 'x' : 'y';
}

/** True when the move stayed within the tap envelope (no drag, no page flip). */
export function isTapTravel(dx: number, dy: number, limit: number): boolean {
  return Math.abs(dx) < limit && Math.abs(dy) < limit;
}

/**
 * Rubber-band resistance for out-of-range drags: inside `limit` the movement
 * passes through 1:1, beyond it every extra pixel costs `resistance` pixels.
 */
export function rubberBand(delta: number, limit: number, resistance: number): number {
  if (delta > limit) return limit + (delta - limit) * resistance;
  if (delta < -limit) return -limit + (delta + limit) * resistance;
  return delta;
}

/** Pinch scale from the base (fingers-down) and current two-finger distances. */
export function pinchScale(baseDistance: number, distance: number): number {
  if (baseDistance <= 0 || distance <= 0) return 1;
  return distance / baseDistance;
}

/** Clamp zoom into `[min, max]` — pinch can overshoot, release snaps back. */
export function clampZoom(scale: number, min: number, max: number): number {
  if (!Number.isFinite(scale)) return min;
  return Math.min(max, Math.max(min, scale));
}

/**
 * Pan bounds for a zoomed image: the image may move until its edge reaches
 * the viewport edge (i.e. `(scale - 1) * half` in each direction), plus the
 * rubber-band overflow handled by the caller.
 */
export function panLimit(viewport: number, scale: number): number {
  if (viewport <= 0) return 0;
  return (Math.max(1, scale) - 1) * (viewport / 2);
}

/** Curtain fade for the drag-down dismiss: 1 at rest → 0 at a full screen. */
export function dismissOpacity(dy: number, viewportHeight: number): number {
  if (viewportHeight <= 0 || dy <= 0) return 1;
  return Math.max(0, 1 - dy / viewportHeight);
}

/** True when a vertical release should dismiss (distance or flick velocity). */
export function shouldDismiss(dy: number, velocity: number, height: number): boolean {
  if (height <= 0) return false;
  return dy > height * 0.25 || velocity > 0.6;
}

/** True when a horizontal release should flip to the adjacent image. */
export function shouldPage(dx: number, velocity: number, width: number): boolean {
  if (width <= 0) return false;
  return Math.abs(dx) > width * 0.35 || Math.abs(velocity) > 0.6;
}

/** Two-finger distance from a touch list (px); 0 when fewer than 2 touches. */
export function touchDistance(touches: Array<{ clientX: number; clientY: number }>): number {
  if (touches.length < 2) return 0;
  const a = touches[0];
  const b = touches[1];
  if (a === undefined || b === undefined) return 0;
  const dx = a.clientX - b.clientX;
  const dy = a.clientY - b.clientY;
  return Math.hypot(dx, dy);
}

/** Midpoint of the first two touches (pinch origin); `null` below two touches. */
export function touchMidpoint(
  touches: Array<{ clientX: number; clientY: number }>,
): { x: number; y: number } | null {
  if (touches.length < 2) return null;
  const a = touches[0];
  const b = touches[1];
  if (a === undefined || b === undefined) return null;
  return { x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 };
}
