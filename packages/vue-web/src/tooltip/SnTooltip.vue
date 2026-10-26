<script setup lang="ts">
/**
 * SnTooltip — floating tooltip with hover/click trigger + teleport (AUI-WEB-FEED-006).
 *
 * Reference library: naive-ui `n-tooltip`
 *   (https://www.naiveui.com/zh-CN/light/components/tooltip)
 * Per AGENTS.md §112, props + semantics mirror n-tooltip 1:1.
 *
 * 1:1 parity (this version):
 *   - show / defaultShow (controlled vs uncontrolled)
 *   - trigger ('hover' | 'click' | 'focus' | 'manual')
 *   - placement ('top-start' | 'top' | 'top-end' | ... | 'left-end')
 *   - delay (open) + duration (close); delay also accepts [open, close]
 *   - arrow / showArrow semantics / arrowPointToCenter / arrowClass /
 *     arrowStyle
 *   - content / disabled / raw / animated / overlap / scrollable
 *   - displayDirective ('if' | 'show')
 *   - flip / keepAliveOnHover / width ('trigger' | number) / zIndex / to
 *   - contentClass / contentStyle / onClickoutside
 *
 * `wrapped` is a local addition (default true) that keeps the pointer
 * listeners on a structural `<span>`; upstream's `raw` is the inverse
 * concern and both are accepted.
 *
 * Design:
 *   The trigger slot is the visible target (e.g. a button). The popover
 *   renders into a `<Teleport to="body">` so it isn't clipped by any
 *   parent `overflow: hidden` (SnModal, SnDrawer, etc.) and so the
 *   z-index is high by default. Positioning uses fixed coordinates
 *   captured by getBoundingClientRect() — recomputed on every show and
 *   on scroll/resize while open. Boundary detection flips the placement
 *   if the chosen side would push the popover outside the viewport.
 *
 *   Per AGENTS.md §40 + §41, the component owns its timers, listeners,
 *   and disposers — they are torn down on unmount and on `show` → false.
 *
 * Usage:
 *   <SnTooltip content="Ideas">
 *     <button class="sn-fab">...</button>
 *   </SnTooltip>
 *
 *   <SnTooltip :show="open" @update:show="open = false" placement="bottom">
 *     ...
 *   </SnTooltip>
 */

import { computed, nextTick, onBeforeUnmount, ref, useSlots, watch, type CSSProperties } from 'vue';

defineOptions({ name: 'SnTooltip' });

export type SnTooltipPlacement =
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'right-start'
  | 'right'
  | 'right-end'
  | 'bottom-start'
  | 'bottom'
  | 'bottom-end'
  | 'left-start'
  | 'left'
  | 'left-end';

