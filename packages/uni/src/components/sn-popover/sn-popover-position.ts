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

/** Gap between the arrow apex and the trigger (px). Roomier than the
 * reference's tight 5px: the arrow reads as a detached pointer instead of
 * touching the trigger edge, and -start/-end labels stop crowding it. */
export const POP_GAP = 10;

/** Border-triangle footprint (px): 2 × the leg. */
const ARROW_WIDTH = POP_ARROW_SIZE * 2;

/** Keep the arrow fully on the bubble edge — a projected centre outside
 * the bubble (offset / viewport clamp / stale trigger) must not hang off it. */
function clampArrow(value: number, extent: number): number {
  const half = ARROW_WIDTH / 2;
  const max = Math.max(half, extent - half);
  return Math.min(Math.max(value, half), max);
}

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

/** One placement solved in VIEWPORT coordinates (px). */
export interface ViewportPlacement {
  /** Bubble top-left, viewport px (after the flip and the viewport clamp). */
  left: number;
  top: number;
  /** Arrow position along the anchored edge, px from the bubble's start. */
  arrowCenter: number;
  /**
   * The placement that was actually used. Differs from the requested one only
   * when the preferred side had no room and the bubble flipped.
   */
  placement: PopoverPlacement;
  /** Whether the bubble had to be pulled back inside the viewport. */
  clamped: boolean;
}

const FLIPPED_FAMILY: Record<string, string> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

/** Raw (unclamped) solution of one placement. */
interface RawPlacement {
  left: number;
  top: number;
  arrowCenter: number;
}

/** Solve one placement exactly as the reference table would, in viewport px. */
function solveRaw(
  placement: PopoverPlacement,
  trigger: PopoverRect,
  pop: { width: number; height: number },
  offset: PopoverOffset,
  visibleArrow: boolean,
): RawPlacement {
  const family = familyOf(placement);
  const align = placement.split('-')[1];
  const arrowSize = visibleArrow ? POP_ARROW_SIZE : 0;
  const { x, y } = resolveOffset(offset);
  const triggerRight = trigger.left + trigger.width;
  const horizontal = family === 'top' || family === 'bottom';

  // Family axis: the side of the trigger the bubble sits on.
  const below = trigger.bottom + arrowSize + POP_GAP;
  const above = trigger.top - arrowSize - POP_GAP - pop.height;
  const before = trigger.left - arrowSize - POP_GAP - pop.width;
  const after = triggerRight + arrowSize + POP_GAP;

  // Cross axis: centre / -start / -end, folding the offset in.
  const centreX = trigger.left + trigger.width / 2 - pop.width / 2;
  const centreY = trigger.top + trigger.height / 2 - pop.height / 2;
  const shiftX = edgeShift(trigger.width / 2, x);
  const shiftY = edgeShift(trigger.height / 2, y);

  let left: number;
  let top: number;
  if (horizontal) {
    top = family === 'top' ? above : below;
    left = align === 'start' ? trigger.left + shiftX : align === 'end' ? triggerRight - pop.width + shiftX : centreX + x;
  } else {
    left = family === 'left' ? before : after;
    top = align === 'start' ? trigger.top + shiftY : align === 'end' ? trigger.top + trigger.height - pop.height + shiftY : centreY + y;
  }

  // Arrow: the reference inset for -start / -end (counter-shifted by the
  // offset), otherwise the trigger's centre projected onto the anchored edge.
  const insetX = (pop.width >= trigger.width ? trigger.width / 2 : pop.width - 25) - x;
  const insetY = (pop.height >= trigger.height ? trigger.height / 2 : pop.height - 20) - y;
  const project = (): number =>
    horizontal ? trigger.left + trigger.width / 2 - left : trigger.top + trigger.height / 2 - top;
  let arrowCenter: number;
  if (align === 'start') arrowCenter = horizontal ? insetX : insetY;
  else if (align === 'end') arrowCenter = horizontal ? pop.width - insetX : pop.height - insetY;
  else arrowCenter = project();
  return { left, top, arrowCenter };
}

