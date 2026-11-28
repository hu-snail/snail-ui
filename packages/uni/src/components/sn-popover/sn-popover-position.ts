/**
 * sn-popover placement math — the wd-popover `usePopover` table as pure state.
 *
 * The reference library (wot-ui `wd-popover`) positions the bubble from real
 * measurements instead of CSS anchoring: a hidden copy of the bubble is
 * rendered off-screen so its natural size can be read before it is shown,
 * then the trigger rect + that size are folded through a 12-entry placement
 * table into inline styles. This module is that table — free of `uni` and of
 * component internals — so the geometry is unit-testable on every host.
 *
 * Coordinates are root-relative px (the bubble is `position: absolute`
 * inside the component root on EVERY platform — the owner verified absolute
 * renders unclipped on the mini-program end, so the fixed-layer + viewport
 * solve was removed; see AUI-POP-MP-001 for the historical wrapper-clip
 * record). All four numbers the table needs come from one `init` pass;
 * `control` is pure over that state, and `updatePosition` re-runs it only
 * when the measured bubble size changed (the `after-enter` leg — content
 * may settle to a different natural size).
 */

import { ref } from 'vue';

/** 12-direction placement (wd-popover `PlacementType`). */
export type PopoverPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

/** `offset` prop: one number, `[x, y?]`, or `{ x, y }`. */
export type PopoverOffset = number | number[] | { x: number; y: number };

/** A measured rect (px). `bottom` is the trigger's bottom edge. */
export interface PopoverRect {
  left: number;
  top: number;
  width: number;
  height: number;
  bottom: number;
}

/** Arrow leg (px). */
export const POP_ARROW_SIZE = 9;

/** Gap between the arrow apex and the trigger (px). Roomier than the
 * reference's tight 5px: the arrow reads as a detached pointer instead of
 * touching the trigger edge, and -start/-end labels stop crowding it. */
export const POP_GAP = 10;

/** Half this size is the smallest trigger edge a centred arrow can hit. */
const MIN_CENTERED_EDGE = 17;

const ARROW_CLASS_BY_FAMILY: Record<string, string> = {
  bottom: 'sn-popover__arrow-up',
  top: 'sn-popover__arrow-down',
  left: 'sn-popover__arrow-right',
  right: 'sn-popover__arrow-left',
};

/** The reference placement table: [pop style, arrow style] per placement. */
const PLACEMENT_TABLE: Record<PopoverPlacement, (math: PlacementMath) => readonly [string, string]> = {
  top: (c) => [`left: ${c.verticalX}px; bottom: ${c.verticalY}px; transform: translateX(-50%);`, `left: ${c.centreArrowX}px; transform: translateX(-50%);`],
  'top-start': (c) => [`left: ${c.offsetX}px; bottom: ${c.verticalY}px;`, `left: ${c.arrowX}px;`],
  'top-end': (c) => [`right: ${c.offsetX}px; bottom: ${c.verticalY}px;`, `right: ${c.arrowX}px; transform: translateX(50%);`],
  bottom: (c) => [`left: ${c.verticalX}px; top: ${c.verticalY}px; transform: translateX(-50%);`, `left: ${c.centreArrowX}px; transform: translateX(-50%);`],
  'bottom-start': (c) => [`left: ${c.offsetX}px; top: ${c.verticalY}px;`, `left: ${c.arrowX}px;`],
  'bottom-end': (c) => [`right: ${c.offsetX}px; top: ${c.verticalY}px;`, `right: ${c.arrowX}px; transform: translateX(50%);`],
  left: (c) => [`right: ${c.horizontalX}px; top: ${c.horizontalY}px; transform: translateY(-50%);`, `top: ${c.centreArrowY}px; transform: translateY(-50%);`],
  'left-start': (c) => [`right: ${c.horizontalX}px; top: ${c.offsetY}px;`, `top: ${c.arrowY}px;`],
  'left-end': (c) => [`right: ${c.horizontalX}px; bottom: ${c.offsetY}px;`, `bottom: ${c.arrowY}px; transform: translateY(50%);`],
  right: (c) => [`left: ${c.horizontalX}px; top: ${c.horizontalY}px; transform: translateY(-50%);`, `top: ${c.centreArrowY}px; transform: translateY(-50%);`],
  'right-start': (c) => [`left: ${c.horizontalX}px; top: ${c.offsetY}px;`, `top: ${c.arrowY}px;`],
  'right-end': (c) => [`left: ${c.horizontalX}px; bottom: ${c.offsetY}px;`, `bottom: ${c.arrowY}px; transform: translateY(50%);`],
};