const props = withDefaults(
  defineProps<{
    /**
     * Whether to show the tooltip. When `undefined`, falls back to
     * uncontrolled mode using internal state. Mirrors n-tooltip `show`.
     */
    show?: boolean | undefined;
    /**
     * Initial show value for uncontrolled mode. Mirrors n-tooltip
     * `defaultShow`. Default false.
     */
    defaultShow?: boolean;
    /**
     * What user gesture opens the tooltip. Mirrors n-tooltip `trigger`.
     * Default 'hover'. 'manual' disables any automatic show/hide — only
     * `show` / `update:show` controls the state.
     */
    trigger?: 'hover' | 'click' | 'focus' | 'manual';
    /**
     * Where to render the tooltip relative to the trigger. Mirrors
     * n-tooltip `placement`. Default 'top'.
     */
    placement?: SnTooltipPlacement;
    /**
     * Open/close debounce in ms. Single number = same delay for open+close.
     * Use an array `[open, close]` for asymmetric delays (e.g. snappier
     * open, slower close). Mirrors n-tooltip `delay`. Default 100.
     */
    delay?: number | [number, number];
    /**
     * Show the directional arrow. Mirrors n-tooltip `arrow`. Default true.
     */
    arrow?: boolean;
    /**
     * The tooltip body. Can be a plain string or any Vue-renderable value.
     * Mirrors n-tooltip `content`.
     */
    content?: string | undefined;
    /**
     * Render the trigger inside a wrapper `<span>` that owns the pointer
     * listeners. Set to `false` when the slot already renders a focusable
     * element and the extra wrapper would break layout. Mirrors n-popover
     * `raw` (inverted: this library defaults to wrapping). Default true.
     */
    wrapped?: boolean;
    /**
     * Skip the library's own bubble styling so the caller can paint the
     * popover entirely. Mirrors n-popover `raw`. Default false.
     */
    raw?: boolean;
    /**
     * Animate the popover in/out. Mirrors n-popover `animated`. Default true.
     */
    animated?: boolean;
    /**
     * Point the arrow at the trigger's centre rather than its edge. Mirrors
     * n-popover `arrowPointToCenter`. Default false.
     */
    arrowPointToCenter?: boolean;
    /** Class on the arrow element. Mirrors n-popover `arrowClass`. */
    arrowClass?: string;
    /** Style on the arrow element. Mirrors n-popover `arrowStyle`. */
    arrowStyle?: CSSProperties;
    /** Class on the scrollable body. Mirrors n-popover `contentClass`. */
    contentClass?: string;
    /** Style on the scrollable body. Mirrors n-popover `contentStyle`. */
    contentStyle?: CSSProperties;
    /**
     * `'if'` unmounts the popover on hide; `'show'` keeps the node and
     * toggles `display`. Mirrors n-popover `displayDirective`. Default 'if'.
     */
    displayDirective?: 'if' | 'show';
    /**
     * How long the popover lingers before closing, in ms. Distinct from
     * `delay`, which gates opening. Mirrors n-popover `duration`.
     * Default 100.
     */
    duration?: number;
    /**
     * Flip to the opposite side when the chosen placement would overflow
     * the viewport. Mirrors n-popover `flip`. Default true.
     */
    flip?: boolean;
    /**
     * Keep the popover open while the pointer is inside it (hover trigger
     * only). Mirrors n-popover `keepAliveOnHover`. Default true.
     */
    keepAliveOnHover?: boolean;
    /**
     * Let the popover overlap the trigger instead of sitting beside it.
     * Mirrors n-popover `overlap`. Default false.
     */
    overlap?: boolean;
    /**
     * Make the popover body scrollable once it exceeds `max-height`.
     * Mirrors n-popover `scrollable`. Default false.
     */
    scrollable?: boolean;
    /**
     * Where to teleport the popover. `false` keeps it inline (useful inside
     * transform-heavy ancestors). Mirrors n-popover `to`. Default 'body'.
     */
    to?: string | HTMLElement | false;
    /**
     * Pin the popover width to the trigger's width. Mirrors n-popover
     * `width` = `'trigger'`; a number sets a fixed width in px.
     */
    width?: number | 'trigger';
    /**
     * Explicit stacking order. Mirrors n-popover `zIndex`.
     */
    zIndex?: number;
    /**
     * Called when a click lands outside the popover and its trigger.
     * Mirrors n-popover `onClickoutside`.
     */
    onClickoutside?: (e: MouseEvent) => void;
    /**
     * Disable showing entirely. Mirrors n-tooltip `disabled`. Default false.
     */
    disabled?: boolean;
  }>(),
  {
    show: undefined,
    defaultShow: false,
    trigger: 'hover',
    placement: 'top',
    delay: 100,
    arrow: true,
    content: '',
    wrapped: true,
    raw: false,
    animated: true,
    arrowPointToCenter: false,
    arrowClass: undefined as any,
    arrowStyle: undefined as any,
    contentClass: undefined as any,
    contentStyle: undefined as any,
    displayDirective: 'if',
    duration: 100,
    flip: true,
    keepAliveOnHover: true,
    overlap: false,
    scrollable: false,
    to: 'body',
    width: undefined as any,
    zIndex: undefined as any,
    onClickoutside: undefined as any,
    disabled: false,
  },
);

const emit = defineEmits<{
  /** Fired when show state changes (v-model:show). Mirrors n-tooltip `on-update-show`. */
  (e: 'update:show', show: boolean): void;
  /** Fired when the popover appears. Mirrors n-tooltip `on-show`. */
  (e: 'show'): void;
  /** Fired when the popover hides. Mirrors n-tooltip `on-hide`. */
  (e: 'hide'): void;
}>();