/**
 * Solve one placement in viewport coordinates — the geometry the `fixed`
 * bubble uses on mini-programs, where the host wrapper clips anything that
 * leaves the component box (`boundingClientRect` already reports viewport px).
 *
 * Three steps, in order:
 *   1. solve the requested placement like the reference table;
 *   2. if the bubble would leave the viewport on its anchored side and the
 *      OPPOSITE side has room, flip to it (keeping the -start/-end alignment);
 *   3. clamp whatever is left into the viewport, re-pointing a centred arrow
 *      at the trigger so a pushed-back bubble still looks attached.
 *
 * Without a viewport (`null` — the size could not be read yet) steps 2 and 3
 * are skipped and the raw placement is used: an unknown viewport must not be
 * mistaken for a zero-sized one, which would pin every bubble to the origin.
 */
export function computeViewportPlacement(
  placement: PopoverPlacement,
  trigger: PopoverRect,
  pop: { width: number; height: number },
  viewport: { width: number; height: number } | null,
  offset: PopoverOffset = 0,
  visibleArrow = true,
): ViewportPlacement {
  const raw = solveRaw(placement, trigger, pop, offset, visibleArrow);
  const empty: ViewportPlacement = {
    left: raw.left,
    top: raw.top,
    arrowCenter: raw.arrowCenter,
    placement,
    clamped: false,
  };
  if (viewport === null) return empty;

  const family = familyOf(placement);
  // Which axis the bubble stacks on: the top / bottom families offset
  // vertically, the left / right families horizontally.
  const stacksVertically = family === 'top' || family === 'bottom';
  const maxStart = stacksVertically ? viewport.height - pop.height : viewport.width - pop.width;
  /** Position of a solution along the stacking axis. */
  const along = (s: RawPlacement): number => (stacksVertically ? s.top : s.left);
  const fits = (s: RawPlacement): boolean => {
    const start = along(s);
    return start >= 0 && start <= maxStart;
  };

  let used = placement;
  let solved = raw;
  if (!fits(raw)) {
    const flippedFamily = FLIPPED_FAMILY[family] ?? family;
    const flipped = `${flippedFamily}${placement.slice(family.length)}` as PopoverPlacement;
    const candidate = solveRaw(flipped, trigger, pop, offset, visibleArrow);
    if (fits(candidate)) {
      used = flipped;
      solved = candidate;
    }
  }

  // Clamp into the viewport; a bubble bigger than the viewport anchors at 0.
  const clampedLeft = Math.min(Math.max(solved.left, 0), Math.max(0, viewport.width - pop.width));
  const clampedTop = Math.min(Math.max(solved.top, 0), Math.max(0, viewport.height - pop.height));
  const clamped = clampedLeft !== solved.left || clampedTop !== solved.top;
  let { arrowCenter } = solved;
  // Only the CENTRE family tracks the trigger after a clamp — the -start /
  // -end insets are relative to the bubble and stay valid where they are.
  if (clamped && placement.indexOf('-') === -1) {
    arrowCenter = stacksVertically
      ? trigger.left + trigger.width / 2 - clampedLeft
      : trigger.top + trigger.height / 2 - clampedTop;
  }
  return { left: clampedLeft, top: clampedTop, arrowCenter, placement: used, clamped };
}

/**
 * Inline styles for the `fixed` bubble. The arrow is positioned from the
 * bubble's own start edge on the anchored axis (the same numbers the absolute
 * table produces): the centre family at 50%, -start at the solved inset,
 * -end mirrored through `right` / `bottom`. Reads the ACTUAL placement so a
 * flipped bubble gets the matching axis.
 */
