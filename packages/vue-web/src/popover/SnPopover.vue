<script setup lang="ts">
/**
 * SnPopover — floating bubble card with trigger + header/content body
 * (AUI-WEB-FB-009).
 *
 * Reference library: naive-ui `n-popover`
 *   (https://www.naiveui.com/zh-CN/light/components/popover)
 * Per AGENTS.md §112, props + semantics mirror n-popover 1:1.
 *
 * 1:1 parity (this version):
 *   - show / defaultShow (controlled vs uncontrolled)
 *   - trigger ('hover' | 'click' | 'focus' | 'manual')
 *   - placement (12-way: 'top-start' … 'left-end')
 *   - delay (open; accepts [open, close]) + duration (close)
 *   - showArrow (default false, naive convention) / arrowPointToCenter /
 *     arrowClass / arrowStyle
 *   - header / content (props) — header renders a titled card section
 *   - disabled / raw / animated / overlap / scrollable
 *   - displayDirective ('if' | 'show')
 *   - flip / keepAliveOnHover / width ('trigger' | number) / to / zIndex
 *   - contentClass / contentStyle / onClickoutside
 *
 * Intentional divergences from the reference API:
 *   - Slot layout: the reference renders the trigger through `#trigger`
 *     and the body through the default slot. This library keeps the
 *     SnTooltip convention — default slot = trigger, body = `content`
 *     prop / `#content` slot, title = `header` prop / `#header` slot.
 *   - `arrow` is an extra boolean alias of `showArrow` (SnTooltip
 *     parity). The arrow renders only when both are true.
 *   - `show` / `hide` events are local additions alongside
 *     `update:show`.
 *   - Not implemented: `x` / `y` manual coordinates, `xScrollable`, and
 *     the `themeOverrides` object (theming is token-driven).
 *
 * Design:
 *   The trigger slot is the visible target (e.g. a button). The bubble
 *   renders into a `<Teleport to="body">` so it is not clipped by any
 *   parent `overflow: hidden` and the z-index is high by default.
 *   Positioning uses fixed coordinates captured via
 *   getBoundingClientRect() — recomputed on every show and on
 *   scroll/resize while open. Boundary detection flips the placement
 *   when the requested side would overflow the viewport.
 *
 *   The arrow is a 14px square rotated 45°, centred on the bubble edge:
 *   its two outward faces carry the bubble border, so the tip reads as
 *   part of the card instead of a flat triangle parked under a hairline.
 *   recompute() writes the negative main-axis inset (`-7px`) and the
 *   clamped cross-axis offset; the per-side classes below only draw the
 *   border faces. ARROW_GAP reserves the tip's half-diagonal (≈9.9px)
 *   minus the 1px border between layout and CSS.
 *
 *   Per AGENTS.md §40 + §41, the component owns its timers, listeners,
 *   and observers — all torn down on unmount and on `show` → false.
 *
 * Accessibility:
 *   Bubble: role="dialog" + aria-modal="false" (non-trapping popover).
 *   Trigger wrapper: aria-expanded + aria-haspopup="dialog".
 *
 * Usage:
 *   <SnPopover content="Body" header="Title">
 *     <SnButton>Target</SnButton>
 *   </SnPopover>
 */

import { computed, nextTick, onBeforeUnmount, ref, useSlots, watch, type CSSProperties } from 'vue';

defineOptions({ name: 'SnPopover' });