const slots = useSlots();

/* ─────────── Internal show state ─────────── */

const uncontrolledShow = ref<boolean>(props.defaultShow);
const isControlled = computed(() => props.show !== undefined);
const visible = computed<boolean>(() =>
  isControlled.value ? (props.show as boolean) : uncontrolledShow.value,
);

function setVisible(next: boolean): void {
  if (props.disabled) return;
  if (isControlled.value) {
    // Parent owns state — only emit, never write our own ref.
    if (visible.value !== next) emit('update:show', next);
  } else {
    uncontrolledShow.value = next;
  }
  if (next) emit('show');
  else emit('hide');
}

/* ─────────── Delay timers ─────────── */

/**
 * `delay` gates opening; `duration` gates closing. A `[open, close]` tuple
 * on `delay` overrides `duration` for the closing side, which keeps the
 * convenience of the pair form without a second prop.
 */
const [openDelay, closeDelay] = computed<[number, number]>(() => {
  const d = props.delay;
  return Array.isArray(d) ? d : [d, props.duration];
}).value as [number, number];

let openTimer: ReturnType<typeof setTimeout> | null = null;
let closeTimer: ReturnType<typeof setTimeout> | null = null;
function clearTimers(): void {
  if (openTimer) {
    clearTimeout(openTimer);
    openTimer = null;
  }
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
}

function scheduleOpen(): void {
  clearTimers();
  if (openDelay <= 0) setVisible(true);
  else openTimer = setTimeout(() => setVisible(true), openDelay);
}
function scheduleClose(): void {
  clearTimers();
  if (closeDelay <= 0) setVisible(false);
  else closeTimer = setTimeout(() => setVisible(false), closeDelay);
}

/* ─────────── Trigger event wiring ─────────── */

const triggerEl = ref<HTMLElement | null>(null);
const popoverEl = ref<HTMLElement | null>(null);

function onTriggerMouseEnter(): void {
  if (props.trigger !== 'hover') return;
  scheduleOpen();
}
function onTriggerMouseLeave(e: MouseEvent): void {
  if (props.trigger !== 'hover') return;
  // If the user moves directly into the popover, keep it open. The popover
  // listens for mouseenter/mouseleave separately and re-schedules.
  const to = e.relatedTarget as Node | null;
  if (to && popoverEl.value && popoverEl.value.contains(to)) return;
  scheduleClose();
}
function onTriggerClick(): void {
  if (props.trigger !== 'click') return;
  setVisible(!visible.value);
}
function onTriggerFocus(): void {
  if (props.trigger !== 'focus') return;
  scheduleOpen();
}
function onTriggerBlur(e: FocusEvent): void {
  if (props.trigger !== 'focus') return;
  const to = e.relatedTarget as Node | null;
  if (to && popoverEl.value && popoverEl.value.contains(to)) return;
  scheduleClose();
}

/* Popover hover bridge — keep popover open while user moves between
 * trigger and popover. The mouseleave→mouseenter gap is bridged by
 * either side's enter cancelling the other's close timer. */
function onPopoverMouseEnter(): void {
  if (props.trigger !== 'hover') return;
  // Without keepAliveOnHover the popover closes as soon as the pointer
  // leaves the trigger, so entering the bubble must not cancel the timer.
  if (!props.keepAliveOnHover) return;
  clearTimers();
}
function onPopoverMouseLeave(e: MouseEvent): void {
  if (props.trigger !== 'hover') return;
  if (!props.keepAliveOnHover) return;
  const to = e.relatedTarget as Node | null;
  if (to && triggerEl.value && triggerEl.value.contains(to)) return;
  scheduleClose();
}

/* ─────────── Positioning + boundary detection ─────────── */

/**
 * Arrow geometry, in px. The triangle is drawn with borders below (see
 * `.sn-tooltip__arrow--*`), so this constant is the single place the JS
 * layout reserve and the CSS shape are kept in step.
 */
const ARROW_SIZE = 8;

interface PositionRect {
  top: number;
  left: number;
  width: number;
  height: number;
  /** Convenience for the trigger's right edge. */
  right: number;
  /** Convenience for the trigger's bottom edge. */
  bottom: number;
}

