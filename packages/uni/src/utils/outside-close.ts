/**
 * Cross-instance bookkeeping for the transparent outside-tap masks of
 * sn-tooltip / sn-popover.
 *
 * The mask closes the bubble on `touchstart` — before the tap "lands" — so on
 * H5 the same tap continues to the element underneath and tapping another
 * tooltip's trigger switches bubbles in one gesture. Because that same tap
 * then also reaches the trigger of the bubble that just closed, every
 * instance records its identity at mask-close time and ignores a trigger tap
 * that arrives immediately after its own outside close (otherwise the bubble
 * would instantly reopen).
 */

/** Grace window (ms) in which a trigger tap after an outside close is stale. */
const OUTSIDE_CLOSE_GUARD_MS = 350;

let lastClosedId: number | null = null;
let lastClosedAt = 0;

/** Record that the instance `id` just closed via its outside mask. */
export function markOutsideClose(id: number): void {
  lastClosedId = id;
  lastClosedAt = Date.now();
}

/**
 * Whether a trigger tap on instance `id` arrives right after that same
 * instance closed via its outside mask (same gesture → must not toggle).
 */
export function shouldIgnoreTapAfterOutsideClose(id: number): boolean {
  return lastClosedId === id && Date.now() - lastClosedAt < OUTSIDE_CLOSE_GUARD_MS;
}
