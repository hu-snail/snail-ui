<script setup lang="ts">
/**
 * SnNumberAnimation — web-end animated number (AUI-WEB-DD-014).
 *
 * Reference library: naive-ui `n-number-animation`
 *   (https://www.naiveui.com/zh-CN/light/components/number-animation)
 * Per AGENTS.md §112, props + semantics mirror n-number-animation 1:1:
 *   from (0) / to (0) / precision (0) / showSeparator (false) / locale /
 *   active (true) / duration (2000) / on-finish → emit('finish') /
 *   play() exposed method. The animation is an ease-out quint tween
 *   driven by requestAnimationFrame + performance.now, restarting whenever
 *   `active` becomes truthy or from/to change (same watchEffect shape as
 *   the reference).
 *
 * Documented divergences (not §112 violations):
 *   - Default `duration` is 2000, matching the reference *source*
 *     (src/number-animation/src/NumberAnimation.tsx); the docs page still
 *     says 3000 — source wins per AGENTS.md §112.
 *   - `locale` accepts a BCP-47 string; without a config-provider the
 *     default is the runtime locale (naive falls back to its provider
 *     locale). Grouping / decimal separators come from Intl.NumberFormat.
 *   - The naive component renders a bare text fragment; we render a neutral
 *     inline `<span class="sn-number-animation">` wrapper carrying
 *     `font-variant-numeric: tabular-nums` (web-end component convention).
 *   - Concurrency / lifecycle guard: starting a new tween supersedes any
 *     pending one, and pending frames are cancelled on unmount (naive keeps
 *     the rAF loop alive after unmount). Observable behaviour is unchanged
 *     for the single-animation usage the reference supports.
 *   - `round` is a local helper (no lodash dependency in this package).
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnNumberAnimation :from="0" :to="12039" />
 *   <SnNumberAnimation show-separator :to="100000000" :active="false" ref="anim" />
 *   anim.value?.play()
 */

import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue';

defineOptions({ name: 'SnNumberAnimation' });

const props = withDefaults(
  defineProps<{
    /** Target value; the animation runs from `from` towards `to`. Mirrors n-number-animation `to`. */
    to?: number;
    /** Digits kept after the decimal point. Mirrors n-number-animation `precision`. */
    precision?: number;
    /** Format the integer part with locale thousands separators. Mirrors n-number-animation `showSeparator`. */
    showSeparator?: boolean;
    /** BCP-47 locale for Intl.NumberFormat (separators + decimal mark). Mirrors n-number-animation `locale`. */
    locale?: string | undefined;
    /** Start value. Mirrors n-number-animation `from`. */
    from?: number;
    /** Start / restart the animation. Mirrors n-number-animation `active`. */
    active?: boolean;
    /** Animation duration in ms (non-reactive, captured at setup). Mirrors n-number-animation `duration`. */
    duration?: number;
  }>(),
  {
    to: 0,
    precision: 0,
    showSeparator: false,
    locale: undefined,
    from: 0,
    active: true,
    duration: 2000,
  },
);

const emit = defineEmits<{
  /** Animation reached `to`. Mirrors n-number-animation `onFinish`. */
  (e: 'finish'): void;
}>();

/** Non-reactive by design — the reference destructures duration at setup. */
const { duration } = props;

const displayedValue = ref(props.from);
let animating = false;
/**
 * Tween epoch: incremented to supersede pending rAF chains (new animation
 * or unmount). Each tick checks it own epoch before continuing.
 */
let tweenEpoch = 0;

/** Local `round(value, precision)` — lodash-es is not a dependency here. */
function roundTo(value: number, precision: number): number {
  const factor = 10 ** precision;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/** Same easing curve as the reference utils.ts: easeOutQuint. */
function easeOut(t: number): number {
  return 1 - (1 - t) ** 5;
}

function tween(
  from: number,
  to: number,
  durationMs: number,
  onUpdate: (value: number) => void,
  onFinish: () => void,
): void {
  const startTime = performance.now();
  const epoch = ++tweenEpoch;
  const tick = (): void => {
    if (epoch !== tweenEpoch) return;
    const current = performance.now();
    const elapsedTime = Math.min(current - startTime, durationMs);
    const currentValue = from + (to - from) * easeOut(elapsedTime / durationMs);
    if (elapsedTime === durationMs) {
      onFinish();
      return;
    }
    onUpdate(currentValue);
    requestAnimationFrame(tick);
  };
  tick();
}

function handleUpdate(currentValue: number): void {
  displayedValue.value = currentValue;
}

function handleFinish(): void {
  displayedValue.value = props.to;
  animating = false;
  emit('finish');
}

function animate(from: number = props.from, to: number = props.to): void {
  animating = true;
  displayedValue.value = props.from;
  if (from !== to) {
    tween(from, to, duration, handleUpdate, handleFinish);
  }
}

/** Replay the animation; ignored while one is already running. Mirrors the `play` instance method. */
function play(): void {
  if (animating) return;
  animate();
}

onMounted(() => {
  watchEffect(() => {
    if (props.active) animate();
  });
});

onBeforeUnmount(() => {
  // Cancel any pending rAF chain (the reference leaves it running).
  tweenEpoch++;
});

defineExpose({ play });

/**
 * Formatter cache — Intl.NumberFormat construction is too expensive to
 * repeat on every animation frame; behaviour is identical to constructing
 * per call.
 */
const formatterCache = new Map<string, Intl.NumberFormat>();

function getNumberFormatter(locale: string | undefined): Intl.NumberFormat {
  const key = locale ?? '';
  let formatter = formatterCache.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(key === '' ? undefined : key);
    formatterCache.set(key, formatter);
  }
  return formatter;
}

const formattedValue = computed<{
  integer: string;
  decimal: string | undefined;
  decimalSeparator: string | undefined;
}>(() => {
  const formatted: string = roundTo(displayedValue.value, props.precision).toFixed(props.precision);
  const splitValue = formatted.split('.');
  const formatter = getNumberFormatter(props.locale);
  const decimalSeparator = formatter
    .formatToParts(0.5)
    .find((part) => part.type === 'decimal')?.value;
  const integer = props.showSeparator
    ? formatter.format(Number(splitValue[0]))
    : (splitValue[0] ?? '0');
  const decimal = splitValue[1];
  return { integer, decimal, decimalSeparator };
});
</script>

<template>
  <span data-snui-component="number-animation" class="sn-number-animation"
    >{{ formattedValue.integer }}{{ formattedValue.decimal ? formattedValue.decimalSeparator : ''
    }}{{ formattedValue.decimal ?? '' }}</span
  >
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

/* The reference renders bare text with no cssr; the wrapper only fixes the
 * numeral width so the rolling value does not jitter. */
.sn-number-animation {
  font-variant-numeric: tabular-nums;
}
</style>