export type SnPopoverPlacement =
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
     * Whether to show the popover. When `undefined`, falls back to
     * uncontrolled mode using internal state. Mirrors n-popover `show`.
     */
    show?: boolean | undefined;
    /**
     * Initial show value for uncontrolled mode. Mirrors n-popover
     * `defaultShow`. Default false.
     */
    defaultShow?: boolean;
    /**
     * What user gesture opens the popover. Mirrors n-popover `trigger`.
     * Default 'hover'. 'manual' disables any automatic show/hide — only
     * `show` / `update:show` controls the state.
     */
    trigger?: 'hover' | 'click' | 'focus' | 'manual';
    /**
     * Where to render the bubble relative to the trigger. Mirrors
     * n-popover `placement`. Default 'top'.
     */
    placement?: SnPopoverPlacement;
    /**
     * Open debounce in ms. Single number = same delay for open+close.
     * Use an array `[open, close]` for asymmetric delays. Mirrors
     * n-popover `delay`. Default 100.
     */
    delay?: number | [number, number];
    /**
     * How long the popover lingers before closing, in ms. Mirrors
     * n-popover `duration`. Default 100.
     */
    duration?: number;
    /**
     * Show the directional arrow. Mirrors n-popover `showArrow`.
     * Default false (naive convention — tooltips have arrows, popovers
     * opt in).
     */
    showArrow?: boolean;
    /**
     * Extra alias of `showArrow` kept for SnTooltip parity. The arrow
     * renders only when both `showArrow` and `arrow` are true.
     */
    arrow?: boolean;
    /**
     * Point the arrow at the trigger's centre rather than its edge.
     * Mirrors n-popover `arrowPointToCenter`. Default false.
     */
    arrowPointToCenter?: boolean;
    /** Class on the arrow element. Mirrors n-popover `arrowClass`. */
    arrowClass?: string | undefined;
    /** Style on the arrow element. Mirrors n-popover `arrowStyle`. */
    arrowStyle?: CSSProperties | undefined;
    /**
     * Card title. Rendered in a bold section above the body. Mirrors
     * n-popover `header`.
     */
    header?: string;
    /**
     * The bubble body. Plain string or any Vue-renderable value.
     * Mirrors n-popover `content`.
     */
    content?: string;
    /**
     * Disable showing entirely. Mirrors n-popover `disabled`.
     * Default false.
     */
    disabled?: boolean;
    /**
     * Skip the library's own card styling so the caller paints the
     * bubble entirely. Mirrors n-popover `raw`. Default false.
     */
    raw?: boolean;
    /**
     * Animate the bubble in/out. Mirrors n-popover `animated`.
     * Default true.
     */
    animated?: boolean;
    /**
     * Let the bubble overlap the trigger instead of sitting beside it.
     * Mirrors n-popover `overlap`. Default false.
     */
    overlap?: boolean;
    /**
     * Make the body scrollable once it exceeds `max-height`. Mirrors
     * n-popover `scrollable`. Default false.
     */
    scrollable?: boolean;
    /**
     * `'if'` unmounts the bubble on hide; `'show'` keeps the node and
     * toggles `display`. Mirrors n-popover `displayDirective`.
     * Default 'if'.
     */
    displayDirective?: 'if' | 'show';
    /**
     * Flip to the opposite side when the chosen placement would overflow
     * the viewport. Mirrors n-popover `flip`. Default true.
     */
    flip?: boolean;
    /**
     * Keep the popover open while the pointer is inside it (hover
     * trigger only). Mirrors n-popover `keepAliveOnHover`. Default true.
     */
    keepAliveOnHover?: boolean;
    /**
     * Pin the bubble width to the trigger's width. Mirrors n-popover
     * `width` = `'trigger'`; a number sets a fixed width in px.
     */
    width?: number | 'trigger' | undefined;
    /**
     * Where to teleport the bubble. `false` keeps it inline (useful
     * inside transform-heavy ancestors). Mirrors n-popover `to`.
     * Default 'body'.
     */
    to?: string | HTMLElement | false;
    /**
     * Explicit stacking order. Mirrors n-popover `zIndex`.
     */
    zIndex?: number | undefined;
    /** Class on the body section. Mirrors n-popover `contentClass`. */
    contentClass?: string | undefined;
    /** Style on the body section. Mirrors n-popover `contentStyle`. */
    contentStyle?: CSSProperties | undefined;
    /**
     * Called when a click lands outside the bubble and its trigger.
     * Mirrors n-popover `onClickoutside`.
     */
    onClickoutside?: ((e: MouseEvent) => void) | undefined;
  }>(),
  {
    show: undefined,
    defaultShow: false,
    trigger: 'hover',
    placement: 'top',
    delay: 100,
    duration: 100,
    showArrow: false,
    arrow: true,
    arrowPointToCenter: false,
    arrowClass: undefined,
    arrowStyle: undefined,
    header: '',
    content: '',
    disabled: false,
    raw: false,
    animated: true,
    overlap: false,
    scrollable: false,
    displayDirective: 'if',
    flip: true,
    keepAliveOnHover: true,
    width: undefined,
    to: 'body',
    zIndex: undefined,
    contentClass: undefined,
    contentStyle: undefined,
    onClickoutside: undefined,
  },
);

