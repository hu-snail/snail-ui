<script setup lang="ts">
/**
 * sn-count-down (uni-end) — countdown timer for mobile / miniprogram.
 *
 * Reference library: wot-ui `wd-count-down`
 *   (https://wot-ui.cn/component/count-down.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-count-down 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-count-down/sn-count-down.vue
 * → auto-registered as `<sn-count-down>` in any .vue that uses it.
 *
 * ## Format tokens (mirrors wd-count-down)
 *
 *   DD  days (no padding)      DDD  days, 3-digit padded
 *   HH  hours (padded)         mm   minutes (padded)
 *   ss  seconds (padded)       S    milliseconds (padded to 3 digits)
 *
 * ## Dispose (AGENTS.md §41)
 *
 * One `setInterval` is the only resource. It is cleared on `finish`, on
 * `reset`-equivalent prop changes, and in `onBeforeUnmount`. The exposed
 * `start` / `pause` / `reset` methods are the uni-side stand-in for the
 * reference's imperative calls on the component instance.
 *
 * Per AGENTS.md §32, this component handles rendering + timing only. It owns no
 * business deadline: pass `time` in milliseconds.
 *
 * Not responsible for:
 *   - 数字滚动动画 — 用 sn-count-to
 *   - 定时业务任务 — 由宿主 action 负责
 */

import { computed, onBeforeUnmount, ref, watch } from 'vue'

defineOptions({ name: 'SnCountDown' })

/** Time breakdown passed to the `change` event. */
export interface SnCountDownTimeData {
  /** Remaining total milliseconds. */
  total: number
  /** Whole days. */
  days: number
  /** Hours within the current day (0–23). */
  hours: number
  /** Minutes within the current hour (0–59). */
  minutes: number
  /** Seconds within the current minute (0–59). */
  seconds: number
  /** Milliseconds within the current second (0–999). */
  milliseconds: number
}

const props = withDefaults(
  defineProps<{
    /** Countdown length in milliseconds. */
    time?: number
    /** Render milliseconds too (ticks every frame-ish 16ms instead of 1s). */
    millisecond?: boolean
    /** Format string; tokens are `DD` / `DDD` / `HH` / `mm` / `ss` / `S`. */
    format?: string
    /** Start automatically on mount and after `time` changes. */
    autoStart?: boolean
    /** Custom class for the root node. */
    customClass?: string
    /** Custom inline style for the root node. */
    customStyle?: string
  }>(),
  {
    time: 0,
    millisecond: false,
    format: 'HH:mm:ss',
    autoStart: true,
    customClass: '',
    customStyle: '',
  },
)

defineSlots<{
  /** Custom rendering — receives the same payload as `change`. */
  default?(props: SnCountDownTimeData): unknown
}>()

const emit = defineEmits<{
  (e: 'change', current: SnCountDownTimeData): void
  (e: 'finish'): void
}>()

/** Remaining milliseconds. */
const remaining = ref(Math.max(0, props.time))
/** Interval handle (the only disposable resource, §41). */
let timer: ReturnType<typeof setInterval> | null = null
/** Wall-clock stamp of the last tick, so a throttled tab still counts down. */
let lastTick = 0

function clearTimer(): void {
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
}

/** Split remaining milliseconds into the reference's time parts. */
function toTimeData(total: number): SnCountDownTimeData {
  const clamped = Math.max(0, total)
  return {
    total: clamped,
    days: Math.floor(clamped / 86_400_000),
    hours: Math.floor(clamped / 3_600_000) % 24,
    minutes: Math.floor(clamped / 60_000) % 60,
    seconds: Math.floor(clamped / 1000) % 60,
    milliseconds: Math.floor(clamped % 1000),
  }
}

const timeData = computed(() => toTimeData(remaining.value))

/** Zero-pad a number to `length` digits. */
function pad(value: number, length: number): string {
  return String(value).padStart(length, '0')
}

/** Render the `format` string from the current time parts. */
const formatted = computed(() => {
  const data = timeData.value
  const tokens: Record<string, string> = {
    DDD: pad(data.days, 3),
    DD: String(data.days),
    HH: pad(data.hours, 2),
    mm: pad(data.minutes, 2),
    ss: pad(data.seconds, 2),
    S: pad(data.milliseconds, 3),
  }
  // Longest tokens first so `DDD` is not eaten by `DD`.
  return props.format.replace(/DDD|DD|HH|mm|ss|S/g, (token) => tokens[token] ?? token)
})

function tick(): void {
  const now = Date.now()
  const elapsed = now - lastTick
  lastTick = now
  remaining.value = Math.max(0, remaining.value - elapsed)
  emit('change', timeData.value)
  if (remaining.value === 0) {
    clearTimer()
    emit('finish')
  }
}

/** Start (or resume) the countdown. */
function start(): void {
  clearTimer()
  if (remaining.value <= 0) return
  lastTick = Date.now()
  timer = setInterval(tick, props.millisecond ? 16 : 1000)
}

/** Pause the countdown, keeping the remaining time. */
function pause(): void {
  clearTimer()
}

/** Reset to the full `time` and restart when `autoStart` is on. */
function reset(): void {
  clearTimer()
  remaining.value = Math.max(0, props.time)
  if (props.autoStart) start()
}

watch(
  () => [props.time, props.millisecond],
  () => {
    reset()
  },
  { immediate: true },
)

onBeforeUnmount(clearTimer)

defineExpose({ start, pause, reset })

const rootClass = computed(() => ['sn-count-down', props.customClass])
const rootStyle = computed(() => (props.customStyle ? props.customStyle : undefined))
</script>

<template>
  <view
    data-snui-component="count-down"
    :class="rootClass"
    :style="rootStyle"
    role="timer"
    :aria-label="formatted"
  >
    <slot :total="timeData.total" :days="timeData.days" :hours="timeData.hours"
          :minutes="timeData.minutes" :seconds="timeData.seconds"
          :milliseconds="timeData.milliseconds">
      <text class="sn-count-down__text">{{ formatted }}</text>
    </slot>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-count-down {
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
}

.sn-count-down__text {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-md);
  line-height: var(--sn-mp-font-line-height-normal);
  font-variant-numeric: tabular-nums;
}
</style>
