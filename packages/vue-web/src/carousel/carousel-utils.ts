/**
 * Pure index/geometry helpers for SnCarousel.
 *
 * Extracted from the component so loop index mapping, slides-per-view
 * sizing, drag snapping, wheel and keyboard decisions stay unit-testable
 * without a DOM (per task spec: drag geometry is asserted here, not in
 * happy-dom mounts).
 *
 * Reference: naive-ui `src/carousel/src/utils.ts` (duplicatedLogic.ts,
 * index.ts) — the mapping functions mirror naive 1:1 (AGENTS.md §112).
 */

/** Wheel deltas below this many px (in the matched direction) are ignored. */
export const WHEEL_RESPONSE_STEP = 10;

/** Flick velocity threshold from naive: px per ms. */
export const FLICK_VELOCITY_THRESHOLD = 0.4;

/* ────────────────────────── basic helpers ────────────────────────── */

export function clampValue(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

/** `'300ms'` → 300, `1.5s` → 1500, numbers pass through, junk → 0. */
export function resolveSpeed(value?: string | number): number {
  if (value === undefined) return 0;
  if (typeof value === 'number') return value;
  const timeRE = /^((\d+)?\.?\d+?)(ms|s)?$/;
  const match = value.match(timeRE);
  if (match) {
    const [, number, , unit = 'ms'] = match;
    return Number(number) * (unit === 'ms' ? 1 : 1000);
  }
  return 0;
}

/* ─────────────────── loop index mapping (real index space) ───────────────────
 *
 * In duplicated (loop + slides-per-view=1 + slide effect) mode the rendered
 * slide list is `[clone(last), 0, …, n-1, clone(first)]`. "Real" indexes run
 * over that list; "display" indexes are what dots / v-model:current-index
 * expose. slot      [ 0 1 2 ]          (originals)
 * display    2 0 1 2 0            (what the user sees)
 * real       0 1 2 3 4            (includes clone slots)
 */

/** The rendered real index for a display index. */
export function getRealIndex(current: number, duplicatedable?: boolean): number {
  return !duplicatedable ? current : current + 1;
}

/**
 * The display index for a real index. `length` is the total real view count.
 */
export function getDisplayIndex(current: number, length: number, duplicatedable: boolean): number {
  if (length === 1) return 0;
  return !duplicatedable
    ? current
    : current === 0
      ? length - 3
      : current === length - 1
        ? 0
        : current - 1;
}

/** Previous real index, or `null` when the edge is not wrappable. */
export function getPrevIndex(current: number, length: number, loop?: boolean): number | null {
  if (current < 0) return null;
  return current === 0 ? (loop ? length - 1 : null) : current - 1;
}

/** Next real index, or `null` when the edge is not wrappable. */
export function getNextIndex(current: number, length: number, loop?: boolean): number | null {
  if (current > length - 1) return null;
  return current === length - 1 ? (loop ? 0 : null) : current + 1;
}

/** Number of dots: clone slots are subtracted in duplicated mode. */
export function getDisplayTotalView(total: number, duplicatedable?: boolean): number {
  return duplicatedable && total > 3 ? total - 2 : total;
}

/**
 * Whether the slide list gets clone slides at both ends — only the
 * sequential `slide` effect with a single slide per view duplicates
 * (mirrors naive `duplicatedableRef`).
 */
export function isDuplicatedable(
  loop: boolean,
  slidesPerView: number | 'auto',
  effect: 'slide' | 'fade' | 'card' | 'custom',
): boolean {
  return loop && slidesPerView === 1 && effect === 'slide';
}

/* ────────────────────────── slides-per-view geometry ────────────────────────── */

/** Total views (real) for a fixed slide count and slides-per-view. */
export function computeTotalView(totalSlides: number, displaySlidesPerView: number): number {
  return Math.max(totalSlides - displaySlidesPerView, 0) + 1;
}

/**
 * Per-slide size on the scroll axis when slides-per-view is a number:
 * the container size minus the inter-slide gaps, split evenly.
 * Mirrors naive: `remaining / max(1, slidesPerView)`.
 */
export function computeSlideAxisSize(
  perViewAxisSize: number,
  slidesPerView: number,
  spaceBetween: number,
): number {
  const remaining = perViewAxisSize - (slidesPerView - 1) * spaceBetween;
  const percentage = 1 / Math.max(1, slidesPerView);
  return remaining * percentage;
}

/**
 * Translate (px) required to bring each slide to the viewport start —
 * cumulative offsets, optionally re-centered for `centeredSlides`.
 */
export function computeSlideTranslates(
  slideSizesAxis: number[],
  perViewAxisSize: number,
  spaceBetween: number,
  centeredSlides: boolean,
): number[] {
  let previousTranslate = 0;
  return slideSizesAxis.map((slideSize) => {
    let translate = previousTranslate;
    if (centeredSlides) {
      translate += (slideSize - perViewAxisSize) / 2;
    }
    previousTranslate += slideSize + spaceBetween;
    return translate;
  });
}

/**
 * Total views when `slides-per-view='auto'`: count how many trailing
 * slides fit beyond one viewport, walking backwards until the accumulated
 * size exceeds the container (mirrors naive's auto total-view loop).
 */
export function computeAutoTotalView(
  slideSizesAxis: number[],
  translates: number[],
  perViewAxisSize: number,
): number {
  const length = slideSizesAxis.length;
  if (length === 0) return 0;
  let lastViewSize = slideSizesAxis[length - 1]!;
  let i = length;
  while (i > 1 && lastViewSize < perViewAxisSize) {
    i -= 1;
    lastViewSize += (translates[i] ?? 0) - (translates[i - 1] ?? 0);
  }
  return clampValue(i + 1, 1, length);
}

/**
 * Translate for the last view in `slides-per-view='auto'` mode: bring the
 * final slide flush with the viewport end.
 */
export function computeAutoLastTranslate(
  slideSizesAxis: number[],
  translates: number[],
  perViewAxisSize: number,
): number {
  const lastTranslate = translates[translates.length - 1];
  const overallSize =
    lastTranslate === undefined
      ? perViewAxisSize
      : lastTranslate + (slideSizesAxis[slideSizesAxis.length - 1] ?? 0);
  return overallSize - perViewAxisSize;
}

/* ────────────────────────── drag release ────────────────────────── */

/**
 * Nearest slide to a dropped translate position (drag release may skip
 * across multiple pages). Walks forward while the distance shrinks —
 * mirrors naive's scan in `handleTouchend`.
 */
export function findNearestTranslateIndex(translates: number[], currentTranslate: number): number {
  let prevOffset: number | null = null;
  let current = 0;
  for (let i = 0; i < translates.length; i += 1) {
    const offset = Math.abs((translates[i] ?? 0) - currentTranslate);
    if (prevOffset !== null && prevOffset < offset) {
      break;
    }
    prevOffset = offset;
    current = i;
  }
  return current;
}

/**
 * Flick detection on release when the drag stayed within one page:
 * `1` → next, `-1` → prev, `0` → stay. Past half the viewport, or
 * moving faster than 0.4 px/ms, counts as a page flip (naive values).
 */
export function resolveFlickDirection(
  dragOffset: number,
  perViewSize: number,
  timeElapsed: number,
): -1 | 0 | 1 {
  if (dragOffset > perViewSize / 2 || dragOffset / timeElapsed > FLICK_VELOCITY_THRESHOLD) {
    return -1;
  }
  if (dragOffset < -perViewSize / 2 || dragOffset / timeElapsed < -FLICK_VELOCITY_THRESHOLD) {
    return 1;
  }
  return 0;
}

/* ────────────────────────── wheel ────────────────────────── */

/**
 * Wheel direction for this event, or 0 when below the response step.
 * Shift maps a vertical delta onto the horizontal axis (naive behaviour);
 * a horizontal carousel only responds to horizontal deltas and a vertical
 * carousel only to vertical ones.
 */
export function resolveWheelDirection(
  deltaX: number,
  deltaY: number,
  shiftKey: boolean,
  vertical: boolean,
): -1 | 0 | 1 {
  let dx = deltaX;
  if (shiftKey && !dx) {
    dx = deltaY;
  }
  const multiplier = (dx || deltaY) > 0 ? 1 : -1;
  const delta = vertical ? deltaY : dx;
  if (multiplier * delta >= WHEEL_RESPONSE_STEP) {
    return multiplier === 1 ? 1 : -1;
  }
  return 0;
}

/* ────────────────────────── keyboard (dots focus) ────────────────────────── */

export type KeyboardSlideAction = 'prev' | 'next';

/**
 * Dots-focused arrow-key mapping (naive CarouselDots): PageUp always
 * means next and PageDown prev; ArrowUp/Down map to next/prev in vertical
 * direction, ArrowRight/Left in horizontal direction.
 */
export function resolveKeyboardAction(code: string, vertical: boolean): KeyboardSlideAction | null {
  switch (code) {
    case 'PageUp':
      return 'next';
    case 'PageDown':
      return 'prev';
    case 'ArrowUp':
      return vertical ? 'next' : null;
    case 'ArrowDown':
      return vertical ? 'prev' : null;
    case 'ArrowRight':
      return vertical ? null : 'next';
    case 'ArrowLeft':
      return vertical ? null : 'prev';
    default:
      return null;
  }
}