const emit = defineEmits<{
  /** Fired when show state changes (v-model:show). */
  (e: 'update:show', show: boolean): void;
  /** Fired when the popover appears (local addition). */
  (e: 'show'): void;
  /** Fired when the popover hides (local addition). */
  (e: 'hide'): void;
}>();

defineSlots<{
  /** Trigger element (the visible target, e.g. a button). */
  default(): unknown;
  /** Card title — overrides the `header` prop. */
  header(): unknown;
  /** Bubble body — overrides the `content` prop. */
  content(): unknown;
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
 * `delay` gates opening; `duration` gates closing. A `[open, close]`
 * tuple on `delay` overrides `duration` for the closing side.
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
  // If the user moves directly into the popover, keep it open. The
  // popover listens for mouseenter/mouseleave separately and re-schedules.
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

/* Popover hover bridge — keep the popover open while the user moves
 * between trigger and bubble. Either side's enter cancels the other's
 * close timer. */
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

/* ─────────── Arrow geometry ─────────── */

/**
 * The arrow is a 14px square rotated 45° centred on the bubble edge.
 * Half the square (7px) is the negative inset recompute() writes; the
 * visible tip is half the diagonal (≈9.9px), minus the 1px card border
 * the tip covers → ARROW_GAP is the layout reserve between bubble and
 * trigger. Keep the three constants and the `.sn-popover__arrow--*`
 * border faces in step.
 */
const ARROW_SQUARE = 14;
const ARROW_OFFSET = ARROW_SQUARE / 2;
const ARROW_GAP = 9;

/** The arrow renders only when `showArrow` and the `arrow` alias agree. */
const arrowVisible = computed(() => props.showArrow && props.arrow);

/* ─────────── Positioning + boundary detection ─────────── */

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
 * *request*: boundary detection can flip it, and the flip must be
 * reflected by both the arrow direction and the enter animation.
 */
const resolvedSide = ref<'top' | 'right' | 'bottom' | 'left'>('top');

/**
 * Compute the popover position. Layout strategy: measure trigger +
 * popover rectangles, pick the side implied by `placement` (e.g.
 * `top-start` = above with left-aligned to trigger). If the chosen side
 * overflows the viewport, flip to the opposite (top → bottom, left →
 * right) and re-apply. Then position the arrow so it points at the
 * trigger's centre edge — clamped to the bubble's near edge so it does
 * not drift off the card.
 */
async function recompute(): Promise<void> {
  if (!visible.value) return;
  await nextTick();
  const trig = triggerEl.value;
  const pop = popoverEl.value;
  if (!trig || !pop) return;

  const trigRect = trig.getBoundingClientRect();
  const popRect = pop.getBoundingClientRect();
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
  // `overlap` seats the card on the trigger, and an arrowless popover
  // sits flush — neither reserves the arrow band.
  const arrowSize = props.overlap || !arrowVisible.value ? 0 : ARROW_GAP;

  // Determine initial side + alignment from the placement string.
  const [sideRaw, alignRaw = 'center'] = props.placement.split('-');
  const side = sideRaw as 'top' | 'right' | 'bottom' | 'left';
  const align = alignRaw as 'start' | 'center' | 'end';

  /**
   * How far the arrow's centre must sit from the bubble's own edge so
   * the diamond never pokes past a rounded corner.
   */
  const arrowInset = arrowSize > 0 ? ARROW_OFFSET + 4 : 0;

  /**
   * Nudge a coordinate back inside `[margin, limit - size - margin]` so
   * a bubble wider (or taller) than the space beside its trigger is
   * still fully readable instead of clipped by the viewport.
   */
  function clampWithin(value: number, size: number, limit: number): number {
    const max = Math.min(value, limit - size - margin);
    return Math.max(margin, max);
  }

  // Helper: lay out the bubble on `sideChoice`. `strict` returns null
  // when the result cannot be shown in full — used when picking the
  // side. `strict: false` clamps along the cross axis so we never end
  // up without a rect.
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
    const place = (raw: number, size: number, limit: number): number =>
      strict ? raw : clampWithin(raw, size, limit);
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
    } else {
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
    // Check viewport fit along the *main* axis only — the cross axis is
    // already clamped when `!strict`.
    if (sideChoice === 'top' || sideChoice === 'bottom') {
      if (out.top < margin || out.top + pop.height > vh - margin) return null;
    } else {
      if (out.left < margin || out.left + pop.width > vw - margin) return null;
    }
    return out;
  }

  /**
   * Does a laid-out bubble keep its *cross* axis inside the viewport?
   * Catches the edge-aligned case (`top-start` near the right edge)
   * where the bubble fits vertically but hangs off the side.
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

  // Try the requested side; flip if the main axis does not fit and
  // `flip` allows it.
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
  // Nothing exact on the main axis, or the cross axis hangs off screen —
  // lay out on the chosen side and clamp the cross axis so the bubble is
  // nudged back into view rather than clipped.
  if (!r || !fitsCrossAxis(finalSide, r, vw, vh)) {
    r = rectFor(finalSide, trigBox, popBox, false)!;
  }
  resolvedSide.value = finalSide;

  // `width="trigger"` pins the card's horizontal size to the trigger.
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
  // The object is rebuilt from scratch on every pass so a stale `left` /
  // `top` from a previous orientation cannot survive a flip, a scroll,
  // or a resize.
  const arrowOffset: Record<string, string> = {};
  const popCenterX = r.left + r.width / 2;
  const popCenterY = r.top + r.height / 2;
  const triggerCenterX = trigBox.left + trigBox.width / 2;
  const triggerCenterY = trigBox.top + trigBox.height / 2;
  const aimX = props.arrowPointToCenter ? popCenterX : triggerCenterX;
  const aimY = props.arrowPointToCenter ? popCenterY : triggerCenterY;

  /**
   * Clamp the arrow's centre into the bubble, keeping `arrowInset`
   * margin at both ends.
   */
  function clampAim(aim: number, start: number, size: number): number {
    const lo = start + arrowInset;
    const hi = start + size - arrowInset;
    return Math.max(lo, Math.min(aim, hi));
  }

  if (finalSide === 'top' || finalSide === 'bottom') {
    const arrowCenter = clampAim(aimX, r.left, r.width);
    // The diamond is a square: `left` positions its edge, so subtract
    // half the side to keep the *centre* on the aim point.
    arrowOffset.left = `${Math.round((arrowCenter - r.left - ARROW_OFFSET) * 10) / 10}px`;
    arrowOffset[finalSide === 'top' ? 'bottom' : 'top'] = `-${ARROW_OFFSET}px`;
  } else {
    const arrowCenter = clampAim(aimY, r.top, r.height);
    arrowOffset.top = `${Math.round((arrowCenter - r.top - ARROW_OFFSET) * 10) / 10}px`;
    arrowOffset[finalSide === 'left' ? 'right' : 'left'] = `-${ARROW_OFFSET}px`;
  }
  arrowStyle.value = arrowOffset;
}