const popoverStyle = ref<Record<string, string>>({});
const arrowStyle = ref<Record<string, string>>({});

/**
 * Which side the popover actually ended up on. `placement` is only the
 * *request*: boundary detection can flip it, and the flip has to be
 * reflected by both the arrow direction and the enter animation. Mirroring
 * `placement` alone (the previous behaviour) left a flipped bubble pointing
 * the wrong way, with its arrow parked outside the bubble.
 */
const resolvedSide = ref<'top' | 'right' | 'bottom' | 'left'>('top');

/**
 * Compute the popover position. Layout strategy: measure trigger +
 * popover rectangles, pick the side implied by `placement` (e.g.
 * `top-start` = above with left-aligned to trigger). If the chosen side
 * overflows the viewport, flip to the opposite (top → bottom, left →
 * right) and re-apply. Then position the arrow so it points at the
 * trigger's center edge — clamped to the popover's near edge so it
 * doesn't drift off the bubble.
 */
async function recompute(): Promise<void> {
  if (!visible.value) return;
  await nextTick();
  const trig = triggerEl.value;
  const pop = popoverEl.value;
  if (!trig || !pop) return;

  const trigRect = trig.getBoundingClientRect();
  const popRect = pop.getBoundingClientRect();
  // Extend the rectangles with right / bottom for the position math.
  const trigBox: PositionRect = {
    top: trigRect.top,
    left: trigRect.left,
    width: trigRect.width,
    height: trigRect.height,
    right: trigRect.right,
    bottom: trigRect.bottom,
  };
  const popBox: PositionRect = {
    top: popRect.top,
    left: popRect.left,
    width: popRect.width,
    height: popRect.height,
    right: popRect.right,
    bottom: popRect.bottom,
  };
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const margin = 8; // minimum gap between popover and viewport edge
  // `overlap` seats the bubble on the trigger instead of beside it, so no
  // arrow-sized gap is reserved. A resting `overlap` is 8px by default, so
  // the reserved band and the CSS arrow size must agree — keep ARROW_SIZE
  // and `.sn-tooltip__arrow--*`'s border-width in sync.
  const arrowSize = props.overlap ? 0 : ARROW_SIZE;

  // Determine initial side + alignment from placement string
  // e.g. 'top-start' → side='top', align='start'
  const [sideRaw, alignRaw = 'center'] = props.placement.split('-');
  const side = sideRaw as 'top' | 'right' | 'bottom' | 'left';
  const align = alignRaw as 'start' | 'center' | 'end';

  /**
   * How far the arrow's centre must sit from the bubble's own edge. Half the
   * border-box (8px of the 16px triangle) is the geometric minimum; inset it
   * a little further so the triangle's flat base stays inside the rounded
   * corner instead of poking out of it.
   */
  const arrowInset = arrowSize > 0 ? arrowSize + 4 : 0;

  /**
   * Nudge a coordinate back inside `[margin, limit - size - margin]` so a
   * bubble that is wider (or taller) than the space beside its trigger is
   * still fully readable instead of being clipped by the viewport.
   */
  function clampWithin(value: number, size: number, limit: number): number {
    const max = Math.min(value, limit - size - margin);
    // `Math.max` runs second so a bubble larger than the viewport anchors to
    // the near edge rather than escaping past the far one.
    return Math.max(margin, max);
  }

  // Helper: lay out the bubble on `sideChoice`. `strict` returns null when
  // the result cannot be shown in full — used when picking which side to
  // use. `strict: false` clamps along the cross axis so we never end up
  // without a rect.
  function rectFor(
    sideChoice: typeof side,
    trigger: PositionRect,
    pop: PositionRect,
    strict = true,
  ): PositionRect | null {
    const out: PositionRect = {
      top: 0,
      left: 0,
      width: pop.width,
      height: pop.height,
      right: 0,
      bottom: 0,
    };
    switch (sideChoice) {
      case 'top':
        out.top = trigger.top - pop.height - arrowSize;
        break;
      case 'bottom':
        out.top = trigger.bottom + arrowSize;
        break;
      case 'left':
        out.left = trigger.left - pop.width - arrowSize;
        break;
      case 'right':
        out.left = trigger.right + arrowSize;
        break;
    }
    // Cross axis: order the bubble per `align`. Used verbatim while probing
    // (so an honest overflow can trigger a flip), clamped when we have
    // committed to this side.
    const place = (raw: number, size: number, limit: number): number =>
      strict ? raw : clampWithin(raw, size, limit);
    // Horizontal axis
    if (sideChoice === 'top' || sideChoice === 'bottom') {
      switch (align) {
        case 'start':
          out.left = place(trigger.left, pop.width, vw);
          break;
        case 'end':
          out.left = place(trigger.right - pop.width, pop.width, vw);
          break;
        default:
          out.left = place(trigger.left + trigger.width / 2 - pop.width / 2, pop.width, vw);
      }
    }
    // Vertical axis
    else {
      switch (align) {
        case 'start':
          out.top = place(trigger.top, pop.height, vh);
          break;
        case 'end':
          out.top = place(trigger.bottom - pop.height, pop.height, vh);
          break;
        default:
          out.top = place(trigger.top + trigger.height / 2 - pop.height / 2, pop.height, vh);
      }
    }
    // Check viewport fit along the *main* axis. The cross axis is already
    // clamped when `!strict`, so re-testing it would reject rects that
    // rectFor just made fit.
    if (sideChoice === 'top' || sideChoice === 'bottom') {
      if (out.top < margin || out.top + pop.height > vh - margin) return null;
    } else {
      if (out.left < margin || out.left + pop.width > vw - margin) return null;
    }
    return out;
  }

  /**
   * Does a laid-out bubble keep its *cross* axis inside the viewport? The
   * main axis is already validated by `rectFor`'s strict probe; this catches
   * the edge-aligned case (`top-start` near the right edge) where the bubble
   * fits vertically but hangs off the side.
   */
  function fitsCrossAxis(
    sideChoice: typeof side,
    rect: PositionRect,
    width: number,
    height: number,
  ): boolean {
    if (sideChoice === 'top' || sideChoice === 'bottom') {
      return rect.left >= margin && rect.left + rect.width <= width - margin;
    }
    return rect.top >= margin && rect.top + rect.height <= height - margin;
  }

  // Try the requested side; flip if the main axis doesn't fit and `flip`
  // allows it.
  const opposite: Record<typeof side, typeof side> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
  };
  let finalSide = side;
  let r = rectFor(side, trigBox, popBox);
  if (!r && props.flip) {
    const flipped = rectFor(opposite[side], trigBox, popBox);
    if (flipped) {
      r = flipped;
      finalSide = opposite[side];
    }
  }
  // Nothing exact on the main axis, or the bubble landed with its *cross*
  // axis hanging off screen (an edge-aligned `top-start`/`bottom-end` near a
  // viewport edge). Lay it out on the chosen side and clamp the cross axis,
  // so the bubble is nudged back into view rather than clipped. Returning the
  // raw rect here used to push edge-aligned bubbles past the viewport edge,
  // and when *both* axes failed it left `r` null and crashed on `r.top`.
  if (!r || !fitsCrossAxis(finalSide, r, vw, vh)) {
    r = rectFor(finalSide, trigBox, popBox, false)!;
  }
  resolvedSide.value = finalSide;

  // `width="trigger"` pins the bubble's horizontal size to the trigger.
  const widthStyle =
    props.width === 'trigger'
      ? { width: `${trigBox.width}px` }
      : typeof props.width === 'number'
        ? { width: `${props.width}px` }
        : {};

  popoverStyle.value = {
    position: 'fixed',
    top: `${r.top}px`,
    left: `${r.left}px`,
    ...Object.fromEntries(Object.entries(widthStyle).map(([k, v]) => [k, String(v)])),
    ...(props.zIndex === undefined ? {} : { zIndex: String(props.zIndex) }),
  };

  // Arrow position: aim at the trigger's midpoint on the relevant axis,
  // or at the popover's own centre when `arrowPointToCenter` is set.
  //
  // The object is built from scratch on every pass rather than mutated:
  // only the two axes that apply to the resolved side are ever set, so a
  // stale `left` / `top` from the previous orientation cannot survive a
  // flip, a scroll, or a resize — which is exactly how the arrow used to
  // detach from the bubble.
  const arrowOffset: Record<string, string> = {};
  const popCenterX = r.left + r.width / 2;
  const popCenterY = r.top + r.height / 2;
  const triggerCenterX = trigBox.left + trigBox.width / 2;
  const triggerCenterY = trigBox.top + trigBox.height / 2;
  const aimX = props.arrowPointToCenter ? popCenterX : triggerCenterX;
  const aimY = props.arrowPointToCenter ? popCenterY : triggerCenterY;

  /**
   * Clamp the arrow's centre into the bubble, keeping `arrowInset` of margin
   * at both ends. `Math.max(lo, ...)` runs last so a bubble narrower than the
   * inset band pins the arrow to its start edge instead of escaping past the
   * end edge.
   */
  function clampAim(aim: number, start: number, size: number): number {
    const lo = start + arrowInset;
    const hi = start + size - arrowInset;
    return Math.max(lo, Math.min(aim, hi));
  }

  if (finalSide === 'top' || finalSide === 'bottom') {
    const arrowCenter = clampAim(aimX, r.left, r.width);
    arrowOffset.left = `${arrowCenter - r.left}px`;
    arrowOffset[finalSide === 'top' ? 'bottom' : 'top'] = `-${arrowSize}px`;
  } else {
    const arrowCenter = clampAim(aimY, r.top, r.height);
    arrowOffset.top = `${arrowCenter - r.top}px`;
    arrowOffset[finalSide === 'left' ? 'right' : 'left'] = `-${arrowSize}px`;
  }
  arrowStyle.value = arrowOffset;
}

