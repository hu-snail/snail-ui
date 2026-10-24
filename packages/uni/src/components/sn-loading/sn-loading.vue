<script setup lang="ts">
/**
 * sn-loading (uni-end) — loading indicator for mobile / miniprogram.
 *
 * Reference library: wot-ui `wd-loading`
 *   (https://wot-ui.cn/component/loading.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-loading 1:1
 * (same prop names, defaults, allowed value sets). Anything new added here
 * MUST also be added to the reference list in AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-loading/sn-loading.vue
 * → auto-registered as `<sn-loading>` in any .vue that uses it.
 *
 * Per AGENTS.md §32, this component handles rendering + interaction only.
 * No schema validation; no business logic; no data fetching.
 *
 * ## Geometry (why the CSS uses percentages + `em`)
 *
 * `wd-loading` scales every spinner shape off one base size
 * (`--wot-loading-size`). Here the same relationship is expressed with
 * percentages inside a `1em` box and an `em`-relative root font-size, so a
 * single `size` prop resizes all four spinner types without per-type rpx
 * overrides.
 *
 * Usage:
 *   <sn-loading />
 *   <sn-loading type="wave" text="加载中" />
 *   <sn-loading type="dots" direction="horizontal" text="提交中" />
 *
 * Not responsible for:
 *   - 包裹内容并遮罩（整块 loading）— 用 sn-overlay + sn-loading 组合
 *   - 骨架屏 — 用 sn-skeleton
 *   - 进度百分比 — 用 sn-progress
 */

import { computed } from 'vue'

defineOptions({ name: 'SnLoading' })

/** Spinner shape. Mirrors `wd-loading` `type`. */
type LoadingType = 'circular' | 'spinner' | 'dots' | 'wave'

/** Layout direction of spinner + text. Mirrors `wd-loading` `direction`. */
type LoadingDirection = 'vertical' | 'horizontal'

const props = withDefaults(
  defineProps<{
    /** Spinner shape. */
    type?: LoadingType
    /** Spinner color override (any CSS color value). */
    color?: string
    /** Base size — a bare number is treated as rpx, a string passes through. */
    size?: number | string
    /** Text shown next to / below the spinner. */
    text?: string
    /** Layout direction of spinner + text. */
    direction?: LoadingDirection
    /** Inherit the parent's `color` instead of the token default. */
    inheritColor?: boolean
    /** Custom class for the root node. */
    customClass?: string
    /** Custom inline style for the root node. */
    customStyle?: string
    /** Custom class for the spinner box only. */
    customSpinnerClass?: string
  }>(),
  {
    type: 'circular',
    color: '',
    size: '',
    text: '',
    direction: 'vertical',
    inheritColor: false,
    customClass: '',
    customStyle: '',
    customSpinnerClass: '',
  },
)

defineSlots<{
  /** Loading text content (overrides `text`). */
  default?(): unknown
}>()

/** Bars rendered by the `wave` type — mirrors wd-loading's 5-bar wave. */
const WAVE_BARS = [0, 1, 2, 3, 4] as const

/**
 * Effective size. A bare number is rpx (uni-app's cross-device unit), a string
 * is used verbatim so `'2em'` / `'48rpx'` / `'20px'` all work.
 */
const spinnerSize = computed(() => {
  if (props.size === '' || props.size === undefined) return ''
  return typeof props.size === 'number' ? `${props.size}rpx` : props.size
})

const rootClass = computed(() => [
  'sn-loading',
  `sn-loading--${props.type}`,
  `sn-loading--${props.direction}`,
  {
    'sn-loading--inherit-color': props.inheritColor,
  },
  props.customClass,
])

const rootStyle = computed(() => {
  const parts: string[] = []
  // `size` drives the root font-size: every shape is sized in `em`, so one
  // value scales the whole spinner (see the file header).
  if (spinnerSize.value) parts.push(`font-size: ${spinnerSize.value}`)
  if (props.color) parts.push(`color: ${props.color}`)
  if (props.customStyle) parts.push(props.customStyle)
  return parts.length > 0 ? parts.join('; ') : undefined
})

const spinnerClass = computed(() => ['sn-loading__spinner', props.customSpinnerClass])
</script>

