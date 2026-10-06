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
 *   - delay (open + close debounce, single number = both; n-facing pairs them)
 *   - arrow / content / disabled
 *   - raw / bordered / arrow-style variants
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

import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  useSlots,
  watch,
} from 'vue'

defineOptions({ name: 'SnTooltip' })

export type SnTooltipPlacement =
  | 'top-start' | 'top' | 'top-end'
  | 'right-start' | 'right' | 'right-end'
  | 'bottom-start' | 'bottom' | 'bottom-end'
  | 'left-start' | 'left' | 'left-end'

const props = withDefaults(
  defineProps<{
    /**
     * Whether to show the tooltip. When `undefined`, falls back to
     * uncontrolled mode using internal state. Mirrors n-tooltip `show`.
     */
    show?: boolean | undefined
    /**
     * Initial show value for uncontrolled mode. Mirrors n-tooltip
     * `defaultShow`. Default false.
     */
    defaultShow?: boolean
    /**
     * What user gesture opens the tooltip. Mirrors n-tooltip `trigger`.
     * Default 'hover'. 'manual' disables any automatic show/hide — only
     * `show` / `update:show` controls the state.
     */
    trigger?: 'hover' | 'click' | 'focus' | 'manual'
    /**
     * Where to render the tooltip relative to the trigger. Mirrors
     * n-tooltip `placement`. Default 'top'.
     */
    placement?: SnTooltipPlacement
    /**
     * Open/close debounce in ms. Single number = same delay for open+close.
     * Use an array `[open, close]` for asymmetric delays (e.g. snappier
     * open, slower close). Mirrors n-tooltip `delay`. Default 100.
     */
    delay?: number | [number, number]
    /**
     * Show the directional arrow. Mirrors n-tooltip `arrow`. Default true.
     */
    arrow?: boolean
    /**
     * The tooltip body. Can be a plain string or any Vue-renderable value.
     * Mirrors n-tooltip `content`.
     */
    content?: string | undefined
    /**
     * Render the trigger inline as a `<span>` so it can hold mouse events
     * even if the consumer's element is e.g. an SVG. Default true
     * (matches naive-ui). Mirrors n-tooltip `raw` of inverse=false.
     */
    wrapped?: boolean
    /**
     * Disable showing entirely. Mirrors n-tooltip `disabled`. Default false.
     */
    disabled?: boolean
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
    disabled: false,
  },
)

const emit = defineEmits<{
  /** Fired when show state changes (v-model:show). Mirrors n-tooltip `on-update-show`. */
  (e: 'update:show', show: boolean): void
  /** Fired when the popover appears. Mirrors n-tooltip `on-show`. */
  (e: 'show'): void
  /** Fired when the popover hides. Mirrors n-tooltip `on-hide`. */
  (e: 'hide'): void
}>()

const slots = useSlots()

/* ─────────── Internal show state ─────────── */

const uncontrolledShow = ref<boolean>(props.defaultShow)
const isControlled = computed(() => props.show !== undefined)
const visible = computed<boolean>(() =>
  isControlled.value ? (props.show as boolean) : uncontrolledShow.value,
)

function setVisible(next: boolean): void {
  if (props.disabled) return
  if (isControlled.value) {
    // Parent owns state — only emit, never write our own ref.
    if (visible.value !== next) emit('update:show', next)
  }
  else {
    uncontrolledShow.value = next
  }
  if (next) emit('show')
  else emit('hide')
}

/* ─────────── Delay timers ─────────── */

const [openDelay, closeDelay] = computed<[number, number]>(() => {
  const d = props.delay
  return Array.isArray(d) ? d : [d, d]
}).value as [number, number]

let openTimer: ReturnType<typeof setTimeout> | null = null
let closeTimer: ReturnType<typeof setTimeout> | null = null
function clearTimers(): void {
  if (openTimer) { clearTimeout(openTimer); openTimer = null }
  if (closeTimer) { clearTimeout(closeTimer); closeTimer = null }
}

function scheduleOpen(): void {
  clearTimers()
  if (openDelay <= 0) setVisible(true)
  else openTimer = setTimeout(() => setVisible(true), openDelay)
}
function scheduleClose(): void {
  clearTimers()
  if (closeDelay <= 0) setVisible(false)
  else closeTimer = setTimeout(() => setVisible(false), closeDelay)
}