/* Recompute whenever visible flips to true, and on resize / scroll
 * while open. `scroll` uses capture — the event does not bubble and the
 * page may scroll through any ancestor. */
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
        resizeObserver.observe(document.body);
      }
      window.addEventListener('scroll', onScrollOrResize, true);
      window.addEventListener('resize', onScrollOrResize);
    } else {
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    }
    // `immediate` matters for controlled consumers that mount already
    // open: without it the first render never positions the popover.
  },
  { immediate: true },
);
function onScrollOrResize(): void {
  void recompute();
}

/* ─────────── Outside-click dismiss (click trigger) ─────────── */

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
    // SSR guard (§SSR): the immediate pass runs during server render where
    // window / document do not exist; listeners are client-only.
    if (typeof window === 'undefined') return;
    if (props.trigger !== 'click') return;
    if (v) document.addEventListener('mousedown', onDocumentMouseDown);
    else document.removeEventListener('mousedown', onDocumentMouseDown);
    // A controlled popover can mount already visible — the listener must
    // attach on that first pass too.
  },
  { immediate: true },
);

/* ─────────── Cleanup (§41/§42) ─────────── */

onBeforeUnmount(() => {
  clearTimers();
  window.removeEventListener('scroll', onScrollOrResize, true);
  window.removeEventListener('resize', onScrollOrResize);
  document.removeEventListener('mousedown', onDocumentMouseDown);
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
});