function viewportStyles(
  solved: ViewportPlacement,
  pop: { width: number; height: number },
): readonly [string, string] {
  const family = familyOf(solved.placement);
  const align = solved.placement.split('-')[1];
  const popStyle = `left: ${solved.left}px; top: ${solved.top}px;`;
  if (family === 'top' || family === 'bottom') {
    if (align === 'end') return [popStyle, `right: ${pop.width - solved.arrowCenter}px; transform: translateX(50%);`];
    if (align === 'start') return [popStyle, `left: ${solved.arrowCenter}px;`];
    return [popStyle, `left: ${clampArrow(solved.arrowCenter, pop.width)}px; transform: translateX(-50%);`];
  }
  if (align === 'end') return [popStyle, `bottom: ${pop.height - solved.arrowCenter}px; transform: translateY(50%);`];
  if (align === 'start') return [popStyle, `top: ${solved.arrowCenter}px;`];
  return [popStyle, `top: ${clampArrow(solved.arrowCenter, pop.height)}px; transform: translateY(-50%);`];
}
/** Create one popover position controller. */
export function createPopoverPosition(visibleArrow: boolean) {
  const popStyle = ref('');
  const arrowStyle = ref('');
  const popWidth = ref(0);
  const popHeight = ref(0);
  const width = ref(0);
  const height = ref(0);
  /**
   * The placement actually in effect — the requested one, or its opposite when
   * the viewport solve flipped the bubble. `null` until the first solve.
   */
  const actualPlacement = ref<PopoverPlacement | null>(null);
  /** The last (placement, offset) a solve ran with — `rederive` replays it. */
  let lastArgs: { placement: PopoverPlacement; offset: PopoverOffset } | null = null;
  /** Which coordinate space the last solve ran in — replayed by `rederive`. */
  let lastSpace: 'root' | 'viewport' = 'root';
  /** The viewport solve needs the trigger's POSITION too, plus the viewport. */
  let lastTrigger: PopoverRect | null = null;
  let lastViewport: { width: number; height: number } | null = null;

  /** Capture the trigger + bubble measurements. */
  function init(trigger: PopoverRect, pop: PopoverRect): void {
    width.value = trigger.width;
    height.value = trigger.height;
    popWidth.value = pop.width;
    popHeight.value = pop.height;
    lastTrigger = trigger;
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
    popStyle.value = pop;
    arrowStyle.value = arrow;
    // The absolute bubble never flips — the requested placement is the real one.
    lastSpace = 'root';
    actualPlacement.value = placement;
    return { popStyle: popStyle.value, arrowStyle: arrowStyle.value };
  }

  /**
   * Derive the styles for the `fixed` bubble (mini-program): viewport
   * coordinates, flipped / clamped into the viewport. Re-solves the trigger
   * from the latest `init` / `moveTrigger` measurement. `actualPlacement`
   * reflects a flip, so the arrow class follows where the bubble really is.
   */
  function controlViewport(
    placement: PopoverPlacement,
    offset: PopoverOffset,
    viewport: { width: number; height: number } | null,
  ): { popStyle: string; arrowStyle: string; placement: PopoverPlacement; arrowClass: string } {
    const trigger = lastTrigger;
    if (trigger === null) {
      return {
        popStyle: popStyle.value,
        arrowStyle: arrowStyle.value,
        placement,
        arrowClass: arrowClass(placement),
      };
    }
    lastArgs = { placement, offset };
    lastSpace = 'viewport';
    lastViewport = viewport;
    const solved = computeViewportPlacement(placement, trigger, {
      width: popWidth.value,
      height: popHeight.value,
    }, viewport, offset, visibleArrow);
    const [pop, arrow] = viewportStyles(solved, { width: popWidth.value, height: popHeight.value });
    popStyle.value = pop;
    arrowStyle.value = arrow;
    actualPlacement.value = solved.placement;
    return {
      popStyle: popStyle.value,
      arrowStyle: arrowStyle.value,
      placement: solved.placement,
      arrowClass: arrowClass(solved.placement),
    };
  }

  /** Record a fresh trigger rect without touching the bubble size. */
  function moveTrigger(trigger: PopoverRect): void {
    width.value = trigger.width;
    height.value = trigger.height;
    lastTrigger = trigger;
  }

  /** The trigger rect captured by the last `init` / `moveTrigger` — the
   * scroll-compensation baseline (viewport px). */
  function triggerRect(): PopoverRect | null {
    return lastTrigger;
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

  /** Replay the last solve — in the coordinate space it ran in. */
  function rederive(): void {
    if (lastArgs === null) return;
    if (lastSpace === 'viewport') controlViewport(lastArgs.placement, lastArgs.offset, lastViewport);
    else control(lastArgs.placement, lastArgs.offset);
  }

  return {
    popStyle,
    arrowStyle,
    actualPlacement,
    arrowClass,
    init,
    control,
    controlViewport,
    moveTrigger,
    triggerRect,
    updatePosition,
  };
}

export type PopoverPosition = ReturnType<typeof createPopoverPosition>;
