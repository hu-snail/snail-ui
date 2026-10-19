<script setup lang="ts">
/**
 * SnPopconfirm — bubble confirmation box with icon + message + action
 * buttons (AUI-WEB-FB-010).
 *
 * Reference library: naive-ui `n-popconfirm`
 *   (https://www.naiveui.com/zh-CN/light/components/popconfirm)
 * Per AGENTS.md §112, props + semantics mirror n-popconfirm 1:1.
 *
 * 1:1 parity (this version):
 *   - show / defaultShow (controlled vs uncontrolled)
 *   - trigger (default 'click', naive convention for popconfirm)
 *   - placement (12-way), delay / duration
 *   - icon (icon component), showIcon (default true — default glyph is
 *     lucide `AlertTriangle` in the feedback-warning colour)
 *   - negativeText ('取消') / positiveText ('确定')
 *   - negativeButtonProps / positiveButtonProps (forwarded to the two
 *     SnButton instances; positive defaults to type="primary")
 *   - width / to / zIndex / disabled / displayDirective ('if' | 'show')
 *   - flip / keepAliveOnHover / animated / showArrow (default false)
 *   - arrowPointToCenter / arrowClass / arrowStyle
 *   - contentClass / contentStyle / onClickoutside
 *   - onPositiveClick / onNegativeClick — may return `false` or
 *     `Promise<false>` to veto closing; a pending Promise holds the
 *     bubble open until it resolves (naive semantics)
 *   - update:show
 *
 * Intentional divergences from the reference API:
 *   - Slot layout: the reference renders the trigger through `#trigger`
 *     and the message through the default slot. This library keeps the
 *     popover-family convention — default slot = trigger, message =
 *     `content` prop. `#icon` and `#action` slots keep the reference
 *     names and semantics.
 *   - Action order is negative-left / positive-right (取消 · 确定).
 *   - A pending async callback holds the bubble open but does not put
 *     the button into a loading state.
 *   - Inherited popover props not meaningful for a confirmation
 *     (`header`, `raw`, `overlap`, `scrollable`, `x`/`y`) are omitted.
 *
 * Design:
 *   Same teleported fixed-position engine as SnPopover (copied, not
 *   imported — no cross-module coupling): getBoundingClientRect-based
 *   placement with viewport flip, hover bridge, clickoutside dismiss,
 *   displayDirective retention. The action row renders two tiny
 *   SnButtons; the positive one is primary by default.
 *
 *   Per AGENTS.md §40 + §41, timers, listeners, and observers are torn
 *   down on unmount and on `show` → false.
 *
 * Accessibility:
 *   Panel: role="dialog" + aria-modal="false". Trigger wrapper:
 *   aria-expanded + aria-haspopup="dialog". Action buttons are real
 *   buttons with visible text.
 */

import { computed, markRaw, nextTick, onBeforeUnmount, ref, watch, type CSSProperties } from 'vue'
import { AlertTriangle } from 'lucide-vue-next'
import SnButton from '../button/SnButton.vue'
import SnIcon from '../icon/SnIcon.vue'
import type { IconComponent } from '../icon/sn-icon-registry'

defineOptions({ name: 'SnPopconfirm' })

export type SnPopconfirmPlacement =
  | 'top-start' | 'top' | 'top-end'
  | 'right-start' | 'right' | 'right-end'
  | 'bottom-start' | 'bottom' | 'bottom-end'
  | 'left-start' | 'left' | 'left-end'

/** `false` (or a Promise resolving to `false`) vetoes closing. */
export type SnPopconfirmActionReturn = boolean | Promise<boolean> | void