/* When controlled show flips true via the parent, recompute. */
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
  // Driven by the *resolved* side: a bubble flipped by boundary
  // detection still has to point its arrow the way it actually landed.
  return `sn-popover__arrow--${resolvedSide.value}`;
});

/**
 * Keeps the requested placement (so consumers can style
 * `sn-popover--top-start` and friends) *and* adds the resolved side,
 * which the directional enter animation keys off.
 */
const popoverPlacementClass = computed<string[]>(() => {
  const requested = `sn-popover--${props.placement}`;
  const resolved = `sn-popover--${resolvedSide.value}`;
  return requested === resolved ? [requested] : [requested, resolved];
});

const hasHeader = computed(() => props.header !== '' || slots.header !== undefined);

const hasPopupType = 'dialog' as const;

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
  /** Read current effective show state (controlled + uncontrolled). */
  isShown: () => visible.value,
});
</script>

<template>
  <span
    ref="triggerEl"
    class="sn-popover-trigger"
    :aria-expanded="visible ? 'true' : 'false'"
    :aria-haspopup="hasPopupType"
    @mouseenter="onTriggerMouseEnter"
    @mouseleave="onTriggerMouseLeave"
    @click="onTriggerClick"
    @focusin="onTriggerFocus"
    @focusout="onTriggerBlur"
  >
    <slot />
  </span>

  <Teleport :to="to === false ? 'body' : to" :disabled="to === false">
    <div
      v-if="shouldRenderPopover"
      v-show="visible && !disabled"
      ref="popoverEl"
      class="sn-popover"
      :class="[
        popoverPlacementClass,
        raw && 'sn-popover--raw',
        scrollable && 'sn-popover--scrollable',
        !animated && 'sn-popover--no-animation',
      ]"
      :style="popoverStyle"
      role="dialog"
      aria-modal="false"
      data-snui-component="popover"
      @mouseenter="onPopoverMouseEnter"
      @mouseleave="onPopoverMouseLeave"
    >
      <div v-if="hasHeader" class="sn-popover__header">
        <slot name="header">{{ header }}</slot>
      </div>
      <div class="sn-popover__content" :class="contentClass" :style="contentStyle">
        <slot name="content">{{ content }}</slot>
      </div>
      <span
        v-if="arrowVisible"
        class="sn-popover__arrow"
        :class="[arrowPlacementClass, arrowClass]"
        :style="{ ...arrowStyle, ...(props.arrowStyle ?? {}) }"
        aria-hidden="true"
      />
    </div>
  </Teleport>