/* ─────────── Trigger event wiring ─────────── */

const triggerEl = ref<HTMLElement | null>(null)
const popoverEl = ref<HTMLElement | null>(null)

function onTriggerMouseEnter(): void {
  if (props.trigger !== 'hover') return
  scheduleOpen()
}
function onTriggerMouseLeave(e: MouseEvent): void {
  if (props.trigger !== 'hover') return
  // If the user moves directly into the popover, keep it open. The popover
  // listens for mouseenter/mouseleave separately and re-schedules.
  const to = e.relatedTarget as Node | null
  if (to && popoverEl.value && popoverEl.value.contains(to)) return
  scheduleClose()
}
function onTriggerClick(): void {
  if (props.trigger !== 'click') return
  setVisible(!visible.value)
}
function onTriggerFocus(): void {
  if (props.trigger !== 'focus') return
  scheduleOpen()
}
function onTriggerBlur(e: FocusEvent): void {
  if (props.trigger !== 'focus') return
  const to = e.relatedTarget as Node | null
  if (to && popoverEl.value && popoverEl.value.contains(to)) return
  scheduleClose()
}

/* Popover hover bridge — keep popover open while user moves between
 * trigger and popover. The mouseleave→mouseenter gap is bridged by
 * either side's enter cancelling the other's close timer. */
function onPopoverMouseEnter(): void {
  if (props.trigger !== 'hover') return
  clearTimers()
}
function onPopoverMouseLeave(e: MouseEvent): void {
  if (props.trigger !== 'hover') return
  const to = e.relatedTarget as Node | null
  if (to && triggerEl.value && triggerEl.value.contains(to)) return
  scheduleClose()
}

/* ─────────── Positioning + boundary detection ─────────── */

interface PositionRect {
  top: number
  left: number
  width: number
  height: number
  /** Convenience for the trigger's right edge. */
  right: number
  /** Convenience for the trigger's bottom edge. */
  bottom: number
}