const props = withDefaults(
  defineProps<{
    /**
     * Whether to show the popconfirm. When `undefined`, falls back to
     * uncontrolled mode. Mirrors n-popconfirm `show`.
     */
    show?: boolean | undefined
    /**
     * Initial show value for uncontrolled mode. Mirrors n-popconfirm
     * `defaultShow`. Default false.
     */
    defaultShow?: boolean
    /**
     * What user gesture opens the bubble. Mirrors n-popconfirm
     * `trigger`. Default 'click'.
     */
    trigger?: 'hover' | 'click' | 'focus' | 'manual'
    /**
     * Where to render the bubble relative to the trigger. Mirrors
     * n-popconfirm `placement`. Default 'top'.
     */
    placement?: SnPopconfirmPlacement
    /** Open debounce in ms. Mirrors n-popover `delay`. Default 100. */
    delay?: number | [number, number]
    /** Close debounce in ms. Mirrors n-popover `duration`. Default 100. */
    duration?: number
    /** Show the directional arrow. Default false. */
    showArrow?: boolean
    /** Point the arrow at the trigger's centre. Default false. */
    arrowPointToCenter?: boolean
    /** Class on the arrow element. */
    arrowClass?: string | undefined
    /** Style on the arrow element. */
    arrowStyle?: CSSProperties | undefined
    /**
     * The confirmation message. Rendered between the icon and the
     * action row.
     */
    content?: string
    /**
     * Leading icon component. Default: lucide `AlertTriangle` in the
     * feedback-warning colour. Mirrors n-popconfirm `icon`.
     */
    icon?: IconComponent | undefined
    /**
     * Show the leading icon at all. Mirrors n-popconfirm `showIcon`.
     * Default true.
     */
    showIcon?: boolean
    /** Cancel button label. Mirrors n-popconfirm `negativeText`. Default '取消'. */
    negativeText?: string
    /** Confirm button label. Mirrors n-popconfirm `positiveText`. Default '确定'. */
    positiveText?: string
    /** Extra props forwarded to the cancel SnButton. */
    negativeButtonProps?: Record<string, unknown> | undefined
    /** Extra props forwarded to the confirm SnButton. */
    positiveButtonProps?: Record<string, unknown> | undefined
    /**
     * Called when the confirm button is clicked. Return `false` (or a
     * Promise resolving to `false`) to keep the bubble open. Mirrors
     * n-popconfirm `onPositiveClick`.
     */
    onPositiveClick?: ((e: MouseEvent) => SnPopconfirmActionReturn) | undefined
    /**
     * Called when the cancel button is clicked. Same veto semantics as
     * `onPositiveClick`. Mirrors n-popconfirm `onNegativeClick`.
     */
    onNegativeClick?: ((e: MouseEvent) => SnPopconfirmActionReturn) | undefined
    /**
     * Disable showing entirely. Mirrors n-popconfirm `disabled`.
     */
    disabled?: boolean
    /**
     * `'if'` unmounts the bubble on hide; `'show'` keeps the node and
     * toggles `display`. Default 'if'.
     */
    displayDirective?: 'if' | 'show' | undefined
    /** Flip to the opposite side when space runs out. Default true. */
    flip?: boolean
    /** Keep the bubble open while the pointer is inside it (hover). */
    keepAliveOnHover?: boolean
    /** Animate the bubble in/out. Default true. */
    animated?: boolean
    /**
     * Pin the bubble width to the trigger's width, or set a fixed px
     * width. Mirrors n-popover `width`.
     */
    width?: number | 'trigger' | undefined
    /** Teleport target. `false` renders inline. Default 'body'. */
    to?: string | HTMLElement | false | undefined
    /** Explicit stacking order. */
    zIndex?: number | undefined
    /** Class on the inner body. */
    contentClass?: string | undefined
    /** Style on the inner body. */
    contentStyle?: CSSProperties | undefined
    /** Called when a click lands outside the bubble and its trigger. */
    onClickoutside?: ((e: MouseEvent) => void) | undefined
  }>(),
  {
    show: undefined,
    defaultShow: false,
    trigger: 'click',
    placement: 'top',
    delay: 100,
    duration: 100,
    showArrow: false,
    arrowPointToCenter: false,
    arrowClass: undefined,
    arrowStyle: undefined,
    content: '',
    icon: undefined,
    showIcon: true,
    negativeText: '取消',
    positiveText: '确定',
    negativeButtonProps: undefined,
    positiveButtonProps: undefined,
    onPositiveClick: undefined,
    onNegativeClick: undefined,
    disabled: false,
    displayDirective: 'if',
    flip: true,
    keepAliveOnHover: true,
    animated: true,
    width: undefined,
    to: 'body',
    zIndex: undefined,
    contentClass: undefined,
    contentStyle: undefined,
    onClickoutside: undefined,
  },
)

const emit = defineEmits<{
  /** Fired when show state changes (v-model:show). */
  (e: 'update:show', show: boolean): void
}>()