/* Recompute whenever visible flips to true, and on resize / scroll
 * while open. We listen on window — the canvas resize observer for
 * arbitrary parent containers is out of scope for v0. */
let resizeObserver: ResizeObserver | null = null;
watch(
  visible,
  async (v) => {
    // SSR guard (§SSR): the immediate pass runs during server render where
    // window / document do not exist; listeners are client-only.
    if (typeof window === 'undefined') return;
    if (v) {
      await recompute();
      if (!resizeObserver && typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => {
          void recompute();
        });
        // Observe document body for layout shifts while open.
        resizeObserver.observe(document.body);
      }
      window.addEventListener('scroll', onScrollOrResize, true);
      window.addEventListener('resize', onScrollOrResize);
    } else {
      cancelPendingRecompute();
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    }
    // `immediate` matters for controlled consumers that mount already open:
    // without it the first render never positions the popover, because
    // `visible` never transitions from false to true.
  },
  { immediate: true },
);
/* Scroll (capture — any container) and resize both land here. Recomputes are
 * coalesced to one per animation frame: a scroll burst would otherwise run
 * the full measure-and-write positioning pass per event and thrash layout. */
let recomputeFrame: number | null = null;
function cancelPendingRecompute(): void {
  if (recomputeFrame !== null) {
    window.cancelAnimationFrame(recomputeFrame);
    recomputeFrame = null;
  }
}
function onScrollOrResize(): void {
  if (recomputeFrame !== null || !visible.value) return;
  recomputeFrame = window.requestAnimationFrame(() => {
    recomputeFrame = null;
    if (visible.value) void recompute();
  });
}