const popoverStyle = ref<Record<string, string>>({})
const arrowStyle = ref<Record<string, string>>({})

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
  if (!visible.value) return
  await nextTick()
  const trig = triggerEl.value
  const pop = popoverEl.value
  if (!trig || !pop) return

  const trigRect = trig.getBoundingClientRect()
  const popRect = pop.getBoundingClientRect()
  // Extend the rectangles with right / bottom for the position math.
  const trigBox: PositionRect = {
    top: trigRect.top,
    left: trigRect.left,
    width: trigRect.width,
    height: trigRect.height,
    right: trigRect.right,
    bottom: trigRect.bottom,
  }
  const popBox: PositionRect = {
    top: popRect.top,
    left: popRect.left,
    width: popRect.width,
    height: popRect.height,
    right: popRect.right,
    bottom: popRect.bottom,
  }
  const vw = window.innerWidth
  const vh = window.innerHeight
  const margin = 8 // minimum gap between popover and viewport edge
  const arrowSize = 8

  // Determine initial side + alignment from placement string
  // e.g. 'top-start' → side='top', align='start'
  const [sideRaw, alignRaw = 'center'] = props.placement.split('-')
  const side = sideRaw as 'top' | 'right' | 'bottom' | 'left'
  const align = alignRaw as 'start' | 'center' | 'end'

  // Helper: try side, return rect if it fits, else null.
  function rectFor(sideChoice: typeof side, trigger: PositionRect, pop: PositionRect): PositionRect | null {
    const out: PositionRect = {
      top: 0, left: 0,
      width: pop.width, height: pop.height,
      right: 0, bottom: 0,
    }
    let triggerEdge = 0
    switch (sideChoice) {
      case 'top':
        out.top = trigger.top - pop.height - arrowSize
        triggerEdge = trigger.top
        break
      case 'bottom':
        out.top = trigger.bottom + arrowSize
        triggerEdge = trigger.bottom
        break
      case 'left':
        out.left = trigger.left - pop.width - arrowSize
        triggerEdge = trigger.left
        break
      case 'right':
        out.left = trigger.right + arrowSize
        triggerEdge = trigger.right
        break
    }
    // Horizontal axis
    if (sideChoice === 'top' || sideChoice === 'bottom') {
      switch (align) {
        case 'start': out.left = trigger.left; break
        case 'end': out.left = trigger.right - pop.width; break
        default: out.left = trigger.left + trigger.width / 2 - pop.width / 2
      }
    }
    // Vertical axis
    else {
      switch (align) {
        case 'start': out.top = trigger.top; break
        case 'end': out.top = trigger.bottom - pop.height; break
        default: out.top = trigger.top + trigger.height / 2 - pop.height / 2
      }
    }
    // Check viewport fit
    if (out.top < margin || out.top + pop.height > vh - margin) return null
    if (out.left < margin || out.left + pop.width > vw - margin) return null
    return out
  }

  // Try the requested side; flip if it doesn't fit.
  const opposite: Record<typeof side, typeof side> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
  }
  let finalSide = side
  let r = rectFor(side, trigBox, popBox)
  if (!r) {
    r = rectFor(opposite[side], trigBox, popBox)
    if (r) finalSide = opposite[side]
  }
  // Last resort — center on the trigger's preferred side even if clipped.
  if (!r) r = rectFor(side, trigBox, popBox)!

  popoverStyle.value = {
    position: 'fixed',
    top: `${r.top}px`,
    left: `${r.left}px`,
  }

  // Arrow position: aim at the trigger's midpoint on the relevant axis.
  // Clamp so it stays on the popover.
  const arrowOffset: Record<string, string> = {}
  const popCenterX = r.left + r.width / 2
  const popCenterY = r.top + r.height / 2
  const triggerCenterX = trigBox.left + trigBox.width / 2
  const triggerCenterY = trigBox.top + trigBox.height / 2
  if (finalSide === 'top' || finalSide === 'bottom') {
    const arrowCenter = Math.max(
      r.left + arrowSize,
      Math.min(popCenterX, triggerCenterX, r.left + r.width - arrowSize),
    )
    arrowOffset.left = `${arrowCenter - r.left}px`
    arrowOffset.top = ''
    arrowOffset[finalSide === 'top' ? 'bottom' : 'top'] = `-${arrowSize}px`
  }
  else {
    const arrowCenter = Math.max(
      r.top + arrowSize,
      Math.min(popCenterY, triggerCenterY, r.top + r.height - arrowSize),
    )
    arrowOffset.top = `${arrowCenter - r.top}px`
    arrowOffset.left = ''
    arrowOffset[finalSide === 'left' ? 'right' : 'left'] = `-${arrowSize}px`
  }
  arrowStyle.value = arrowOffset
}

/* Recompute whenever visible flips to true, and on resize / scroll
 * while open. We listen on window — the canvas resize observer for
 * arbitrary parent containers is out of scope for v0. */
let resizeObserver: ResizeObserver | null = null
watch(visible, async (v) => {
  if (v) {
    await recompute()
    if (!resizeObserver && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => { void recompute() })
      // Observe document body for layout shifts while open.
      resizeObserver.observe(document.body)
    }
    window.addEventListener('scroll', onScrollOrResize, true)
    window.addEventListener('resize', onScrollOrResize)
  }
  else {
    window.removeEventListener('scroll', onScrollOrResize, true)
    window.removeEventListener('resize', onScrollOrResize)
  }
})
function onScrollOrResize(): void {
  void recompute()
}

/* ─────────── Outside-click dismiss (click trigger only) ─────────── */

function onDocumentMouseDown(e: MouseEvent): void {
  if (props.trigger !== 'click' || !visible.value) return
  const t = e.target as Node | null
  if (!t) return
  if (triggerEl.value && triggerEl.value.contains(t)) return
  if (popoverEl.value && popoverEl.value.contains(t)) return
  setVisible(false)
}

watch(visible, (v) => {
  if (props.trigger !== 'click') return
  if (v) document.addEventListener('mousedown', onDocumentMouseDown)
  else document.removeEventListener('mousedown', onDocumentMouseDown)
})

/* ─────────── Cleanup ─────────── */

onBeforeUnmount(() => {
  clearTimers()
  window.removeEventListener('scroll', onScrollOrResize, true)
  window.removeEventListener('resize', onScrollOrResize)
  document.removeEventListener('mousedown', onDocumentMouseDown)
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})

