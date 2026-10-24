<script setup lang="ts">
/**
 * sn-circle (uni-end) — circular progress ring for mobile / miniprogram.
 *
 * Reference library: wot-ui `wd-circle`
 *   (https://wot-ui.cn/component/circle.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-circle 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-circle/sn-circle.vue
 * → auto-registered as `<sn-circle>` in any .vue that uses it.
 *
 * ## Rendering: CSS conic-gradient, not SVG (uni cross-end constraint)
 *
 * wd-circle draws two SVG circles with `stroke-dasharray`. uni-app compiles
 * `<svg>` per target and miniprogram does not guarantee an inline-SVG host for
 * arbitrary shapes (sn-icon only gets away with it because icons are simple
 * stroked paths). The ring is therefore a conic-gradient on a masked `<view>`:
 * the filled sweep is `percentage × 3.6deg`, the remaining angle shows the
 * track color.
 *
 * The sweep angle and the fill color travel as inline custom properties
 * (`--sn-circle-sweep` / `--sn-circle-color` / `--sn-circle-stops`) so the
 * `conic-gradient()` itself lives in the stylesheet — that keeps the token
 * reference (`var(--sn-mp-color-action-primary)`) a real token instead of a
 * string baked into an inline style.
 *
 * Documented consequences (also on the docs page):
 *   - `stroke-linecap` (`butt` / `round` / `square`) has no equivalent on a
 *     conic sweep, so it is accepted for API parity but does not change the
 *     rendering. Documented as "未实现".
 *   - A gradient-object `color` (`Record<string, string>`) renders as a
 *     `conic-gradient` stop list; a plain string is a solid sweep.
 *
 * ## Dispose (AGENTS.md §41)
 *
 * No timer, no listener: the sweep animation is a CSS transition. Nothing to
 * dispose.
 *
 * Per AGENTS.md §32, this component handles rendering only.
 *
 * Not responsible for:
 *   - 线性进度条 — 用 sn-progress
 *   - 不定态加载指示器 — 用 sn-loading
 *   - 数字滚动 — 用 sn-count-to
 */

import { computed } from 'vue'

defineOptions({ name: 'SnCircle' })

/** Line cap of the ring stroke. Mirrors `wd-circle` `stroke-linecap`. */
type CircleLinecap = 'butt' | 'round' | 'square'

const props = withDefaults(
  defineProps<{
    /** Current progress, 0–100 (out-of-range values are clamped). */
    modelValue?: number
    /** Ring diameter. A bare number is treated as rpx (750 design). */
    size?: number | string
    /** Ring color: a solid CSS color, or a `{ offset: color }` gradient map. */
    color?: string | Record<string, string>
    /** Track (unfilled) color. */
    layerColor?: string
    /** Filled disc color inside the ring; empty renders a hollow ring. */
    fill?: string
    /** Animation speed in percent per second; `0` disables the transition. */
    speed?: number
    /** Text shown in the middle; empty shows the rounded percentage. */
    text?: string
    /** Ring thickness. A bare number is treated as rpx. */
    strokeWidth?: number | string
    /** Stroke cap (parity only — a conic sweep has no caps). */
    strokeLinecap?: CircleLinecap
    /** Sweep clockwise (the default) or counter-clockwise. */
    clockwise?: boolean
    /** Custom class for the root node. */
    customClass?: string
    /** Custom inline style for the root node. */
    customStyle?: string
  }>(),
  {
    modelValue: 0,
    size: 120,
    color: '',
    layerColor: '',
    fill: '',
    speed: 50,
    text: '',
    strokeWidth: 18,
    strokeLinecap: 'round',
    clockwise: true,
    customClass: '',
    customStyle: '',
  },
)

defineSlots<{
  /** Custom centre content (replaces `text` / the percentage). */
  default?(): unknown
}>()

/** Clamped progress. */
const clamped = computed(() => {
  const value = Number(props.modelValue)
  if (!Number.isFinite(value)) return 0
  return Math.min(100, Math.max(0, value))
})

/** Resolve a numeric-or-string length prop (bare number = rpx). */
function toLength(value: number | string, fallbackRpx: number): string {
  if (value === '') return `${fallbackRpx}rpx`
  return typeof value === 'number' ? `${value}rpx` : value
}

const ringSize = computed(() => toLength(props.size, 120))
const ringWidth = computed(() => toLength(props.strokeWidth, 18))

/**
 * Centre text. Mirrors wd-circle: `text` when provided, else the rounded
 * percentage (the reference renders `{value}%`).
 */
const centerText = computed(() =>
  props.text !== '' ? props.text : `${Math.round(clamped.value)}%`,
)

/** Gradient map normalised to a CSS stop list, or `null` for solid colors. */
const gradientStops = computed<string | null>(() => {
  if (typeof props.color !== 'object' || props.color === null) return null
  const entries = Object.entries(props.color)
  if (entries.length === 0) return null
  return entries
    .map(([offset, color]) => `${color} ${offset.endsWith('%') ? offset : `${offset}%`}`)
    .join(', ')
})