<template>
  <view
    data-snui-component="loading"
    :class="rootClass"
    :style="rootStyle"
    role="status"
    aria-live="polite"
    :aria-busy="true"
  >
    <view :class="spinnerClass" aria-hidden="true">
      <!-- circular: a ring with one transparent quadrant, rotating. -->
      <view v-if="type === 'circular'" class="sn-loading__circular" />

      <!-- spinner: N tapering bars fading around a circle. -->
      <view v-else-if="type === 'spinner'" class="sn-loading__spinner-bars">
        <view
          v-for="i in 8"
          :key="i"
          class="sn-loading__spinner-bar"
          :style="{ transform: `rotate(${(i - 1) * 45}deg)` }"
        />
      </view>

      <!-- dots: three pulsing dots. -->
      <view v-else-if="type === 'dots'" class="sn-loading__dots">
        <view v-for="i in 3" :key="i" class="sn-loading__dot" />
      </view>

      <!-- wave: five bars scaling up and down in sequence. -->
      <view v-else class="sn-loading__wave">
        <view
          v-for="i in WAVE_BARS"
          :key="i"
          class="sn-loading__wave-bar"
          :style="{ animationDelay: `${i * 0.1}s` }"
        />
      </view>
    </view>

    <view v-if="text || $slots.default" class="sn-loading__text">
      <slot>{{ text }}</slot>
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only. Direct --sn-web-* / --aui-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-loading {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--sn-mp-spacing-3);
  /* Base size — overridden inline by the `size` prop. 28px @ 750 design. */
  font-size: 56rpx;
  line-height: 1;
  /* Default spinner color: the primary accent (mirrors --wot-loading-color-main). */
  color: var(--sn-mp-color-action-primary);
}

.sn-loading--horizontal {
  flex-direction: row;
  align-items: center;
}

.sn-loading--inherit-color {
  color: inherit;
}

/* ── Spinner box: 1em square, all shapes positioned inside it ──────────── */

.sn-loading__spinner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  flex: 0 0 auto;
}

/* ── circular ─────────────────────────────────────────────────────────── */

.sn-loading__circular {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border: 0.15em solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: sn-loading-spin 0.8s linear infinite;
}

/* ── spinner (8 fading bars) ──────────────────────────────────────────── */

.sn-loading__spinner-bars {
  position: relative;
  width: 100%;
  height: 100%;
}

.sn-loading__spinner-bar {
  position: absolute;
  top: 0;
  left: 50%;
  width: 10%;
  height: 25%;
  margin-left: -5%;
  border-radius: 999rpx;
  background-color: currentColor;
  transform-origin: 50% 200%;
  animation: sn-loading-bar-fade 0.8s linear infinite;
}

.sn-loading__spinner-bar:nth-child(1) { animation-delay: 0s; opacity: 1; }
.sn-loading__spinner-bar:nth-child(2) { animation-delay: 0.1s; opacity: 0.875; }
.sn-loading__spinner-bar:nth-child(3) { animation-delay: 0.2s; opacity: 0.75; }
.sn-loading__spinner-bar:nth-child(4) { animation-delay: 0.3s; opacity: 0.625; }
.sn-loading__spinner-bar:nth-child(5) { animation-delay: 0.4s; opacity: 0.5; }
.sn-loading__spinner-bar:nth-child(6) { animation-delay: 0.5s; opacity: 0.375; }
.sn-loading__spinner-bar:nth-child(7) { animation-delay: 0.6s; opacity: 0.25; }
.sn-loading__spinner-bar:nth-child(8) { animation-delay: 0.7s; opacity: 0.125; }

/* ── dots ─────────────────────────────────────────────────────────────── */

.sn-loading__dots {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 20%;
}

.sn-loading__dot {
  width: 20%;
  height: 100%;
  border-radius: 50%;
  background-color: currentColor;
  animation: sn-loading-dot-pulse 1s ease-in-out infinite;
}

.sn-loading__dot:nth-child(2) { animation-delay: 0.15s; }
.sn-loading__dot:nth-child(3) { animation-delay: 0.3s; }

/* ── wave ─────────────────────────────────────────────────────────────── */

.sn-loading__wave {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
}

.sn-loading__wave-bar {
  width: 12.5%;
  height: 83.333%;
  border-radius: 999rpx;
  background-color: currentColor;
  animation: sn-loading-wave 0.834s ease-in-out infinite;
}

/* ── Text ─────────────────────────────────────────────────────────────── */

.sn-loading__text {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-md);
  line-height: var(--sn-mp-font-line-height-normal);
  white-space: nowrap;
}

.sn-loading--horizontal .sn-loading__text {
  margin-left: var(--sn-mp-spacing-3);
}

/* ── Keyframes ────────────────────────────────────────────────────────── */

@keyframes sn-loading-spin {
  to { transform: rotate(360deg); }
}

@keyframes sn-loading-bar-fade {
  0%, 100% { opacity: 0.125; }
  50% { opacity: 1; }
}

@keyframes sn-loading-dot-pulse {
  0%, 100% { opacity: 0.3; transform: scale(0.6); }
  50% { opacity: 1; transform: scale(1); }
}

@keyframes sn-loading-wave {
  0%, 100% { transform: scaleY(0.4); }
  50% { transform: scaleY(1); }
}

/* Doodle skin — thicker hand-drawn strokes. */
.snui-skin-doodle .sn-loading__circular {
  border-width: 0.2em;
}
.snui-skin-doodle .sn-loading__dot,
.snui-skin-doodle .sn-loading__wave-bar,
.snui-skin-doodle .sn-loading__spinner-bar {
  border-radius: var(--sn-mp-radius-xs);
}
</style>