/**
 * Rounded-arrow table: the \`ARROW_SQUARE\`px square centred on the anchored
 * edge point (root-relative), rotated 45° inline. Same anchor values the
 * sharp table centres its triangle on.
 */
const ROUNDED_TABLE: Record<PopoverPlacement, (math: PlacementMath) => string> = {
  /* The perpendicular offset is -6px flat: the arrow's containing block (the
   * pos layer) ALREADY starts at the bubble's anchored edge, so only half the
   * 12px square protrudes past it. The along-edge coordinate comes from the
   * same insets the sharp triangle centres on. */
  top: (c) => `left: ${c.centreArrowX - 6}px; bottom: -6px;`,
  'top-start': (c) => `left: ${c.arrowX - 6}px; bottom: -6px;`,
  'top-end': (c) => `right: ${c.arrowX - 6}px; bottom: -6px;`,
  bottom: (c) => `left: ${c.centreArrowX - 6}px; top: -6px;`,
  'bottom-start': (c) => `left: ${c.arrowX - 6}px; top: -6px;`,
  'bottom-end': (c) => `right: ${c.arrowX - 6}px; top: -6px;`,
  left: (c) => `top: ${c.centreArrowY - 6}px; right: -6px;`,
  'left-start': (c) => `top: ${c.arrowY - 6}px; right: -6px;`,
  'left-end': (c) => `bottom: ${c.arrowY - 6}px; right: -6px;`,
  right: (c) => `top: ${c.centreArrowY - 6}px; left: -6px;`,
  'right-start': (c) => `top: ${c.arrowY - 6}px; left: -6px;`,
  'right-end': (c) => `bottom: ${c.arrowY - 6}px; left: -6px;`,
};

interface PlacementMath {
  verticalX: number;
  verticalY: number;
  horizontalX: number;
  horizontalY: number;
  offsetX: number;
  offsetY: number;
  arrowX: number;
  arrowY: number;
  /** Centre-family arrow position: the trigger centre projected into the
   * bubble (the offset shifts the arrow the other way). */
  centreArrowX: number;
  centreArrowY: number;
}

function familyOf(placement: PopoverPlacement): string {
  // `split` always yields at least one segment; the default only satisfies
  // `noUncheckedIndexedAccess`.
  return placement.split('-')[0] ?? '';
}

/** Resolve the two offset axes (the y axis defaults to x). */
function resolveOffset(offset: PopoverOffset): { x: number; y: number } {
  if (Array.isArray(offset)) {
    // `[x, y?]`: the y axis defaults to x when only x is given.
    const [x = 0, y = x] = offset as [number?, number?];
    return { x, y };
  }
  if (typeof offset === 'object' && offset !== null) return { x: offset.x, y: offset.y };
  return { x: offset, y: offset };
}

/**
 * -start / -end cross-axis shift. A trigger at least 34px on the axis
 * centres its arrow naturally; a smaller one is shifted so the arrow still
 * lands on it.
 */
function edgeShift(half: number, offsetAxis: number): number {
  return (half - MIN_CENTERED_EDGE > 0 ? 0 : half - 25) + offsetAxis;
}

/** Rounded-arrow square size (px) — rotated 45°, centred on the edge. */
export const ARROW_SQUARE = 12;

/** Border-triangle footprint (px): 2 × the leg. */
const ARROW_WIDTH = POP_ARROW_SIZE * 2;

/** Keep the arrow fully on the bubble edge — a projected centre outside
 * the bubble (offset / stale trigger) must not hang off it. */