/* ─────────── Outside-click dismiss (click trigger only) ─────────── */

function onDocumentMouseDown(e: MouseEvent): void {
  if (props.trigger !== 'click' || !visible.value) return;
  const t = e.target as Node | null;
  if (!t) return;
  if (triggerEl.value && triggerEl.value.contains(t)) return;
  if (popoverEl.value && popoverEl.value.contains(t)) return;
  props.onClickoutside?.(e);
  setVisible(false);
}

watch(
  visible,
  (v) => {
    if (props.trigger !== 'click') return;
    if (v) document.addEventListener('mousedown', onDocumentMouseDown);
    else document.removeEventListener('mousedown', onDocumentMouseDown);
    // Same reason as the positioning watcher: a controlled popover can mount
    // already visible, and the listener must be attached on that first pass.
  },
  { immediate: true },
);

/* ─────────── Cleanup ─────────── */

onBeforeUnmount(() => {
  clearTimers();
  cancelPendingRecompute();
  window.removeEventListener('scroll', onScrollOrResize, true);
  window.removeEventListener('resize', onScrollOrResize);
  document.removeEventListener('mousedown', onDocumentMouseDown);
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
});

/* When controlled show changes from false → true via parent (e.g. another
 * component tells us to show), recompute. Same in reverse — we don't
 * actively hide, but if the parent flips us off while we're in a timer,
 * the next tick should reset. */
