<script setup lang="ts">
/**
 * SnCountdown — web-end countdown (AUI-WEB-DD-003).
 *
 * Reference library: naive-ui `n-countdown`
 *   (https://www.naiveui.com/zh-CN/light/components/countdown)
 * Per AGENTS.md §112, props + semantics mirror n-countdown 1:1:
 *   duration (0, ms) / active (true) / precision (0 | 1 | 2 | 3, 0) /
 *   render (timeInfo => VNodeChild) / on-finish → emit('finish') /
 *   reset() exposed method. `duration` is non-reactive, the displayed
 *   value rounds up inside the current precision step (the reference adds
 *   +999/+99/+9 ms before splitting), and `finish` fires exactly once.
 *
 * Documented divergences (not §112 violations):
 *   - The naive component renders a bare text fragment; we render a
 *     neutral inline `<span class="sn-countdown">` wrapper (web-end
 *     component convention, no visual effect).
 *   - Timers use bare `setTimeout` / `clearTimeout` instead of
 *     `window.setTimeout` — identical in browsers, and fake-timer
 *     friendly in tests. Frame delays are clamped to >= 1 ms (browsers
 *     clamp setTimeout(0) to ~1 ms anyway), which keeps the timer chain
 *     strictly time-moving and deterministic under fake timers.
 *   - No config-provider / locale integration (not applicable — output
 *     is numeric text).
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnCountdown :duration="5000" :active="active" />
 *   <SnCountdown :duration="3600000" :precision="1" />
 *   <SnCountdown :duration="996000" :render="renderCountdown" ref="countdown" />
 *   countdown.value?.reset()
 */

import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watchEffect,
  type VNodeChild,
} from 'vue'

defineOptions({ name: 'SnCountdown' })

/** Shape passed to the `render` prop (mirrors naive CountdownTimeInfo). */
interface CountdownTimeInfo {
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
}

const props = withDefaults(
  defineProps<{
    /** Countdown length in ms (non-reactive). Mirrors n-countdown `duration`. */
    duration?: number
    /** Whether the countdown is ticking. Mirrors n-countdown `active`. */
    active?: boolean
    /** Displayed precision: 0 = seconds, 1-3 add decimal digits. Mirrors n-countdown `precision`. */
    precision?: 0 | 1 | 2 | 3
    /** Custom render for the remaining time info. Mirrors n-countdown `render`. */
    render?: ((info: CountdownTimeInfo) => VNodeChild) | undefined
  }>(),
  {
    duration: 0,
    active: true,
    precision: 0,
    render: undefined,
  },
)

const emit = defineEmits<{
  /** Countdown reached zero. Mirrors n-countdown `onFinish`. */
  (e: 'finish'): void
}>()

const distance = ref(0)

// Mirrors the reference: the running distance is re-seeded from
// `props.duration` (duration itself stays non-reactive for elapsed/pnow).
watchEffect(() => {
  distance.value = props.duration
})

let timerId: ReturnType<typeof setTimeout> | null = null
let pnow = -1
let elapsed = 0
let finished = false

function getDistance(time: number): number {
  return props.duration - elapsed + pnow - time
}

function getTimeInfo(ms: number): CountdownTimeInfo {
  return {
    hours: Math.floor(ms / 3600000),
    minutes: Math.floor((ms % 3600000) / 60000),
    seconds: Math.floor((ms % 60000) / 1000),
    milliseconds: Math.floor(ms % 1000),
  }
}

function pad2(value: number): string {
  return String(value).padStart(2, '0')
}

function getDisplayValue(info: CountdownTimeInfo): string {
  const { hours, minutes, seconds, milliseconds } = info
  const { precision } = props
  if (precision === 0) {
    return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`
  }
  const divisor = precision === 1 ? 100 : precision === 2 ? 10 : 1
  const fraction = String(Math.floor(milliseconds / divisor)).padStart(precision, '0')
  return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}.${fraction}`
}

function stopTimer(): void {
  if (timerId !== null) {
    clearTimeout(timerId)
    timerId = null
  }
}

function frame(): void {
  const { precision } = props
  const remaining = getDistance(performance.now())
  if (remaining <= 0) {
    distance.value = 0
    stopTimer()
    if (!finished) {
      finished = true
      emit('finish')
    }
    return
  }
  let leftTime: number
  switch (precision) {
    case 3:
    case 2:
      leftTime = remaining % 34 // about 30 fps
      break
    case 1:
      leftTime = remaining % 100
      break
    default:
      leftTime = remaining % 1000
  }
  distance.value = remaining
  // Browsers clamp setTimeout(0) to ~1 ms; clamping here keeps the frame
  // chain strictly time-moving (and deterministic under fake timers).
  const delay = Math.max(leftTime, 1)
  timerId = setTimeout(() => {
    frame()
  }, delay)
}

onMounted(() => {
  watchEffect(() => {
    if (props.active) {
      pnow = performance.now()
      frame()
    } else {
      const now = performance.now()
      if (pnow !== -1) {
        elapsed += now - pnow
      }
      stopTimer()
    }
  })
})

onBeforeUnmount(() => {
  stopTimer()
})

/** Reset the countdown to its full duration. Mirrors the `reset` instance method. */
function reset(): void {
  distance.value = props.duration
  elapsed = 0
  pnow = performance.now()
  if (props.active && finished) {
    frame()
  }
  finished = false
}

defineExpose({ reset })

/**
 * Displayed time info — the reference rounds up within the current
 * precision step before formatting (distance + 999 / +99 / +9 ms), so a
 * second-second countdown still shows "1" until it truly reaches zero.
 */
const displayInfo = computed<CountdownTimeInfo>(() => {
  const remaining = distance.value
  switch (props.precision) {
    case 1: {
      const info = getTimeInfo(remaining + 99)
      info.milliseconds = Math.floor(info.milliseconds / 100) * 100
      return info
    }
    case 2: {
      const info = getTimeInfo(remaining + 9)
      info.milliseconds = Math.floor(info.milliseconds / 10) * 10
      return info
    }
    case 3:
      return getTimeInfo(remaining)
    default: {
      const info = getTimeInfo(remaining + 999)
      info.milliseconds = 0
      return info
    }
  }
})

const displayText = computed<string>(() => getDisplayValue(displayInfo.value))

const renderedVnode = computed<VNodeChild>(() =>
  props.render ? props.render(displayInfo.value) : '',
)

/** Functional passthrough so a `render` prop returning a VNodeChild (string or vnode) can be mounted from the template. */
const RenderVnode = (renderProps: { node: VNodeChild }): VNodeChild => renderProps.node
</script>

<template>
  <span data-snui-component="countdown" class="sn-countdown">
    <RenderVnode v-if="render" :node="renderedVnode" />
    <template v-else>{{ displayText }}</template>
  </span>
</template>
