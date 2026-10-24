<script setup lang="ts">
/**
 * sn-slider (uni-end) — single / range slider with touch dragging.
 *
 * Reference library: wot-ui `wd-slider`
 *   (https://wot-ui.cn/component/slider.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-slider 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-slider/sn-slider.vue
 * → auto-registered as `<sn-slider>` in any .vue that uses it.
 *
 * ## Geometry
 *
 * The track length is measured once on mount (`onMounted` → one
 * `getBoundingClientRect`) and re-measured on demand through the exposed
 * `initSlider()`. The uni-end has no `ResizeObserver` on every target, so no
 * observer is registered: nothing to dispose (§41). Drag state is plain
 * component state that dies with the component.
 *
 * ## Range mode
 *
 * `range: true` takes a `[start, end]` pair. Knobs are clamped so they never
 * cross: dragging the left knob past the right one stops at the right value.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 输入框联动 — 由宿主组合 sn-input-number
 *   - 表单校验 — 用 sn-form-item
 */

import { computed, onMounted, ref } from 'vue'
import type {
  SliderMark,
  SliderMarks,
  SliderPopoverVisible,
  SliderTheme,
  SliderValue,
} from './sn-slider-types'

defineOptions({ name: 'SnSlider' })

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-slider` 1:1 surface ─────────────────────────────────── */

    /** Current value — `number`, or `[start, end]` in `range` mode. */
    modelValue?: SliderValue
    /** Lower bound. */
    min?: number
    /** Upper bound. */
    max?: number
    /** Snap granularity. */
    step?: number
    /** Two-knob mode. */
    range?: boolean
    /** Vertical orientation. */
    vertical?: boolean
    /** Visual style. */
    theme?: SliderTheme
    /** Disables dragging. */
    disabled?: boolean
    /** Show the `min` / `max` captions at both ends. */
    showExtremeValue?: boolean
    /** When the value bubble is shown. */
    popoverVisible?: SliderPopoverVisible
    /** Tick marks (array or `{ value: label }` record). */
    marks?: SliderMarks | undefined
    /** Active track color (CSS color). Empty = token default. */
    activeColor?: string
    /** Inactive track color (CSS color). Empty = token default. */
    inactiveColor?: string
    /** Class on the root node. */
    customClass?: string
    /** Inline style on the root node. */
    customStyle?: string
  }>(),
  {
    modelValue: 0,
    min: 0,
    max: 100,
    step: 1,
    range: false,
    vertical: false,
    theme: 'default',
    disabled: false,
    showExtremeValue: false,
    popoverVisible: 'normal',
    marks: undefined,
    activeColor: '',
    inactiveColor: '',
    customClass: '',
    customStyle: '',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: SliderValue): void
  (e: 'change', value: SliderValue): void
  (e: 'dragstart', payload: { value: SliderValue }): void
  (e: 'dragmove', payload: { value: SliderValue }): void
  (e: 'dragend', payload: { value: SliderValue }): void
}>()

/* ── Value maths ───────────────────────────────────────────────────────── */

const span = computed(() => {
  const width = props.max - props.min
  return width > 0 ? width : 1
})

function clampValue(value: number): number {
  if (!Number.isFinite(value)) return props.min
  return Math.min(Math.max(value, props.min), props.max)
}

function snap(value: number): number {
  const step = props.step > 0 ? props.step : 1
  const steps = Math.round((value - props.min) / step)
  const snapped = props.min + steps * step
  // Kill float noise from the multiplication (0.1 * 3 = 0.30000000000000004).
  const decimals = Math.max(String(step).split('.')[1]?.length ?? 0, 0)
  return Number(snapClamp(snapped).toFixed(decimals))
}

function snapClamp(value: number): number {
  return Math.min(Math.max(value, props.min), props.max)
}

/** Normalized `[start, end]` pair regardless of mode. */
const pair = computed<[number, number]>(() => {
  const value = props.modelValue
  if (Array.isArray(value)) {
    const start = clampValue(Number(value[0] ?? props.min))
    const end = clampValue(Number(value[1] ?? props.max))
    return start <= end ? [start, end] : [end, start]
  }
  const single = clampValue(Number(value ?? props.min))
  return [props.min, single]
})

const percentOf = (value: number): number => ((value - props.min) / span.value) * 100

/** Active segment start / width, in %. */
const activeStartPercent = computed(() => (props.range ? percentOf(pair.value[0]) : 0))
const activeWidthPercent = computed(() => {
  const end = percentOf(pair.value[1])
  return Math.max(end - activeStartPercent.value, 0)
})

/* ── Geometry ──────────────────────────────────────────────────────────── */

/** Track length in px, measured on mount and on `initSlider()`. */
const trackSize = ref(0)

type TrackElement = {
  getBoundingClientRect?: () => {
    left: number
    top: number
    width: number
    height: number
  }
}

const trackRef = ref<TrackElement | null>(null)

function initSlider(): void {
  const el = trackRef.value
  if (!el || typeof el.getBoundingClientRect !== 'function') return
  const rect = el.getBoundingClientRect()
  trackSize.value = props.vertical ? rect.height : rect.width
}

onMounted(initSlider)

/** Start a drag from the track itself (tap-to-jump keeps the closest knob). */
function onTrackStart(event: Event): void {
  if (props.disabled || dragKnob.value !== null) return
  if (!props.range) {
    dragKnob.value = 1
    emit('dragstart', { value: props.modelValue })
    void event
    return
  }
  const raw = valueFromEvent(event)
  const toStart = Math.abs(raw - pair.value[0])
  const toEnd = Math.abs(raw - pair.value[1])
  dragKnob.value = toStart <= toEnd ? 0 : 1
  emit('dragstart', { value: props.modelValue })
}

/* ── Dragging ──────────────────────────────────────────────────────────── */

/**
 * Drag in progress — `0` = left / single knob, `1` = right knob, `null` = rest.
 *
 * Drives the value bubble: `popoverVisible: 'normal'` shows it only for the knob
 * being dragged (wd-slider behaviour); `'always'` / `'never'` ignore this state.
 */
const dragKnob = ref<0 | 1 | null>(null)

function positionOf(event: Event): number {
  const detail = event as unknown as {
    touches?: Array<{ clientX?: number, clientY?: number, pageX?: number, pageY?: number }>
    changedTouches?: Array<{ clientX?: number, clientY?: number, pageX?: number, pageY?: number }>
    detail?: { x?: number, y?: number }
    clientX?: number
    clientY?: number
  }
  const list = detail.touches ?? detail.changedTouches
  const point = list && list.length > 0 ? list[0] : undefined
  if (props.vertical) {
    if (point && typeof point.clientY === 'number') return point.clientY
    if (point && typeof point.pageY === 'number') return point.pageY
    if (detail.detail && typeof detail.detail.y === 'number') return detail.detail.y
    return 0
  }
  if (point && typeof point.clientX === 'number') return point.clientX
  if (point && typeof point.pageX === 'number') return point.pageX
  if (detail.detail && typeof detail.detail.x === 'number') return detail.detail.x
  return 0
}

/** Convert an absolute pointer position into a snapped value. */
function valueFromEvent(event: Event): number {
  const el = trackRef.value
  const rect = el && typeof el.getBoundingClientRect === 'function'
    ? el.getBoundingClientRect()
    : null
  const size = trackSize.value > 0
    ? trackSize.value
    : rect
      ? (props.vertical ? rect.height : rect.width)
      : 0
  if (size <= 0) return pair.value[1]
  const position = positionOf(event)
  // uni-app touch events carry client coordinates, so the rect origin has to
  // be subtracted to get a position relative to the track.
  const local = rect ? position - (props.vertical ? rect.top : rect.left) : position
  const ratio = props.vertical ? 1 - local / size : local / size
  return snap(clampValue(props.min + ratio * span.value))
}

function emitValue(next: [number, number]): void {
  const value: SliderValue = props.range ? [next[0], next[1]] : next[1]
  emit('update:modelValue', value)
  emit('change', value)
}

function onKnobStart(knob: 0 | 1, event: Event): void {
  if (props.disabled) return
  dragKnob.value = knob
  emit('dragstart', { value: props.modelValue })
  void event
}

function onTrackMove(event: Event): void {
  if (props.disabled || dragKnob.value === null) return
  applyValue(valueFromEvent(event))
  emit('dragmove', { value: props.modelValue })
}

function applyValue(raw: number): void {
  const current = pair.value
  if (!props.range) {
    if (raw === current[1]) return
    emitValue([props.min, raw])
    return
  }
  if (dragKnob.value === 0) {
    const start = Math.min(raw, current[1])
    if (start === current[0]) return
    emitValue([start, current[1]])
    return
  }
  const end = Math.max(raw, current[0])
  if (end === current[1]) return
  emitValue([current[0], end])
}

function onTrackEnd(event: Event): void {
  if (dragKnob.value === null) return
  applyValue(valueFromEvent(event))
  dragKnob.value = null
  emit('dragend', { value: props.modelValue })
}

function onTrackCancel(): void {
  if (dragKnob.value === null) return
  dragKnob.value = null
  emit('dragend', { value: props.modelValue })
}

/** Tapping the track jumps the closest knob to the tapped position. */
function onTrackTap(event: Event): void {
  if (props.disabled) return
  const raw = valueFromEvent(event)
  if (props.range) {
    const current = pair.value
    const toStart = Math.abs(raw - current[0])
    const toEnd = Math.abs(raw - current[1])
    dragKnob.value = toStart <= toEnd ? 0 : 1
    applyValue(raw)
    dragKnob.value = null
    emit('change', props.range ? [pair.value[0], pair.value[1]] : pair.value[1])
    return
  }
  applyValue(raw)
}

defineExpose({ initSlider })

/* ── Marks ─────────────────────────────────────────────────────────────── */

const markList = computed<SliderMark[]>(() => {
  const value = props.marks
  if (!value) return []
  if (Array.isArray(value)) {
    return value
      .filter(mark => Number.isFinite(mark.value))
      .map(mark => ({ value: mark.value, label: mark.label ?? '' }))
  }
  return Object.entries(value).map(([key, label]) => ({ value: Number(key), label }))
})

const markEntries = computed(() =>
  markList.value.map(mark => ({
    value: mark.value,
    label: mark.label ?? String(mark.value),
    percent: percentOf(mark.value),
    active: props.range
      ? mark.value >= pair.value[0] && mark.value <= pair.value[1]
      : mark.value <= pair.value[1],
  })),
)

/* ── Presentation ──────────────────────────────────────────────────────── */

const rootClass = computed(() => [
  'sn-slider',
  `sn-slider--${props.theme}`,
  {
    'sn-slider--vertical': props.vertical,
    'sn-slider--disabled': props.disabled,
    'sn-slider--range': props.range,
    'sn-slider--with-marks': markEntries.value.length > 0,
  },
  props.customClass,
])

const rootStyle = computed(() => {
  const vars: string[] = []
  if (props.activeColor) vars.push(`--sn-slider-line-bg: ${props.activeColor}`)
  if (props.inactiveColor) vars.push(`--sn-slider-bar-bg: ${props.inactiveColor}`)
  const base = vars.join('; ')
  if (!props.customStyle) return base
  return base ? `${base}; ${props.customStyle}` : props.customStyle
})

const activeStyle = computed(() => {
  const size = `${activeWidthPercent.value}%`
  if (props.vertical) {
    return {
      bottom: `${activeStartPercent.value}%`,
      height: size,
      left: '0',
      right: '0',
    }
  }
  return {
    left: `${activeStartPercent.value}%`,
    width: size,
    top: '0',
    bottom: '0',
  }
})

function knobStyle(value: number): Record<string, string> {
  const percent = `${percentOf(value)}%`
  if (props.vertical) return { bottom: percent, left: '50%' }
  return { left: percent, top: '50%' }
}

/**
 * Whether the bubble of one knob is on screen.
 *
 * `'always'` pins it, `'never'` removes it, and the default `'normal'` shows it
 * only while that knob is dragged — a permanently visible bubble overlaps the
 * surrounding layout (and the reference only shows it during a drag).
 */
function popoverShown(knob: 0 | 1): boolean {
  if (props.popoverVisible === 'always') return true
  if (props.popoverVisible === 'never') return false
  return dragKnob.value === knob
}

function knobValue(knob: 0 | 1): number {
  return props.range ? pair.value[knob] : pair.value[1]
}
</script>

<template>
  <view
    :class="rootClass"
    :style="rootStyle"
    :data-snui-component="'slider'"
    :aria-disabled="disabled ? 'true' : undefined"
  >
    <text v-if="showExtremeValue && !vertical" class="sn-slider__extreme">{{ min }}</text>

    <view class="sn-slider__body">
      <view
        ref="trackRef"
        :class="['sn-slider__track', { 'sn-slider__track--vertical': vertical }]"
        role="slider"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="knobValue(1)"
        :aria-disabled="disabled ? 'true' : undefined"
        :aria-orientation="vertical ? 'vertical' : 'horizontal'"
        @tap="onTrackTap"
        @touchstart="onTrackStart"
        @touchmove="onTrackMove"
        @touchend="onTrackEnd"
        @touchcancel="onTrackCancel"
      >
        <view class="sn-slider__bar" aria-hidden="true" />
        <view class="sn-slider__line" :style="activeStyle" aria-hidden="true" />

        <view
          v-for="(mark, index) in markEntries"
          :key="index"
          :class="['sn-slider__scale', { 'sn-slider__scale--active': mark.active }]"
          :style="vertical ? { bottom: `${mark.percent}%` } : { left: `${mark.percent}%` }"
          aria-hidden="true"
        />

        <view
          :class="['sn-slider__knob', { 'sn-slider__knob--dragging': dragKnob === (range ? 0 : 1) }]"
          :style="knobStyle(knobValue(range ? 0 : 1))"
          role="button"
          :aria-label="`slider knob ${knobValue(range ? 0 : 1)}`"
          :tabindex="disabled ? -1 : 0"
          @touchstart.stop="onKnobStart(range ? 0 : 1, $event)"
        >
          <view
            v-if="popoverShown(range ? 0 : 1)"
            class="sn-slider__popover"
            aria-hidden="true"
          >{{ knobValue(range ? 0 : 1) }}</view>
        </view>

        <view
          v-if="range"
          :class="['sn-slider__knob', { 'sn-slider__knob--dragging': dragKnob === 1 }]"
          :style="knobStyle(knobValue(1))"
          role="button"
          :aria-label="`slider knob ${knobValue(1)}`"
          :tabindex="disabled ? -1 : 0"
          @touchstart.stop="onKnobStart(1, $event)"
        >
          <view v-if="popoverShown(1)" class="sn-slider__popover" aria-hidden="true">{{ knobValue(1) }}</view>
        </view>
      </view>

      <view v-if="markEntries.length > 0" class="sn-slider__marks" aria-hidden="true">
        <text
          v-for="(mark, index) in markEntries"
          :key="index"
          :class="['sn-slider__mark', { 'sn-slider__mark--active': mark.active }]"
          :style="vertical ? { bottom: `${mark.percent}%` } : { left: `${mark.percent}%` }"
        >{{ mark.label }}</text>
      </view>
    </view>

    <text v-if="showExtremeValue && !vertical" class="sn-slider__extreme">{{ max }}</text>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). */

.sn-slider {
  display: flex;
  align-items: center;
  gap: var(--sn-mp-spacing-3);
  width: 100%;
  font-family: inherit;
  color: var(--sn-mp-color-text-secondary);
}

.sn-slider--vertical {
  flex-direction: column-reverse;
  align-items: center;
  height: 400rpx;
  width: auto;
}

.sn-slider--disabled {
  opacity: 0.6;
}

.sn-slider__extreme {
  flex: 0 0 auto;
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-slider-value-color, var(--sn-mp-color-text-tertiary));
}

.sn-slider__body {
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
}

.sn-slider--vertical .sn-slider__body {
  flex: 1 1 auto;
  height: 100%;
  width: 48rpx;
}

.sn-slider__track {
  position: relative;
  height: 48rpx;
  display: flex;
  align-items: center;
}

.sn-slider__track--vertical {
  height: 100%;
  width: 48rpx;
  flex-direction: column;
  justify-content: center;
}

.sn-slider__bar {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 4rpx;
  margin-top: -2rpx;
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-slider-bar-bg, var(--sn-mp-color-background-sunken));
}

.sn-slider__track--vertical .sn-slider__bar {
  left: 50%;
  right: auto;
  top: 0;
  bottom: 0;
  width: 4rpx;
  height: auto;
  margin-top: 0;
  margin-left: -2rpx;
}

.sn-slider__line {
  position: absolute;
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-slider-line-bg, var(--sn-mp-color-action-primary));
  height: 4rpx;
  top: 50%;
  margin-top: -2rpx;
}

.sn-slider__track--vertical .sn-slider__line {
  height: auto;
  width: 4rpx;
  left: 50%;
  top: auto;
  margin-top: 0;
  margin-left: -2rpx;
}

/* Capsule theme: thicker track + thicker active line. */
.sn-slider--capsule .sn-slider__bar,
.sn-slider--capsule .sn-slider__line {
  height: 24rpx;
  margin-top: -12rpx;
}

.sn-slider--capsule.sn-slider--vertical .sn-slider__bar,
.sn-slider--capsule.sn-slider--vertical .sn-slider__line {
  width: 24rpx;
  height: auto;
  margin-top: 0;
  margin-left: -12rpx;
}

.sn-slider__knob {
  position: absolute;
  width: 40rpx;
  height: 40rpx;
  margin-left: -20rpx;
  margin-top: -20rpx;
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-slider-dot-bg, var(--sn-mp-color-background-elevated));
  border: 2rpx solid var(--sn-mp-color-action-primary);
  box-shadow: var(--sn-mp-shadow-sm);
  box-sizing: border-box;
  z-index: 2;
}

.sn-slider__track--vertical .sn-slider__knob {
  left: 50%;
  margin-left: -20rpx;
  margin-top: 0;
  margin-bottom: -20rpx;
}

.sn-slider__knob--dragging {
  transform: scale(1.15);
}

.sn-slider__popover {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: var(--sn-mp-spacing-2);
  padding: var(--sn-mp-spacing-1) var(--sn-mp-spacing-3);
  border-radius: var(--sn-mp-radius-sm);
  background-color: var(--sn-slider-dot-popover-bg, var(--sn-mp-color-text-primary));
  color: var(--sn-slider-dot-popover-color, var(--sn-mp-color-text-on-primary));
  font-size: var(--sn-mp-font-size-xs);
  line-height: 1.4;
  white-space: nowrap;
}

.sn-slider__scale {
  position: absolute;
  width: 8rpx;
  height: 8rpx;
  margin-left: -4rpx;
  top: 50%;
  margin-top: -4rpx;
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-slider-scale-bg, var(--sn-mp-color-border-default));
  z-index: 1;
}

.sn-slider__track--vertical .sn-slider__scale {
  left: 50%;
  top: auto;
  margin-left: -4rpx;
  margin-top: 0;
  margin-bottom: -4rpx;
}

.sn-slider__scale--active {
  background-color: var(--sn-slider-scale-bg-active, var(--sn-mp-color-action-primary));
}

.sn-slider__marks {
  position: relative;
  height: 32rpx;
  margin-top: var(--sn-mp-spacing-1);
}

.sn-slider__mark {
  position: absolute;
  transform: translateX(-50%);
  font-size: var(--sn-mp-font-size-xs);
  color: var(--sn-slider-scale-desc-color, var(--sn-mp-color-text-tertiary));
  white-space: nowrap;
}

.sn-slider__mark--active {
  color: var(--sn-mp-color-action-primary);
}

/* Doodle skin — heavier knob outline. */
.snui-skin-doodle .sn-slider__knob {
  border-width: 4rpx;
  border-color: var(--sn-mp-color-text-primary);
  box-shadow: 2rpx 2rpx 0 var(--sn-mp-color-text-primary);
}
</style>
