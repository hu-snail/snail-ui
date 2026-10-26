<script setup lang="ts">
/**
 * sn-progress (uni-end) — progress bar for mobile / miniprogram.
 *
 * Reference library: wot-ui `wd-progress`
 *   (https://wot-ui.cn/component/progress.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-progress 1:1
 * (same prop names, defaults, allowed value sets). Anything new added here
 * MUST also be added to the reference list in AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-progress/sn-progress.vue
 * → auto-registered as `<sn-progress>` in any .vue that uses it.
 *
 * Per AGENTS.md §32, this component handles rendering only. No schema
 * validation; no business logic; no task orchestration.
 *
 * ## `color` forms (mirrors wd-progress)
 *
 *   - `string`           → solid fill color
 *   - `ProgressColor[]`  → `{ color, percentage }` thresholds; the entry with
 *                          the highest `percentage` that the current value has
 *                          reached wins (the reference documents this as the
 *                          "颜色生效的进度阈值" column)
 *   - `string[]`         → linear-gradient stops across the fill
 *
 * Usage:
 *   <sn-progress :percentage="60" />
 *   <sn-progress :percentage="40" status="warning" />
 *   <sn-progress :percentage="80" :percent-position="{ type: 'inner', align: 'center' }" />
 *
 * Not responsible for:
 *   - 加载中的不定态指示 — 用 sn-loading
 *   - 环形 / 多环进度 — wot-ui `wd-circle` 范畴，暂未实现
 *   - 数值动画组件 — 用 sn-count-to
 */

import { computed } from 'vue'

defineOptions({ name: 'SnProgress' })

/** Semantic status. Mirrors `wd-progress` `status`. */
type ProgressStatus = '' | 'success' | 'danger' | 'warning'

/** `percent-position.type`. Mirrors `wd-progress` `percent-position.type`. */
type ProgressLabelType = 'inner' | 'outer'

/** `percent-position.align`. Mirrors `wd-progress` `percent-position.align`. */
type ProgressLabelAlign = 'left' | 'center' | 'right'

/**
 * Color threshold entry. Mirrors the `ProgressColor` row group in the wd
 * reference table: `{ color, percentage }` — the color applies from
 * `percentage` upwards.
 */
export interface SnProgressColor {
  /** CSS color value. */
  color: string
  /** Lower bound (0–100) from which this color applies. */
  percentage?: number
}

/** `percent-position` object. */
export interface SnProgressPercentPosition {
  /** Where the percentage text sits: inside the fill or outside the bar. */
  type?: ProgressLabelType
  /** Horizontal alignment of the percentage text. */
  align?: ProgressLabelAlign
}

const props = withDefaults(
  defineProps<{
    /** Progress value, 0–100 (values outside the range are clamped). */
    percentage?: number
    /** Hide the percentage text. */
    hideText?: boolean
    /** Fill color: solid string, gradient string[], or threshold entries. */
    color?: string | string[] | SnProgressColor[]
    /** Semantic status; overrides `color` when set. */
    status?: ProgressStatus
    /** Milliseconds the bar takes to advance 1% (total = percentage × this). */
    duration?: number
    /** Percentage text placement + alignment. */
    percentPosition?: SnProgressPercentPosition
    /** Custom class for the root node. */
    customClass?: string
    /** Custom inline style for the root node. */
    customStyle?: string
  }>(),
  {
    percentage: 0,
    hideText: false,
    color: '',
    status: '',
    duration: 30,
    percentPosition: () => ({ type: 'outer', align: 'right' }),
    customClass: '',
    customStyle: '',
  },
)

/** Clamped progress value. Mirrors the reference's 0–100 bound. */
const clampedPercentage = computed(() => {
  const value = Number(props.percentage)
  if (!Number.isFinite(value)) return 0
  return Math.min(100, Math.max(0, value))
})

/** Displayed label text. */
const labelText = computed(() => `${Math.round(clampedPercentage.value)}%`)

const labelType = computed<ProgressLabelType>(() => props.percentPosition.type ?? 'outer')
const labelAlign = computed<ProgressLabelAlign>(() => props.percentPosition.align ?? 'right')

/** Is this a list of `{ color, percentage }` threshold entries? */
function isThresholdList(value: unknown): value is SnProgressColor[] {
  return Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null
}

/** Is this a gradient stop list (plain color strings)? */
function isGradientList(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && typeof value[0] === 'string'
}

/** Threshold entry that applies at the current value, or `undefined`. */
const activeThreshold = computed<SnProgressColor | undefined>(() => {
  if (!isThresholdList(props.color)) return undefined
  let match: SnProgressColor | undefined
  for (const entry of props.color) {
    const bound = entry.percentage ?? 0
    if (clampedPercentage.value >= bound) {
      if (!match || bound >= (match.percentage ?? 0)) match = entry
    }
  }
  return match
})