watch(
  () => props.show,
  (s) => {
    if (s === undefined) return;
    if (s && !visible.value) {
      clearTimers();
      setVisible(true);
    }
  },
);

const arrowPlacementClass = computed(() => {
  // Driven by the *resolved* side rather than the requested `placement`:
  // a bubble flipped by boundary detection still has to point its arrow —
  // and play its enter animation — the way it actually landed.
  return `sn-tooltip__arrow--${resolvedSide.value}`;
});

/**
 * Modifier for the bubble itself. Keeps the requested placement (so
 * consumers can style `sn-tooltip--top-start` and friends) *and* adds the
 * resolved side, which the directional enter animation keys off. Without
 * the second class a flipped bubble would animate in from the side it was
 * asked for, not the side it landed on.
 */
const popoverPlacementClass = computed<string[]>(() => {
  const requested = `sn-tooltip--${props.placement}`;
  const resolved = `sn-tooltip--${resolvedSide.value}`;
  return requested === resolved ? [requested] : [requested, resolved];
});

/**
 * `displayDirective: 'if'` mounts the popover only while visible.
 * `'show'` keeps it mounted after the first reveal and toggles display,
 * which preserves internal state (scroll position, embedded inputs).
 */
const hasBeenVisible = ref(false);
watch(visible, (v) => {
  if (v) hasBeenVisible.value = true;
});
const shouldRenderPopover = computed(() =>
  props.displayDirective === 'show' ? hasBeenVisible.value : visible.value && !props.disabled,
);

// Expose imperative API for parents that prefer ref-based control.
defineExpose({
  /** Programmatic show. Respects disabled. */
  show: () => setVisible(true),
  /** Programmatic hide. */
  hide: () => setVisible(false),
  /** Read current effective show state (handles controlled + uncontrolled). */
  isShown: () => visible.value,
});

// Reference `slots` so the linter doesn't complain about an unused import
// while we still need it for trigger rendering below.
void slots;
</script>

<template>
  <span
    v-if="wrapped"
    ref="triggerEl"
    class="sn-tooltip-trigger"
    @mouseenter="onTriggerMouseEnter"
    @mouseleave="onTriggerMouseLeave"
    @click="onTriggerClick"
    @focusin="onTriggerFocus"
    @focusout="onTriggerBlur"
  >
    <slot />
  </span>
  <template v-else>
    <!--
      `wrapped=false` mode: the consumer owns the trigger element via
      slot. We use a fragment-like trick — render a placeholder that
      collects a ref via the slot scope.
    -->
    <slot
      :trigger-ref="
        (el: HTMLElement | null) => {
          triggerEl = el;
        }
      "
    />
  </template>

  <Teleport :to="to === false ? 'body' : to" :disabled="to === false">
    <div
      v-if="shouldRenderPopover"
      v-show="visible && !disabled"
      ref="popoverEl"
      class="sn-tooltip"
      :class="[
        popoverPlacementClass,
        raw && 'sn-tooltip--raw',
        scrollable && 'sn-tooltip--scrollable',
        !animated && 'sn-tooltip--no-animation',
      ]"
      :style="popoverStyle"
      role="tooltip"
      @mouseenter="onPopoverMouseEnter"
      @mouseleave="onPopoverMouseLeave"
    >
      <div class="sn-tooltip__body" :class="contentClass" :style="contentStyle">
        <slot name="content">{{ content }}</slot>
      </div>
      <span
        v-if="arrow"
        class="sn-tooltip__arrow"
        :class="[arrowPlacementClass, arrowClass]"
        :style="{ ...arrowStyle, ...(props.arrowStyle ?? {}) }"
        aria-hidden="true"
      />
    </div>
  </Teleport>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. */