defineSlots<{
  /** Trigger element (the visible target, e.g. a delete button). */
  default(): unknown
  /** Leading icon area — overrides the `icon` prop and default glyph. */
  icon(): unknown
  /** Action row — replaces the two built-in buttons. */
  action(): unknown
}>()

/* ─────────── Internal show state ─────────── */

const uncontrolledShow = ref<boolean>(props.defaultShow)
const isControlled = computed(() => props.show !== undefined)
const visible = computed<boolean>(() =>
  isControlled.value ? (props.show as boolean) : uncontrolledShow.value,
)

function setVisible(next: boolean): void {
  if (props.disabled) return
  if (isControlled.value) {
    if (visible.value !== next) emit('update:show', next)
  }
  else {
    uncontrolledShow.value = next
  }
}

/* ─────────── Delay timers ─────────── */

const [openDelay, closeDelay] = computed<[number, number]>(() => {
  const d = props.delay
  return Array.isArray(d) ? d : [d, props.duration]
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

/* Hover bridge — keep the bubble open while the pointer moves between
 * trigger and bubble. */
function onPopoverMouseEnter(): void {
  if (props.trigger !== 'hover') return
  if (!props.keepAliveOnHover) return
  clearTimers()
}
function onPopoverMouseLeave(e: MouseEvent): void {
  if (props.trigger !== 'hover') return
  if (!props.keepAliveOnHover) return
  const to = e.relatedTarget as Node | null
  if (to && triggerEl.value && triggerEl.value.contains(to)) return
  scheduleClose()
}

/* ─────────── Arrow geometry (same engine as SnPopover) ─────────── */

const ARROW_SQUARE = 14
const ARROW_OFFSET = ARROW_SQUARE / 2
const ARROW_GAP = 9

const arrowVisible = computed(() => props.showArrow)

/* ─────────── Positioning + boundary detection ─────────── */

interface PositionRect {
  top: number
  left: number
  width: number
  height: number
  right: number
  bottom: number
}

const popoverStyle = ref<Record<string, string>>({})
const arrowStyle = ref<Record<string, string>>({})
const resolvedSide = ref<'top' | 'right' | 'bottom' | 'left'>('top')

async function recompute(): Promise<void> {
  if (!visible.value) return
  await nextTick()
  const trig = triggerEl.value
  const pop = popoverEl.value
  if (!trig || !pop) return

  const trigRect = trig.getBoundingClientRect()
  const popRect = pop.getBoundingClientRect()
  const trigBox: PositionRect = {
    top: trigRect.top, left: trigRect.left,
    width: trigRect.width, height: trigRect.height,
    right: trigRect.right, bottom: trigRect.bottom,
  }
  const popBox: PositionRect = {
    top: popRect.top, left: popRect.left,
    width: popRect.width, height: popRect.height,
    right: popRect.right, bottom: popRect.bottom,
  }
  const vw = window.innerWidth
  const vh = window.innerHeight
  const margin = 8
  // The confirm bubble reserves the arrow band only when the arrow shows.
  const gap = arrowVisible.value ? ARROW_GAP : 0
  const [sideRaw, alignRaw = 'center'] = props.placement.split('-')
  const side = sideRaw as 'top' | 'right' | 'bottom' | 'left'
  const align = alignRaw as 'start' | 'center' | 'end'
  const arrowInset = gap > 0 ? ARROW_OFFSET + 4 : 0

  function clampWithin(value: number, size: number, limit: number): number {
    const max = Math.min(value, limit - size - margin)
    return Math.max(margin, max)
  }

  function rectFor(
    sideChoice: typeof side,
    trigger: PositionRect,
    pop: PositionRect,
    strict = true,
  ): PositionRect | null {
    const out: PositionRect = {
      top: 0, left: 0,
      width: pop.width, height: pop.height,
      right: 0, bottom: 0,
    }
    switch (sideChoice) {
      case 'top': out.top = trigger.top - pop.height - gap; break
      case 'bottom': out.top = trigger.bottom + gap; break
      case 'left': out.left = trigger.left - pop.width - gap; break
      case 'right': out.left = trigger.right + gap; break
    }
    const place = (raw: number, size: number, limit: number): number =>
      strict ? raw : clampWithin(raw, size, limit)
    if (sideChoice === 'top' || sideChoice === 'bottom') {
      switch (align) {
        case 'start': out.left = place(trigger.left, pop.width, vw); break
        case 'end': out.left = place(trigger.right - pop.width, pop.width, vw); break
        default:
          out.left = place(trigger.left + trigger.width / 2 - pop.width / 2, pop.width, vw)
      }
    }
    else {
      switch (align) {
        case 'start': out.top = place(trigger.top, pop.height, vh); break
        case 'end': out.top = place(trigger.bottom - pop.height, pop.height, vh); break
        default:
          out.top = place(trigger.top + trigger.height / 2 - pop.height / 2, pop.height, vh)
      }
    }
    if (sideChoice === 'top' || sideChoice === 'bottom') {
      if (out.top < margin || out.top + pop.height > vh - margin) return null
    }
    else {
      if (out.left < margin || out.left + pop.width > vw - margin) return null
    }
    return out
  }

  function fitsCrossAxis(
    sideChoice: typeof side,
    rect: PositionRect,
    width: number,
    height: number,
  ): boolean {
    if (sideChoice === 'top' || sideChoice === 'bottom') {
      return rect.left >= margin && rect.left + rect.width <= width - margin
    }
    return rect.top >= margin && rect.top + rect.height <= height - margin
  }

  const opposite: Record<typeof side, typeof side> = {
    top: 'bottom', bottom: 'top', left: 'right', right: 'left',
  }
  let finalSide = side
  let r = rectFor(side, trigBox, popBox)
  if (!r && props.flip) {
    const flipped = rectFor(opposite[side], trigBox, popBox)
    if (flipped) {
      r = flipped
      finalSide = opposite[side]
    }
  }
  if (!r || !fitsCrossAxis(finalSide, r, vw, vh)) {
    r = rectFor(finalSide, trigBox, popBox, false)!
  }
  resolvedSide.value = finalSide

  const widthStyle = props.width === 'trigger'
    ? { width: `${trigBox.width}px` }
    : typeof props.width === 'number'
      ? { width: `${props.width}px` }
      : {}

  popoverStyle.value = {
    position: 'fixed',
    top: `${r.top}px`,
    left: `${r.left}px`,
    ...Object.fromEntries(
      Object.entries(widthStyle).map(([k, v]) => [k, String(v)]),
    ),
    ...(props.zIndex === undefined ? {} : { zIndex: String(props.zIndex) }),
  }

  const arrowOffset: Record<string, string> = {}
  const triggerCenterX = trigBox.left + trigBox.width / 2
  const triggerCenterY = trigBox.top + trigBox.height / 2
  const popCenterX = r.left + r.width / 2
  const popCenterY = r.top + r.height / 2
  const aimX = props.arrowPointToCenter ? popCenterX : triggerCenterX
  const aimY = props.arrowPointToCenter ? popCenterY : triggerCenterY

  function clampAim(aim: number, start: number, size: number): number {
    const lo = start + arrowInset
    const hi = start + size - arrowInset
    return Math.max(lo, Math.min(aim, hi))
  }

  if (finalSide === 'top' || finalSide === 'bottom') {
    const arrowCenter = clampAim(aimX, r.left, r.width)
    arrowOffset.left = `${Math.round((arrowCenter - r.left - ARROW_OFFSET) * 10) / 10}px`
    arrowOffset[finalSide === 'top' ? 'bottom' : 'top'] = `-${ARROW_OFFSET}px`
  }
  else {
    const arrowCenter = clampAim(aimY, r.top, r.height)
    arrowOffset.top = `${Math.round((arrowCenter - r.top - ARROW_OFFSET) * 10) / 10}px`
    arrowOffset[finalSide === 'left' ? 'right' : 'left'] = `-${ARROW_OFFSET}px`
  }
  arrowStyle.value = arrowOffset
}

/* Recompute on show and on scroll/resize while open (capture-phase
 * scroll — the event does not bubble). */
let resizeObserver: ResizeObserver | null = null
watch(visible, async (v) => {
  if (v) {
    await recompute()
    if (!resizeObserver && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => { void recompute() })
      resizeObserver.observe(document.body)
    }
    window.addEventListener('scroll', onScrollOrResize, true)
    window.addEventListener('resize', onScrollOrResize)
  }
  else {
    window.removeEventListener('scroll', onScrollOrResize, true)
    window.removeEventListener('resize', onScrollOrResize)
  }
}, { immediate: true })
function onScrollOrResize(): void {
  void recompute()
}

/* ─────────── Outside-click dismiss (click trigger) ─────────── */

function onDocumentMouseDown(e: MouseEvent): void {
  if (props.trigger !== 'click' || !visible.value) return
  const t = e.target as Node | null
  if (!t) return
  if (triggerEl.value && triggerEl.value.contains(t)) return
  if (popoverEl.value && popoverEl.value.contains(t)) return
  props.onClickoutside?.(e)
  setVisible(false)
}

watch(visible, (v) => {
  if (props.trigger !== 'click') return
  if (v) document.addEventListener('mousedown', onDocumentMouseDown)
  else document.removeEventListener('mousedown', onDocumentMouseDown)
}, { immediate: true })

/* ─────────── Action handlers (veto semantics) ─────────── */

async function runAction(
  kind: 'positive' | 'negative',
  e: MouseEvent,
): Promise<void> {
  const handler = kind === 'positive' ? props.onPositiveClick : props.onNegativeClick
  // No handler → naive default: the bubble simply closes.
  if (!handler) {
    setVisible(false)
    return
  }
  const ret = handler(e)
  // Sync veto.
  if (ret === false) return
  // Async: hold the bubble open until the Promise settles.
  if (ret instanceof Promise) {
    const resolved = await ret
    if (resolved !== false) setVisible(false)
    return
  }
  setVisible(false)
}

function onPositiveClick(e: MouseEvent): void {
  void runAction('positive', e)
}
function onNegativeClick(e: MouseEvent): void {
  void runAction('negative', e)
}

/* ─────────── Icon ─────────── */

/** Default glyph: warning triangle (markRaw keeps it out of reactivity). */
const defaultIcon = markRaw(AlertTriangle) as IconComponent
const resolvedIcon = computed<IconComponent>(() => props.icon ?? defaultIcon)

/* ─────────── Cleanup (§41/§42) ─────────── */

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

/* When controlled show flips true via the parent, recompute. */
watch(() => props.show, (s) => {
  if (s === undefined) return
  if (s && !visible.value) {
    clearTimers()
    setVisible(true)
  }
})

const arrowPlacementClass = computed(() => `sn-popconfirm__arrow--${resolvedSide.value}`)

const popoverPlacementClass = computed<string[]>(() => {
  const requested = `sn-popconfirm--${props.placement}`
  const resolved = `sn-popconfirm--${resolvedSide.value}`
  return requested === resolved ? [requested] : [requested, resolved]
})

const hasBeenVisible = ref(false)
watch(visible, (v) => {
  if (v) hasBeenVisible.value = true
})
const shouldRenderPopover = computed(() =>
  props.displayDirective === 'show'
    ? hasBeenVisible.value
    : visible.value && !props.disabled,
)

// Expose imperative API for parents that prefer ref-based control.
defineExpose({
  /** Programmatic show. Respects disabled. */
  show: () => setVisible(true),
  /** Programmatic hide. */
  hide: () => setVisible(false),
  /** Read current effective show state (controlled + uncontrolled). */
  isShown: () => visible.value,
})
</script>

<template>
  <span
    ref="triggerEl"
    class="sn-popconfirm-trigger"
    :aria-expanded="visible ? 'true' : 'false'"
    aria-haspopup="dialog"
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
      class="sn-popconfirm"
      :class="[
        popoverPlacementClass,
        !animated && 'sn-popconfirm--no-animation',
      ]"
      :style="popoverStyle"
      role="dialog"
      aria-modal="false"
      data-snui-component="popconfirm"
      @mouseenter="onPopoverMouseEnter"
      @mouseleave="onPopoverMouseLeave"
    >
      <div class="sn-popconfirm__body" :class="contentClass" :style="contentStyle">
        <div v-if="showIcon" class="sn-popconfirm__icon" aria-hidden="true">
          <slot name="icon">
            <SnIcon :icon="resolvedIcon" :size="20" />
          </slot>
        </div>
        <div class="sn-popconfirm__main">
          <div class="sn-popconfirm__message">{{ content }}</div>
          <div class="sn-popconfirm__action">
            <slot name="action">
              <SnButton
                size="tiny"
                v-bind="negativeButtonProps"
                @click="onNegativeClick"
              >
                {{ negativeText }}
              </SnButton>
              <SnButton
                size="tiny"
                type="primary"
                v-bind="positiveButtonProps"
                @click="onPositiveClick"
              >
                {{ positiveText }}
              </SnButton>
            </slot>
          </div>
        </div>
      </div>
      <span
        v-if="arrowVisible"
        class="sn-popconfirm__arrow"
        :class="[arrowPlacementClass, arrowClass]"
        :style="{ ...arrowStyle, ...(props.arrowStyle ?? {}) }"
        aria-hidden="true"
      />
    </div>
  </Teleport>