/** Inline style of the fill. */
const fillStyle = computed(() => {
  const parts: string[] = [`width: ${clampedPercentage.value}%`]
  const isZeroInnerLabel = clampedPercentage.value === 0 && labelType.value === 'inner'

  if (props.status) {
    // Status wins over `color` — same precedence as the reference.
    parts.push(`background-color: var(--sn-mp-color-feedback-${props.status})`)
  } else if (activeThreshold.value) {
    parts.push(`background-color: ${activeThreshold.value.color}`)
  } else if (isGradientList(props.color)) {
    parts.push(`background-image: linear-gradient(90deg, ${props.color.join(', ')})`)
  } else if (typeof props.color === 'string' && props.color) {
    parts.push(`background-color: ${props.color}`)
  } else if (isZeroInnerLabel) {
    // 0% + inner label: a zero-width fill would clip the label, so the fill
    // keeps a tinted minimum (mirrors --wot-progress-inner-zero-bg).
    parts.push('background-color: var(--sn-mp-color-background-soft)')
  } else {
    // Default fill: the primary accent (mirrors --wot-progress-color).
    parts.push('background-color: var(--sn-mp-color-action-primary)')
  }

  // `duration` is "ms per 1%" — the whole transition is percentage × that.
  const ms = Math.max(0, (Number(props.duration) || 0) * clampedPercentage.value)
  parts.push(`transition-duration: ${ms}ms`)

  return parts.join('; ')
})

const rootClass = computed(() => [
  'sn-progress',
  `sn-progress--label-${labelType.value}`,
  `sn-progress--align-${labelAlign.value}`,
  {
    'sn-progress--hide-text': props.hideText,
    'sn-progress--zero': clampedPercentage.value === 0,
  },
  props.customClass,
])

const rootStyle = computed(() => (props.customStyle ? props.customStyle : undefined))
</script>

<template>
  <view
    data-snui-component="progress"
    :class="rootClass"
    :style="rootStyle"
    role="progressbar"
    :aria-valuenow="clampedPercentage"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-label="labelText"
  >
    <view class="sn-progress__bar">
      <view class="sn-progress__fill" :style="fillStyle">
        <text
          v-if="!hideText && labelType === 'inner'"
          class="sn-progress__label sn-progress__label--inner"
        >{{ labelText }}</text>
      </view>
    </view>

    <text
      v-if="!hideText && labelType === 'outer'"
      class="sn-progress__label sn-progress__label--outer"
    >{{ labelText }}</text>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

/* Fill / track colors come straight from the semantic color tokens, so dark
 * mode flips them with the rest of the palette (CONTRIBUTING §6). */
.sn-progress {
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.sn-progress__bar {
  position: relative;
  flex: 1 1 auto;
  /* Outer-label mode: thin rail. Inner-label mode: taller track so the text
   * fits inside the fill (mirrors wd-progress --wot-progress-height). */
  height: 16rpx;
  overflow: hidden;
  /* Track color — tinted surface, dark-mode aware. */
  background-color: var(--sn-mp-color-background-subtle);
  border-radius: var(--sn-mp-radius-full);
}

.sn-progress--label-inner .sn-progress__bar {
  height: 40rpx;
}

.sn-progress__fill {
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  min-width: 0;
  border-radius: var(--sn-mp-radius-full);
  transition-property: width, background-color;
  transition-timing-function: ease;
}

.sn-progress__label {
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
  white-space: nowrap;
}

.sn-progress__label--outer {
  flex: 0 0 auto;
  margin-left: var(--sn-mp-spacing-3);
  min-width: 64rpx;
  color: var(--sn-mp-color-text-secondary);
}

.sn-progress--align-left .sn-progress__label--outer {
  text-align: left;
}
.sn-progress--align-center .sn-progress__label--outer {
  text-align: center;
}
.sn-progress--align-right .sn-progress__label--outer {
  text-align: right;
}

.sn-progress__label--inner {
  padding: 0 var(--sn-mp-spacing-3);
  /* On-fill label — white in both themes because the fill does not invert. */
  color: var(--sn-mp-color-text-on-primary);
}

/* Zero state inside the bar: a 0%-wide fill would clip the label, so the fill
 * keeps a minimum width on the tinted surface and the text switches to
 * secondary (mirrors --wot-progress-inner-zero-bg / -color). */
.sn-progress--zero .sn-progress__fill {
  min-width: 72rpx;
}
.sn-progress--zero .sn-progress__label--inner {
  color: var(--sn-mp-color-text-secondary);
}

/* Doodle skin — squared-off rail + dashed outline. */
.snui-skin-doodle .sn-progress__bar,
.snui-skin-doodle .sn-progress__fill {
  border-radius: var(--sn-mp-radius-xs);
}
</style>