</template>

<style scoped>
/* Web side: --sn-web-* tokens only (§114 / Spec-02). */

.sn-popover-trigger {
  display: inline-flex;
  /* Structural only — highlight / size come from the slot content. */
}

.sn-popover {
  z-index: 9999;
  pointer-events: auto; /* keep the hover bridge reachable */
  box-sizing: border-box;
  font-size: 14px;
  line-height: 1.6;
  color: var(--sn-web-color-text-primary, #1f2329);
  background: var(--sn-web-color-background-surface, #ffffff);
  border: 1px solid var(--sn-web-color-border-subtle, rgba(31, 35, 41, 0.12));
  border-radius: 8px;
  padding: 10px 12px;
  max-width: 280px;
  /* The arrow straddles the padding-box edge, so the card must not clip
   * its own overflow. */
  overflow: visible;
  box-shadow: var(--sn-web-card-shadow, 0 2px 8px rgba(0, 0, 0, 0.12));
  animation: sn-popover-in 180ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
.sn-popover--top {
  animation-name: sn-popover-in-top;
}
.sn-popover--bottom {
  animation-name: sn-popover-in-bottom;
}
.sn-popover--left {
  animation-name: sn-popover-in-left;
}
.sn-popover--right {
  animation-name: sn-popover-in-right;
}

.sn-popover--no-animation {
  animation: none;
}

/* `raw: true` — the caller paints the bubble; drop every visual we own
 * while keeping the positioning contract intact. */
.sn-popover--raw {
  padding: 0;
  max-width: none;
  background: transparent;
  border-color: transparent;
  box-shadow: none;
  border-radius: 0;
  color: inherit;
  font-size: inherit;
  line-height: inherit;
}

/* `scrollable: true` — cap the height and let the body scroll. An
 * explicit max-height inline style still wins. */
.sn-popover--scrollable .sn-popover__content {
  max-height: 60vh;
  overflow: auto;
}

.sn-popover__header {
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
  color: var(--sn-web-color-text-primary, #1f2329);
}

.sn-popover__content {
  font-size: 14px;
  color: var(--sn-web-color-text-primary, #1f2329);
  white-space: normal;
  word-wrap: break-word;
}

/*
 * Arrow: a 14px square rotated 45°, centred on the bubble edge (the
 * negative main-axis inset and the clamped cross-axis offset are
 * written by recompute()). The two faces that form the outward tip
 * carry the card border; the inward faces stay bare so no seam shows
 * inside the bubble. Border widths are set per side — keep them in
 * sync with the 1px card border.
 */
.sn-popover__arrow {
  position: absolute;
  width: 14px;
  height: 14px;
  box-sizing: border-box;
  background: var(--sn-web-color-background-surface, #ffffff);
  border: 0 solid var(--sn-web-color-border-subtle, rgba(31, 35, 41, 0.12));
  transform: rotate(45deg);
}
/* Card above the trigger → tip points down (bottom tip of the diamond). */
.sn-popover__arrow--top {
  border-right-width: 1px;
  border-bottom-width: 1px;
}
/* Card below the trigger → tip points up (top tip). */
.sn-popover__arrow--bottom {
  border-top-width: 1px;
  border-left-width: 1px;
}
/* Card left of the trigger → tip points right (right tip). */
.sn-popover__arrow--left {
  border-top-width: 1px;
  border-right-width: 1px;
}
/* Card right of the trigger → tip points left (left tip). */
.sn-popover__arrow--right {
  border-left-width: 1px;
  border-bottom-width: 1px;
}

/* ─────────── Animations ─────────── */

@keyframes sn-popover-in {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes sn-popover-in-top {
  from {
    opacity: 0;
    transform: translateY(4px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes sn-popover-in-bottom {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes sn-popover-in-left {
  from {
    opacity: 0;
    transform: translateX(4px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes sn-popover-in-right {
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
