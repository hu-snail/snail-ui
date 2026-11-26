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
 * inside the component root on every platform). All four numbers the table
 * needs come from one `init` pass; `control` is pure over that state, and
 * `updatePosition` re-runs it only when the measured bubble size changed
 * (the `after-enter` leg — content may settle to a different natural size).
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

/** Gap between the trigger and the bubble (px). */
export const POP_GAP = 5;

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
  top: (c) => [`left: ${c.verticalX}px; bottom: ${c.verticalY}px; transform: translateX(-50%);`, `left: 50%;`],
  'top-start': (c) => [`left: ${c.offsetX}px; bottom: ${c.verticalY}px;`, `left: ${c.arrowX}px;`],
  'top-end': (c) => [`right: ${c.offsetX}px; bottom: ${c.verticalY}px;`, `right: ${c.arrowX}px; transform: translateX(50%);`],
  bottom: (c) => [`left: ${c.verticalX}px; top: ${c.verticalY}px; transform: translateX(-50%);`, `left: 50%;`],
  'bottom-start': (c) => [`left: ${c.offsetX}px; top: ${c.verticalY}px;`, `left: ${c.arrowX}px;`],
  'bottom-end': (c) => [`right: ${c.offsetX}px; top: ${c.verticalY}px;`, `right: ${c.arrowX}px; transform: translateX(50%);`],
  left: (c) => [`right: ${c.horizontalX}px; top: ${c.horizontalY}px; transform: translateY(-50%);`, `top: 50%;`],
  'left-start': (c) => [`right: ${c.horizontalX}px; top: ${c.offsetY}px;`, `top: ${c.arrowY}px;`],
  'left-end': (c) => [`right: ${c.horizontalX}px; bottom: ${c.offsetY}px;`, `bottom: ${c.arrowY}px; transform: translateY(50%);`],
  right: (c) => [`left: ${c.horizontalX}px; top: ${c.horizontalY}px; transform: translateY(-50%);`, `top: 50%;`],
  'right-start': (c) => [`left: ${c.horizontalX}px; top: ${c.offsetY}px;`, `top: ${c.arrowY}px;`],
  'right-end': (c) => [`left: ${c.horizontalX}px; bottom: ${c.offsetY}px;`, `bottom: ${c.arrowY}px; transform: translateY(50%);`],
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
/** Create one popover position controller. */
export function createPopoverPosition(visibleArrow: boolean) {
  const popStyle = ref('');
  const arrowStyle = ref('');
  const popWidth = ref(0);
  const popHeight = ref(0);
  const width = ref(0);
  const height = ref(0);
  /** The last (placement, offset) `control` ran with — `updatePosition` replays it. */
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
    };
    const [pop, arrow] = PLACEMENT_TABLE[placement](math);
    popStyle.value = pop;
    arrowStyle.value = arrow;
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
    if (lastArgs !== null) control(lastArgs.placement, lastArgs.offset);
    return true;
  }

  return { popStyle, arrowStyle, arrowClass, init, control, updatePosition };
}

export type PopoverPosition = ReturnType<typeof createPopoverPosition>;