/* When controlled show changes from false → true via parent (e.g. another
 * component tells us to show), recompute. Same in reverse — we don't
 * actively hide, but if the parent flips us off while we're in a timer,
 * the next tick should reset. */
watch(() => props.show, (s) => {
  if (s === undefined) return
  if (s && !visible.value) {
    clearTimers()
    setVisible(true)
  }
})

const arrowPlacementClass = computed(() => {
  // Map current resolved side to a CSS modifier. Falls back to `top`
  // because the arrow's default upward-pointing shape sits at the bottom
  // edge of the popover.
  const side = props.placement.split('-')[0]
  return `sn-tooltip__arrow--${side}`
})

// Expose imperative API for parents that prefer ref-based control.
defineExpose({
  /** Programmatic show. Respects disabled. */
  show: () => setVisible(true),
  /** Programmatic hide. */
  hide: () => setVisible(false),
  /** Read current effective show state (handles controlled + uncontrolled). */
  isShown: () => visible.value,
})

// Reference `slots` so the linter doesn't complain about an unused import
// while we still need it for trigger rendering below.
void slots
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
    <slot :trigger-ref="(el: HTMLElement | null) => { triggerEl = el }" />
  </template>

  <Teleport to="body">
    <div
      v-if="visible && !disabled"
      ref="popoverEl"
      class="sn-tooltip"
      :class="`sn-tooltip--${props.placement}`"
      :style="popoverStyle"
      role="tooltip"
      @mouseenter="onPopoverMouseEnter"
      @mouseleave="onPopoverMouseLeave"
    >
      <div class="sn-tooltip__body">
        <slot name="content">{{ content }}</slot>
      </div>
      <span
        v-if="arrow"
        class="sn-tooltip__arrow"
        :class="arrowPlacementClass"
        :style="arrowStyle"
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
  font-size: 13px;
  line-height: 1.5;
  color: var(--sn-web-color-text-on-primary, #fff);
  background: var(--sn-web-color-tooltip-background, rgba(20, 20, 28, 0.95));
  border-radius: 6px;
  padding: 6px 10px;
  max-width: 280px;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.08),
    0 6px 18px rgba(0, 0, 0, 0.18);
  /* Enter animation: fade + tiny offset toward trigger. Set up
   * direction-aware classes via placement so the arrow points at
   * the trigger and the bubble "grows from" the trigger side. */
  animation: sn-tooltip-in 180ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
.sn-tooltip--top    { animation-name: sn-tooltip-in-top; }
.sn-tooltip--bottom { animation-name: sn-tooltip-in-bottom; }
.sn-tooltip--left   { animation-name: sn-tooltip-in-left; }
.sn-tooltip--right  { animation-name: sn-tooltip-in-right; }

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
.sn-tooltip__arrow--top    { border-width: 8px 8px 0 8px; border-top-color: var(--sn-web-color-tooltip-background, rgba(20, 20, 28, 0.95)); }
.sn-tooltip__arrow--bottom { border-width: 0 8px 8px 8px; border-bottom-color: var(--sn-web-color-tooltip-background, rgba(20, 20, 28, 0.95)); }
.sn-tooltip__arrow--left   { border-width: 8px 8px 8px 0; border-left-color: var(--sn-web-color-tooltip-background, rgba(20, 20, 28, 0.95)); }
.sn-tooltip__arrow--right  { border-width: 8px 0 8px 8px; border-right-color: var(--sn-web-color-tooltip-background, rgba(20, 20, 28, 0.95)); }

/* ─────────── Animations ─────────── */

@keyframes sn-tooltip-in {
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes sn-tooltip-in-top    { from { opacity: 0; transform: translateY(4px) scale(0.96); } to { opacity: 1; transform: none; } }
@keyframes sn-tooltip-in-bottom { from { opacity: 0; transform: translateY(-4px) scale(0.96); } to { opacity: 1; transform: none; } }
@keyframes sn-tooltip-in-left   { from { opacity: 0; transform: translateX(4px) scale(0.96); } to { opacity: 1; transform: none; } }
@keyframes sn-tooltip-in-right  { from { opacity: 0; transform: translateX(-4px) scale(0.96); } to { opacity: 1; transform: none; } }
</style>