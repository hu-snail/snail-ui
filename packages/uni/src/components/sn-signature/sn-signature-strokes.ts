/**
 * sn-signature strokes — pure geometry for the canvas-free signature pad.
 *
 * Reference library: wot-ui `wd-signature`
 *   (https://wot-ui.cn/component/signature.html)
 *
 * The stroke renders as a chain of absolutely positioned, rotated `<view>`
 * bars (the cross-end allowlist has no `<canvas>`). Everything the touch /
 * mouse handlers decide about *geometry* lives here so the SFC stays a thin
 * state machine and the math is unit-testable (AGENTS.md §46).
 *
 * ## Round joints (连贯性)
 *
 * A bar spans one sampled segment and rotates about its left edge
 * (`transform-origin: 0 50%`, CSS). Two bars meeting at a kink would leave a
 * wedge-shaped gap, so every bar is extended by one line width and capped
 * round (CSS `border-radius: full`): the tail of bar N covers the joint at
 * `to` and the head of bar N+1 starts inside that cover. With an opaque pen
 * colour the overdraw is invisible and the chain reads as one continuous
 * rounded stroke.
 *
 * ## Sampling (丝滑)
 *
 * Raw `touchmove` fires faster than the eye needs (up to 120 Hz) and floods
 * the renderer with sub-pixel bars. `shouldSample` keeps a point only when it
 * moved at least `SAMPLE_MIN_DISTANCE` design px from the previous one —
 * dense enough to look smooth, sparse enough to keep the node count flat.
 */

/** One sampled point, in px design units relative to the pad. */
export interface SignaturePoint {
  x: number;
  y: number;
}

/** A drawn segment ready for the template. */
export interface SignatureSegment {
  left: number;
  top: number;
  width: number;
  angle: number;
}

/** A stroke is a point list. */
export type SignatureStroke = SignaturePoint[];

/** Minimum travel (design px) between two kept samples. */
export const SAMPLE_MIN_DISTANCE = 2;

/** True when `next` is far enough from `last` to become a new sample. */
export function shouldSample(
  last: SignaturePoint | undefined,
  next: SignaturePoint,
  minDistance = SAMPLE_MIN_DISTANCE,
): boolean {
  if (last === undefined) return true;
  const dx = next.x - last.x;
  const dy = next.y - last.y;
  return Math.sqrt(dx * dx + dy * dy) >= minDistance;
}

/**
 * Bars for one stroke (empty for a single-point tap — dots render apart).
 * `lineWidth` is in design px; the tail extension uses it to cover joints.
 */
export function barsOf(stroke: SignatureStroke, lineWidth: number): SignatureSegment[] {
  const bars: SignatureSegment[] = [];
  for (let i = 1; i < stroke.length; i += 1) {
    const from = stroke[i - 1];
    const to = stroke[i];
    if (from === undefined || to === undefined) continue;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    if (length < 0.5) continue;
    bars.push({
      left: from.x,
      top: from.y,
      // Tail extension: the round cap must reach past `to` to cover the joint.
      width: length + lineWidth,
      angle: (Math.atan2(dy, dx) * 180) / Math.PI,
    });
  }
  return bars;
}

/** Single-point strokes render as dots (a deliberate tap leaves a mark). */
export function dotsOf(strokes: SignatureStroke[]): SignaturePoint[] {
  const out: SignaturePoint[] = [];
  for (const stroke of strokes) {
    if (stroke.length !== 1) continue;
    const point = stroke[0];
    if (point !== undefined) out.push(point);
  }
  return out;
}