function clampArrow(value: number, extent: number): number {
  const half = ARROW_WIDTH / 2;
  const max = Math.max(half, extent - half);
  return Math.min(Math.max(value, half), max);
}

/** Create one popover position controller. */
export function createPopoverPosition(visibleArrow: boolean) {
  const popStyle = ref('');
  const arrowStyle = ref('');
  const roundedStyle = ref('');
  const popWidth = ref(0);
  const popHeight = ref(0);
  const width = ref(0);
  const height = ref(0);
  /**
   * The placement actually in effect — always the requested one on the
   * absolute bubble (it never flips). `null` until the first solve.
   */
  const actualPlacement = ref<PopoverPlacement | null>(null);
  /** The last (placement, offset) a solve ran with — `rederive` replays it. */
  let lastArgs: { placement: PopoverPlacement; offset: PopoverOffset } | null = null;

  /** Capture the trigger + bubble measurements. */
  function init(trigger: PopoverRect, pop: PopoverRect): void {
    width.value = trigger.width;
    height.value = trigger.height;
    popWidth.value = pop.width;
    popHeight.value = pop.height;
  }

  /** Arrow orientation classes for one placement; empty when hidden. */
  function arrowClass(placement: PopoverPlacement): string {
    if (!visibleArrow) return '';
    return `sn-popover__arrow ${ARROW_CLASS_BY_FAMILY[familyOf(placement)]}`;
  }

  /** Derive the pop / arrow inline styles for one placement + offset. */
  function control(placement: PopoverPlacement, offset: PopoverOffset): { popStyle: string; arrowStyle: string } {
    lastArgs = { placement, offset };
    const arrowSize = visibleArrow ? POP_ARROW_SIZE : 0;
    const { x, y } = resolveOffset(offset);
    const math: PlacementMath = {
      verticalX: width.value / 2,
      verticalY: arrowSize + height.value + POP_GAP,
      horizontalX: width.value + arrowSize + POP_GAP,
      horizontalY: height.value / 2,
      offsetX: edgeShift(width.value / 2, x),
      offsetY: edgeShift(height.value / 2, y),
      arrowX: (popWidth.value >= width.value ? width.value / 2 : popWidth.value - 25) - x,
      arrowY: (popHeight.value >= height.value ? height.value / 2 : popHeight.value - 20) - y,
      centreArrowX: clampArrow(popWidth.value / 2 - x, popWidth.value),
      centreArrowY: clampArrow(popHeight.value / 2 - y, popHeight.value),
    };
    const [pop, arrow] = PLACEMENT_TABLE[placement](math);
    const rounded = ROUNDED_TABLE[placement](math) + ` transform: rotate(45deg);`;
    // Explicit width from the measurement: an absolute bubble's containing
    // block is the inline-block root (trigger-sized) — shrink-to-fit would
    // clamp wide content (slotted bodies) to the trigger's width.
    popStyle.value = pop + ` width: ${popWidth.value}px;`;
    arrowStyle.value = arrow;
    roundedStyle.value = rounded;
    // The absolute bubble never flips — the requested placement is the real one.
    actualPlacement.value = placement;
    return { popStyle: popStyle.value, arrowStyle: arrowStyle.value };
  }

  /**
   * Re-derive the styles from a freshly measured bubble size. Returns
   * whether the placement was re-derived.
   */
  function updatePosition(pop: PopoverRect): boolean {
    if (pop.width === popWidth.value && pop.height === popHeight.value) return false;
    popWidth.value = pop.width;
    popHeight.value = pop.height;
    rederive();
    return true;
  }

  /** Replay the last solve. */
  function rederive(): void {
    if (lastArgs === null) return;
    control(lastArgs.placement, lastArgs.offset);
  }

  return {
    popStyle,
    arrowStyle,
    roundedStyle,
    actualPlacement,
    arrowClass,
    init,
    control,
    updatePosition,
  };
}

export type PopoverPosition = ReturnType<typeof createPopoverPosition>;