/** Sweep angle in degrees. */
const sweepDeg = computed(() => clamped.value * 3.6)

/**
 * Transition duration in ms. `speed` is "percent per second", so moving over
 * the current value takes `percentage / speed` seconds.
 */
const transitionMs = computed(() => {
  if (props.speed <= 0) return 0
  return Math.round((clamped.value / props.speed) * 1000)
})

const rootClass = computed(() => [
  'sn-circle',
  {
    'sn-circle--animated': props.speed > 0,
    'sn-circle--counter-clockwise': !props.clockwise,
    'sn-circle--gradient': gradientStops.value !== null,
  },
  props.customClass,
])

const rootStyle = computed(() => {
  const parts = [
    `--sn-circle-size: ${ringSize.value}`,
    `--sn-circle-width: ${ringWidth.value}`,
    `--sn-circle-duration: ${transitionMs.value}ms`,
  ]
  if (props.customStyle) parts.push(props.customStyle)
  return parts.join('; ')
})

/** Sweep + fill color as custom properties consumed by the stylesheet. */
const arcStyle = computed(() => {
  const parts = [`--sn-circle-sweep: ${sweepDeg.value}deg`]
  if (gradientStops.value !== null) {
    parts.push(`--sn-circle-stops: ${gradientStops.value}`)
  } else {
    const solid = typeof props.color === 'string' && props.color !== ''
      ? props.color
      : 'var(--sn-mp-color-action-primary)'
    parts.push(`--sn-circle-color: ${solid}`)
  }
  return parts.join('; ')
})

const trackStyle = computed(() =>
  props.layerColor ? `--sn-circle-layer: ${props.layerColor}` : undefined,
)

const fillStyle = computed(() =>
  props.fill ? `background-color: ${props.fill}` : undefined,
)
</script>

<template>
  <view
    data-snui-component="circle"
    :class="rootClass"
    :style="rootStyle"
    role="progressbar"
    :aria-valuenow="clamped"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-label="centerText"
  >
    <!-- Track: full ring in the layer color, masked down to a stroke band. -->
    <view class="sn-circle__track" :style="trackStyle" aria-hidden="true" />

    <!-- Progress arc: conic sweep, masked with the same band. -->
    <view class="sn-circle__arc" :style="arcStyle" aria-hidden="true" />

    <!-- Optional filled disc, drawn under the centre text. -->
    <view v-if="fill" class="sn-circle__fill" :style="fillStyle" aria-hidden="true" />

    <view class="sn-circle__text">
      <slot>{{ centerText }}</slot>
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-circle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: var(--sn-circle-size);
  height: var(--sn-circle-size);
  border-radius: 50%;
}

.sn-circle__track,
.sn-circle__arc,
.sn-circle__fill {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: 50%;
}

/* Band mask: keep only an annular ring of `--sn-circle-width`. */
.sn-circle__track,
.sn-circle__arc {
  -webkit-mask: radial-gradient(
    farthest-side,
    transparent calc(100% - var(--sn-circle-width)),
    currentColor calc(100% - var(--sn-circle-width))
  );
  mask: radial-gradient(
    farthest-side,
    transparent calc(100% - var(--sn-circle-width)),
    currentColor calc(100% - var(--sn-circle-width))
  );
}

/* Track ring: the tinted surface, dark-mode aware; `layerColor` overrides it. */
.sn-circle__track {
  background-color: var(--sn-circle-layer, var(--sn-mp-color-background-subtle));
}

/* Progress arc: colored up to the sweep angle, transparent past it. */
.sn-circle__arc {
  background-image: conic-gradient(
    from 0deg,
    var(--sn-circle-color) var(--sn-circle-sweep),
    transparent var(--sn-circle-sweep)
  );
  transition-property: background-image;
  transition-duration: var(--sn-circle-duration);
  transition-timing-function: linear;
}

/* Gradient map: the stop list replaces the two-stop sweep. */
.sn-circle--gradient .sn-circle__arc {
  background-image: conic-gradient(from 0deg, var(--sn-circle-stops));
}

/* Counter-clockwise: mirror the sweep so it grows the other way. */
.sn-circle--counter-clockwise .sn-circle__arc {
  transform: scaleX(-1);
}

.sn-circle__text {
  position: relative;
  z-index: 1;
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-lg);
  font-weight: var(--sn-mp-font-weight-medium);
  line-height: var(--sn-mp-font-line-height-tight);
  text-align: center;
}

/* Doodle skin — hand-drawn look: drop the band mask, keep a soft plate. */
.snui-skin-doodle .sn-circle__track,
.snui-skin-doodle .sn-circle__arc {
  -webkit-mask: none;
  mask: none;
  opacity: 0.6;
}
</style>
