<script setup lang="ts">
/**
 * sn-count-to (uni-end) — animated number roll-up for mobile / miniprogram.
 *
 * Reference library: wot-ui `wd-count-to`
 *   (https://wot-ui.cn/component/count-to.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-count-to 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-count-to/sn-count-to.vue
 * → auto-registered as `<sn-count-to>` in any .vue that uses it.
 *
 * ## Animation (AGENTS.md §41)
 *
 * `requestAnimationFrame` is not guaranteed on every miniprogram target, so the
 * tween runs on one `setInterval` at ~60fps (16ms). The interval is cleared on
 * `finish`, on `startVal` / `endVal` changes, on manual `pause`, and in
 * `onBeforeUnmount`.
 *
 * Easing mirrors the reference: `useEasing` applies a cubic ease-out
 * (`1 - (1 - t)^3`); `false` runs linear.
 *
 * Per AGENTS.md §32, this component handles rendering + timing only.
 *
 * Not responsible for:
 *   - 倒计时（时间递减）— 用 sn-count-down
 *   - 进度条 — 用 sn-progress / sn-circle
 */

import { computed, onBeforeUnmount, ref, watch } from 'vue';

defineOptions({ name: 'SnCountTo' });

/** Text theme. Mirrors `wd-count-to` `type`. */
type CountToType = 'default' | 'primary' | 'success' | 'warning' | 'error';

/** Frame interval in ms — ~60fps, safe on every uni target. */
const FRAME_MS = 16;

const props = withDefaults(
  defineProps<{
    /** Text color override (any CSS color value). */
    color?: string;
    /** Semantic text theme; `default` uses the body text token. */
    type?: CountToType;
    /** Start value. */
    startVal?: number;
    /** End value. */
    endVal?: number;
    /** Tween duration in ms. */
    duration?: number;
    /** Start the animation on mount / on value change. */
    autoStart?: boolean;
    /** Decimal places to keep (>= 0). */
    decimals?: number;
    /** Decimal separator character. */
    decimal?: string;
    /** Thousands separator character. */
    separator?: string;
    /** Text before the number. */
    prefix?: string;
    /** Text after the number. */
    suffix?: string;
    /** Use cubic ease-out instead of a linear ramp. */
    useEasing?: boolean;
    /** Custom class for the root node. */
    customClass?: string;
    /** Custom inline style for the root node. */
    customStyle?: string;
  }>(),
  {
    color: '',
    type: 'default',
    startVal: 0,
    endVal: 2024,
    duration: 3000,
    autoStart: true,
    decimals: 0,
    decimal: '.',
    separator: ',',
    prefix: '',
    suffix: '',
    useEasing: true,
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  (e: 'mounted'): void;
  (e: 'finish'): void;
}>();

/** Currently displayed value. */
const current = ref(props.startVal);
/** Interval handle (the only disposable resource, §41). */
let timer: ReturnType<typeof setInterval> | null = null;
/** Animation start timestamp. */
let startedAt = 0;

function clearTimer(): void {
  if (timer !== null) {
    clearInterval(timer);
    timer = null;
  }
}

/** Cubic ease-out — mirrors the reference's `useEasing` curve. */
function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

/** Format the displayed value with separators and the configured decimals. */
const displayValue = computed(() => {
  const fixed = current.value.toFixed(Math.max(0, Math.round(props.decimals)));
  const [integerPart = '0', fractionPart] = fixed.split('.');
  const withSeparator = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, props.separator);
  return fractionPart ? `${withSeparator}${props.decimal}${fractionPart}` : withSeparator;
});

/** Full rendered text: prefix + number + suffix. */
const displayText = computed(() => `${props.prefix}${displayValue.value}${props.suffix}`);

function step(): void {
  const now = Date.now();
  const elapsed = now - startedAt;
  const progress = props.duration <= 0 ? 1 : Math.min(1, elapsed / props.duration);
  const eased = props.useEasing ? easeOutCubic(progress) : progress;
  const from = props.startVal;
  const to = props.endVal;
  current.value = from + (to - from) * eased;

  if (progress >= 1) {
    current.value = to;
    clearTimer();
    emit('finish');
  }
}

/** Start (or restart) the tween from the current value. */
function start(): void {
  clearTimer();
  if (props.duration <= 0 || props.startVal === props.endVal) {
    current.value = props.endVal;
    emit('finish');
    return;
  }
  startedAt = Date.now();
  timer = setInterval(step, FRAME_MS);
}

/** Pause the tween at the current value. */
function pause(): void {
  clearTimer();
}

/** Reset to `startVal` without animating. */
function reset(): void {
  clearTimer();
  current.value = props.startVal;
}

watch(
  () => [props.startVal, props.endVal, props.duration],
  () => {
    current.value = props.startVal;
    if (props.autoStart) start();
    else clearTimer();
  },
  { immediate: true },
);

onBeforeUnmount(clearTimer);

defineExpose({ start, pause, reset });

const rootClass = computed(() => ['sn-count-to', `sn-count-to--${props.type}`, props.customClass]);

const rootStyle = computed(() => {
  const parts: string[] = [];
  if (props.color) parts.push(`color: ${props.color}`);
  if (props.customStyle) parts.push(props.customStyle);
  return parts.length > 0 ? parts.join('; ') : undefined;
});
</script>

<template>
  <view
    data-snui-component="count-to"
    :class="rootClass"
    :style="rootStyle"
    role="status"
    aria-live="polite"
    :aria-label="displayText"
  >
    <text class="sn-count-to__text">{{ displayText }}</text>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-count-to {
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
}

.sn-count-to__text {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-md);
  line-height: var(--sn-mp-font-line-height-normal);
  font-variant-numeric: tabular-nums;
}

.sn-count-to--primary .sn-count-to__text {
  color: var(--sn-mp-color-action-primary);
}
.sn-count-to--success .sn-count-to__text {
  color: var(--sn-mp-color-feedback-success);
}
.sn-count-to--warning .sn-count-to__text {
  color: var(--sn-mp-color-feedback-warning);
}
.sn-count-to--error .sn-count-to__text {
  color: var(--sn-mp-color-feedback-danger);
}
</style>