.sn-tooltip-trigger {
  display: inline-flex;
  /* Trigger inherits highlight / size from the slot — keep this block
   * purely structural so consumers don't get bleed-in layout. */
}

.sn-tooltip {
  z-index: 9999;
  pointer-events: auto; /* re-enable for hover bridge so user can
                          * reach into the popover without the
                          * trigger mouseleave firing first */
  box-sizing: border-box;
  font-size: 13px;
  line-height: 1.5;
  color: var(--sn-web-color-text-on-primary, #fff);
  background: var(--sn-web-color-tooltip-background, rgba(20, 20, 28, 0.95));
  border-radius: 6px;
  padding: 6px 10px;
  max-width: 280px;
  /* The arrow is positioned in the band *outside* the padding box (a
   * negative inset), so the bubble must not clip its own overflow. */
  overflow: visible;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.08),
    0 6px 18px rgba(0, 0, 0, 0.18);
  /* Enter animation: fade + tiny offset toward trigger. Set up
   * direction-aware classes via placement so the arrow points at
   * the trigger and the bubble "grows from" the trigger side. */
  animation: sn-tooltip-in 180ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
.sn-tooltip--top {
  animation-name: sn-tooltip-in-top;
}
.sn-tooltip--bottom {
  animation-name: sn-tooltip-in-bottom;
}
.sn-tooltip--left {
  animation-name: sn-tooltip-in-left;
}
.sn-tooltip--right {
  animation-name: sn-tooltip-in-right;
}

/* `animated: false` — keep the bubble static. */
.sn-tooltip--no-animation {
  animation: none;
}

/* `raw: true` — the caller paints the bubble, so drop every visual we own
 * while keeping the positioning contract intact. */
.sn-tooltip--raw {
  padding: 0;
  max-width: none;
  background: transparent;
  box-shadow: none;
  border-radius: 0;
  color: inherit;
  font-size: inherit;
  line-height: inherit;
}

/* `scrollable: true` — cap the height and let the body scroll. An explicit
 * max-height inline style still wins. */
.sn-tooltip--scrollable .sn-tooltip__body {
  max-height: 60vh;
  overflow: auto;
}

.sn-tooltip__body {
  /* Allow the consumer to put arbitrary rich content — including
   * multi-line text, code, or a small icon. Default text wrap. */
  white-space: normal;
  word-wrap: break-word;
}

.sn-tooltip__arrow {
  position: absolute;
  width: 0;
  height: 0;
  /* 8×8 triangle. We use border tricks for the arrow shape so it
   * inherits the popover's background. The `top` / `left` style is
   * computed at runtime by recompute(); here we only declare the
   * base shape and the per-direction orientation. */
  border-style: solid;
  border-color: transparent;
  border-width: 0;
}
.sn-tooltip__arrow--top {
  border-width: 8px 8px 0 8px;
  border-top-color: var(--sn-web-color-tooltip-background, rgba(20, 20, 28, 0.95));
}
.sn-tooltip__arrow--bottom {
  border-width: 0 8px 8px 8px;
  border-bottom-color: var(--sn-web-color-tooltip-background, rgba(20, 20, 28, 0.95));
}
.sn-tooltip__arrow--left {
  border-width: 8px 8px 8px 0;
  border-left-color: var(--sn-web-color-tooltip-background, rgba(20, 20, 28, 0.95));
}
.sn-tooltip__arrow--right {
  border-width: 8px 0 8px 8px;
  border-right-color: var(--sn-web-color-tooltip-background, rgba(20, 20, 28, 0.95));
}

/* ─────────── Animations ─────────── */

@keyframes sn-tooltip-in {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes sn-tooltip-in-top {
  from {
    opacity: 0;
    transform: translateY(4px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes sn-tooltip-in-bottom {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes sn-tooltip-in-left {
  from {
    opacity: 0;
    transform: translateX(4px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes sn-tooltip-in-right {
  from {
    opacity: 0;
    transform: translateX(-4px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