</template>

<style scoped>
/* Web side: --sn-web-* tokens only (§114 / Spec-02). */

.sn-popconfirm-trigger {
  display: inline-flex;
}

.sn-popconfirm {
  z-index: 9999;
  pointer-events: auto;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 1.6;
  color: var(--sn-web-color-text-primary, #1f2329);
  background: var(--sn-web-color-background-surface, #ffffff);
  border: 1px solid var(--sn-web-color-border-subtle, rgba(31, 35, 41, 0.12));
  border-radius: 8px;
  overflow: visible;
  box-shadow: var(--sn-web-card-shadow, 0 2px 8px rgba(0, 0, 0, 0.12));
  animation: sn-popconfirm-in 180ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
.sn-popconfirm--top    { animation-name: sn-popconfirm-in-top; }
.sn-popconfirm--bottom { animation-name: sn-popconfirm-in-bottom; }
.sn-popconfirm--left   { animation-name: sn-popconfirm-in-left; }
.sn-popconfirm--right  { animation-name: sn-popconfirm-in-right; }

.sn-popconfirm--no-animation {
  animation: none;
}

.sn-popconfirm__body {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
}

.sn-popconfirm__icon {
  display: inline-flex;
  flex-shrink: 0;
  /* Default glyph is a warning cue (§28 feedback semantics). */
  color: var(--sn-web-color-feedback-warning, #f0a020);
  margin-top: 2px;
}

.sn-popconfirm__main {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.sn-popconfirm__message {
  font-size: 14px;
  color: var(--sn-web-color-text-primary, #1f2329);
  white-space: normal;
  word-wrap: break-word;
  max-width: 260px;
}

.sn-popconfirm__action {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/*
 * Arrow: same rotated-square technique as SnPopover — a 14px square
 * rotated 45°, centred on the bubble edge by the inline offsets that
 * recompute() writes. Only the two faces forming the outward tip carry
 * the card border.
 */
.sn-popconfirm__arrow {
  position: absolute;
  width: 14px;
  height: 14px;
  box-sizing: border-box;
  background: var(--sn-web-color-background-surface, #ffffff);
  border: 0 solid var(--sn-web-color-border-subtle, rgba(31, 35, 41, 0.12));
  transform: rotate(45deg);
}
.sn-popconfirm__arrow--top {
  border-right-width: 1px;
  border-bottom-width: 1px;
}
.sn-popconfirm__arrow--bottom {
  border-top-width: 1px;
  border-left-width: 1px;
}
.sn-popconfirm__arrow--left {
  border-top-width: 1px;
  border-right-width: 1px;
}
.sn-popconfirm__arrow--right {
  border-left-width: 1px;
  border-bottom-width: 1px;
}

/* ─────────── Animations ─────────── */

@keyframes sn-popconfirm-in {
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes sn-popconfirm-in-top    { from { opacity: 0; transform: translateY(4px) scale(0.96); } to { opacity: 1; transform: none; } }
@keyframes sn-popconfirm-in-bottom { from { opacity: 0; transform: translateY(-4px) scale(0.96); } to { opacity: 1; transform: none; } }
@keyframes sn-popconfirm-in-left   { from { opacity: 0; transform: translateX(4px) scale(0.96); } to { opacity: 1; transform: none; } }
@keyframes sn-popconfirm-in-right  { from { opacity: 0; transform: translateX(-4px) scale(0.96); } to { opacity: 1; transform: none; } }
</style>
