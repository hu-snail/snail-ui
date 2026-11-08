<script setup lang="ts">
/**
 * sn-slider-bar — capsule / bar slider (uni end).
 *
 * Mirrors the web `SnSliderBar`: a capsule track with a themed fill, a slim
 * thumb, an optional inline read-out, an aurora theme (gradient + drifting
 * stars) and a column variant. Same behaviour as `sn-slider` (drag / tap,
 * step snapping, non-crossing dual knobs).
 *
 * uni notes: no DOM, so the track length is measured once through
 * `createSelectorQuery`; the fill / knob maths use rpx-friendly percentages
 * and the measured px. Animations stay CSS-only (no JS timers) so they run on
 * the render layer of both H5 and mini-program.
 */

import { computed, getCurrentInstance, onMounted, ref, watch } from 'vue';
import type {
  SliderValue,
  SliderLevel,
  SliderBarVariant,
  SliderBarTheme,
  SliderBarFormat,
  SliderBarSize,
} from './sn-slider-bar-types';

defineOptions({ name: 'SnSliderBar' });

const props = withDefaults(
  defineProps<{
    /** Current value — `number`, or `[start, end]` in `range` mode. */
    modelValue?: SliderValue;
    /** Lower bound. */
    min?: number;
    /** Upper bound. */
    max?: number;
    /** Snap granularity. */
    step?: number;
    /** Two-knob mode. */
    range?: boolean;
    /** Disables dragging. */
    disabled?: boolean;
    /** Visible but not editable. */
    readonly?: boolean;
    /** Invert the axis. */
    reverse?: boolean;
    /** `bar` horizontal capsule / `column` vertical strip. */
    variant?: SliderBarVariant;
    /** Visual theme. */
    theme?: SliderBarTheme;
    /** Show the read-out beside (bar) or above (column) the track. */
    showValue?: boolean;
    /** Read-out source. */
    format?: SliderBarFormat;
    /** Suffix appended to the default read-out. */
    valueSuffix?: string;
    /** Full custom read-out text. */
    formatValue?: (value: number, percent: number) => string;
    /** Discrete levels; the read-out shows the nearest level label. */
    levels?: SliderLevel[];
    /** Draw a tick per level. */
    showLevels?: boolean;
    /** Size tier. */
    size?: SliderBarSize;
    /** Explicit control height (rpx number or CSS length). */
    barHeight?: string | number;
    /** Alias of `barHeight`. */
    height?: string | number;
    /** Track thickness (rpx number or CSS length). */
    thickness?: string | number;
    /** Corner radius (CSS length). */
    radius?: string;
    /** Caption text painted inside the track at the leading edge. */
    label?: string;
    /** Caption text painted inside the track at the trailing edge. */
    suffix?: string;
    /** Custom fill background (ignored by the aurora theme). */
    fillBackground?: string;
    /** Aurora gradient. */
    gradient?: string;
    /** Aurora star-field density (0 = off). */
    sparkles?: number;
    /** Disable the aurora drift / twinkle animation. */
    animated?: boolean;
    /** In-track text / glyph colour while the bar has a value. */
    innerColor?: string;
    /** In-track text / glyph colour at value 0. */
    innerColorEmpty?: string;
    /** Column: fade the empty part upwards. */
    fade?: boolean;
    /** Column: read the value from the popover only. */
    tooltipOnly?: boolean;
    /** Accessible name. */
    ariaLabel?: string;
    /** Class on the root node. */
    customClass?: string;
    /** Inline style on the root node. */
    customStyle?: string;
  }>(),
  {
    modelValue: 0,
    min: 0,
    max: 100,
    step: 1,
    range: false,
    disabled: false,
    readonly: false,
    reverse: false,
    variant: 'bar',
    theme: 'default',
    showValue: false,
    format: 'percent',
    valueSuffix: '%',
    showLevels: true,
    size: 'medium',
    label: '',
    suffix: '',
    fillBackground: '',
    gradient: '',
    sparkles: 14,
    animated: true,
    innerColor: '',
    innerColorEmpty: '',
    fade: true,
    tooltipOnly: false,
    ariaLabel: '',
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: SliderValue): void;
  (e: 'change', value: SliderValue): void;
}>();

/* ── size scale ─────────────────────────────────────────────────────────── */

const SIZE_THICKNESS: Record<string, number> = { small: 56, medium: 80, large: 104 };

const thicknessRpx = computed(() => {
  if (props.thickness !== undefined) {
    return typeof props.thickness === 'number'
      ? props.thickness
      : parseFloat(String(props.thickness));
  }
  return SIZE_THICKNESS[props.size ?? 'medium'] ?? 80;
});

/** Knob size matches the track thickness (the reference disc). */
const knobRpx = computed(() => thicknessRpx.value);

const isColumn = computed(() => props.variant === 'column');
const isAurora = computed(() => props.theme === 'aurora');
const isInteractive = computed(() => !props.disabled && !props.readonly);

/* ── value normalisation ────────────────────────────────────────────────── */

const span = computed(() => props.max - props.min);

function clamp(v: number): number {
  return Math.min(props.max, Math.max(props.min, v));
}

function snap(v: number): number {
  const stepped = props.min + Math.round((v - props.min) / props.step) * props.step;
  return clamp(Number(stepped.toFixed(10)));
}

const localValue = ref<SliderValue>(
  props.modelValue ?? (props.range ? [props.min, props.max] : props.min),
);

const pair = computed<[number, number]>(() => {
  const raw = props.modelValue ?? localValue.value;
  if (props.range) {
    if (Array.isArray(raw)) return [clamp(Number(raw[0])), clamp(Number(raw[1]))];
    return [props.min, clamp(Number(raw))];
  }
  const single = clamp(Array.isArray(raw) ? Number(raw[0]) : Number(raw));
  return [single, single];
});

const modelIsArray = computed(() => props.range || Array.isArray(props.modelValue));

function buildValue(low: number, high: number): SliderValue {
  return modelIsArray.value ? [low, high] : low;
}

function emitValue(low: number, high: number, commit: boolean): void {
  const next = buildValue(low, high);
  localValue.value = next;
  emit('update:modelValue', next);
  if (commit) emit('change', next);
}

/* ── geometry (percent of the axis) ─────────────────────────────────────── */

function percentOf(value: number): number {
  const p = span.value === 0 ? 0 : ((value - props.min) / span.value) * 100;
  return props.reverse ? 100 - p : p;
}

const fillPercent = computed(() => {
  const low = percentOf(pair.value[0]);
  const high = percentOf(pair.value[1]);
  return props.range ? Math.abs(high - low) : Math.abs(high);
});

/** A bar with no value: the in-track text switches to the "empty" colour. */
const isEmpty = computed(() => fillPercent.value <= 0);

/** Fill band, in % of the track (range = between the knobs). */
const fillBand = computed(() => {
  const low = percentOf(pair.value[0]);
  const high = percentOf(pair.value[1]);
  const start = props.range ? Math.min(low, high) : 0;
  const size = props.range ? Math.abs(high - low) : Math.abs(high);
  return { start, size };
});

const fillStyle = computed(() => {
  const { start, size } = fillBand.value;
  const base = isColumn.value
    ? `bottom:${start}%;height:${size}%;`
    : `left:${start}%;width:${size}%;`;
  const bg = isAurora.value
    ? `background:${props.gradient || 'linear-gradient(90deg,#5b7cfa,#8b5cf6)'};`
    : props.fillBackground
      ? `background:${props.fillBackground};`
      : '';
  return `${base}${bg}${size <= 0 ? 'opacity:0;' : ''}`;
});

const knobStyle = computed(() => {
  const low = percentOf(pair.value[0]);
  const high = percentOf(pair.value[1]);
  const positions = props.range ? [low, high] : [high];
  return positions.map((p) => (isColumn.value ? `bottom:${p}%;left:50%;` : `left:${p}%;top:50%;`));
});

/** Ticks for `showLevels`. */
const levelTicks = computed(() => {
  if (!props.showLevels || !props.levels?.length) return [];
  return props.levels.map((l) => ({ ...l, pct: percentOf(l.value) }));
});

/** Nearest level for the current value. */
const activeLevel = computed<SliderLevel | null>(() => {
  const levels = props.levels;
  if (!levels || levels.length === 0) return null;
  const value = pair.value[1];
  let best = levels[0] as SliderLevel;
  let bestDist = Math.abs(best.value - value);
  for (const level of levels) {
    const dist = Math.abs(level.value - value);
    if (dist < bestDist - 1e-9 || (Math.abs(dist - bestDist) <= 1e-9 && level.value > best.value)) {
      best = level;
      bestDist = dist;
    }
  }
  return best;
});

/* ── caption ────────────────────────────────────────────────────────────── */

const captionText = computed(() => {
  const value = pair.value[1];
  if (activeLevel.value) return activeLevel.value.label;
  if (props.formatValue) return props.formatValue(value, fillPercent.value);
  return props.format === 'value'
    ? `${value}${props.valueSuffix}`
    : `${Math.round(fillPercent.value)}${props.valueSuffix}`;
});

const captionVisible = computed(() => props.showValue || props.tooltipOnly);

/* ── pointer interaction ────────────────────────────────────────────────── */

/** Track length in px (measured once — uni has no ResizeObserver). */
const trackPx = ref(0);
const trackId = 'sn-slider-bar-track';

function measureTrack(): void {
  const instance = getCurrentInstance();
  const query = uni.createSelectorQuery().in(instance ? instance.proxy : undefined);
  query
    .select(`#${trackId}`)
    .boundingClientRect((rect: { width?: number; height?: number } | null) => {
      if (!rect) return;
      trackPx.value = isColumn.value ? (rect.height ?? 0) : (rect.width ?? 0);
    })
    .exec();
}

onMounted(() => {
  measureTrack();
});

watch(
  () => props.variant,
  () => {
    setTimeout(measureTrack, 0);
  },
);

const draggingIndex = ref<number | null>(null);

/** Coordinates carried by a uni tap / touch event (H5 and MP differ). */
type UniTouchEvent = {
  // DOM TouchEvent.detail is a number, uni's is an {x,y} object — accept both.
  detail?: { x?: number; y?: number } | number;
  // DOM hands back a TouchList, uni an array — accept any indexable list.
  touches?: ArrayLike<{ clientX?: number; clientY?: number }>;
  changedTouches?: ArrayLike<{ clientX?: number; clientY?: number }>;
};

function onTrackTap(e: UniTouchEvent): void {
  if (!isInteractive.value) return;
  const touch = e.touches?.[0] ?? e.changedTouches?.[0];
  const detail = typeof e.detail === 'object' ? e.detail : undefined;
  const x = touch?.clientX ?? detail?.x ?? 0;
  const y = touch?.clientY ?? detail?.y ?? 0;
  const ratio =
    trackPx.value > 0 ? (isColumn.value ? 1 - y / trackPx.value : x / trackPx.value) : 0;
  const next = snap(props.min + Math.min(1, Math.max(0, ratio)) * span.value);
  if (props.range) {
    const [low, high] = pair.value;
    if (Math.abs(next - low) <= Math.abs(next - high)) emitValue(Math.min(next, high), high, true);
    else emitValue(low, Math.max(next, low), true);
  } else {
    emitValue(next, next, true);
  }
}

function onKnobTouch(index: number, e: UniTouchEvent): void {
  if (!isInteractive.value) return;
  draggingIndex.value = index;
  const touch = e.touches?.[0] ?? e.changedTouches?.[0];
  const detail = typeof e.detail === 'object' ? e.detail : undefined;
  const x = touch?.clientX ?? detail?.x ?? 0;
  const y = touch?.clientY ?? detail?.y ?? 0;
  const ratio =
    trackPx.value > 0 ? (isColumn.value ? 1 - y / trackPx.value : x / trackPx.value) : 0;
  const next = snap(props.min + Math.min(1, Math.max(0, ratio)) * span.value);
  const [low, high] = pair.value;
  if (index === 0) emitValue(Math.min(next, high), high, false);
  else emitValue(low, Math.max(next, low), false);
}

/* ── misc ───────────────────────────────────────────────────────────────── */

const rootClass = computed(() => [
  'sn-slider-bar',
  `sn-slider-bar--${props.variant}`,
  {
    'sn-slider-bar--aurora': isAurora.value,
    'sn-slider-bar--animated': isAurora.value && props.animated,
    'sn-slider-bar--empty': isEmpty.value,
    'sn-slider-bar--disabled': props.disabled,
    'sn-slider-bar--readonly': props.readonly,
    'sn-slider-bar--column': isColumn.value,
    'sn-slider-bar--fade': props.fade,
  },
  props.customClass,
]);

const rootStyle = computed(() => {
  const parts = [
    `--sn-bar-thickness:${thicknessRpx.value}rpx`,
    `--sn-bar-thumb-pad:${knobRpx.value / 2}rpx`,
  ];
  if (props.radius) parts.push(`--sn-bar-radius:${props.radius}`);
  // barHeight wins; the `height` alias falls back only when it carries a value
  // (an empty-string default must not shadow barHeight).
  const explicitHeight =
    props.barHeight !== undefined && props.barHeight !== '' ? props.barHeight : props.height;
  if (explicitHeight !== undefined && explicitHeight !== null && explicitHeight !== '') {
    const h = typeof explicitHeight === 'number' ? `${explicitHeight}rpx` : String(explicitHeight);
    parts.push(`--sn-bar-height:${h}`);
    parts.push(`height:${h}`);
  }
  if (props.innerColor) parts.push(`--sn-bar-inner-color:${props.innerColor}`);
  if (props.innerColorEmpty) parts.push(`--sn-bar-inner-color-empty:${props.innerColorEmpty}`);
  if (props.customStyle) parts.push(props.customStyle);
  return parts.join(';');
});

const ariaNow = (index: number): number => pair.value[props.range ? index : 1] ?? props.min;

const knobLabels = computed(() =>
  props.range
    ? [`${props.ariaLabel || 'Start'} ${ariaNow(0)}`, `${props.ariaLabel || 'End'} ${ariaNow(1)}`]
    : [`${props.ariaLabel || 'Value'} ${ariaNow(0)}`],
);
</script>

<template>
  <view :class="rootClass" :style="rootStyle" :aria-label="ariaLabel">
    <view class="sn-slider-bar__body">
      <!-- Opt-in head glyph. -->
      <view v-if="!isColumn && $slots.start" class="sn-slider-bar__edge" aria-hidden="true">
        <slot name="start" />
      </view>

      <view :id="trackId" class="sn-slider-bar__track" @tap="onTrackTap">
        <view class="sn-slider-bar__fill" :style="fillStyle" aria-hidden="true">
          <!-- Aurora star field: static dots, animated by CSS. -->
          <view
            v-for="(dot, i) in isAurora && animated ? (sparkles ?? 14) : 0"
            :key="'star-' + i"
            class="sn-slider-bar__star"
            :style="`left:${(i * 37) % 100}%;top:${18 + ((i * 29) % 60)}%;`"
          />
        </view>

        <!-- Level ticks. -->
        <view
          v-for="tick in levelTicks"
          :key="'lvl-' + tick.value"
          class="sn-slider-bar__level-mark"
          :class="{ 'sn-slider-bar__level-mark--on': activeLevel?.value === tick.value }"
          :style="isColumn ? `bottom:${tick.pct}%;` : `left:${tick.pct}%;`"
          aria-hidden="true"
        />

        <!-- In-track label / glyph / suffix. -->
        <text v-if="label" class="sn-slider-bar__label" aria-hidden="true">{{ label }}</text>
        <view v-if="!isColumn && $slots.icon" class="sn-slider-bar__glyph" aria-hidden="true">
          <slot name="icon" />
        </view>
        <text v-if="suffix" class="sn-slider-bar__suffix" aria-hidden="true">{{ suffix }}</text>

        <!-- Knobs. -->
        <view
          v-for="(style, index) in knobStyle"
          :key="'knob-' + index"
          class="sn-slider-bar__knob"
          :class="{ 'sn-slider-bar__knob--active': draggingIndex === index }"
          :style="style"
          role="slider"
          :aria-label="knobLabels[index]"
          :aria-valuenow="ariaNow(index)"
          :aria-valuemin="range && index === 1 ? pair[0] : min"
          :aria-valuemax="range && index === 0 ? pair[1] : max"
          @touchstart.stop="onKnobTouch(index, $event)"
        />
      </view>

      <view v-if="!isColumn && $slots.end" class="sn-slider-bar__edge sn-slider-bar__edge--end">
        <slot name="end" />
      </view>

      <text
        v-if="captionVisible && (!isColumn || showValue)"
        class="sn-slider-bar__value"
        aria-hidden="true"
      >
        <slot
          name="value"
          :value="pair[1]"
          :percent="Math.round(fillPercent)"
          :level="activeLevel?.label ?? ''"
        >
          {{ captionText }}
        </slot>
      </text>
    </view>
  </view>
</template>

<style scoped>
/* =====================================================================
   sn-slider-bar — capsule slider (uni end, rpx units).

   One capsule surface: the track is the bar. The fill is themed (solid, or an
   aurora gradient with drifting stars) and the knob matches the track height.
   Text / glyph colours switch between the filled and empty states.
   ===================================================================== */

.sn-slider-bar {
  --sn-bar-thickness: 80rpx;
  --sn-bar-height: auto;
  --sn-bar-radius: 9999rpx;
  --sn-bar-pad: 0rpx;
  --sn-bar-fill: var(--sn-mp-color-action-primary);
  --sn-bar-track: rgba(0, 0, 0, 0.08);
  --sn-bar-thumb: #ffffff;

  display: flex;
  width: 100%;
  height: var(--sn-bar-height, auto);
  box-sizing: border-box;
  font-family: inherit;
}

.sn-slider-bar__body {
  display: flex;
  flex: 1;
  align-items: center;
  min-width: 0;
}

.sn-slider-bar__edge {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 44rpx;
}

.sn-slider-bar__edge--end {
  margin-left: 12rpx;
}

.sn-slider-bar__track {
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  min-width: 0;
  height: var(--sn-bar-thickness);
  border-radius: var(--sn-bar-radius);
  background: var(--sn-bar-track);
  overflow: visible;
}

.sn-slider-bar--column .sn-slider-bar__track {
  flex: 1;
  align-self: stretch;
  width: var(--sn-slider-bar-column-width, 112rpx);
  height: auto;
  min-height: 96rpx;
  padding-top: 68rpx;
}

/* Fill: themed band inside the capsule. */
.sn-slider-bar__fill {
  position: absolute;
  top: 0;
  height: 100%;
  border-radius: var(--sn-bar-radius);
  background: var(--sn-bar-fill);
  overflow: hidden;
}

.sn-slider-bar--column .sn-slider-bar__fill {
  top: auto;
  left: 0;
  width: 100%;
}

.sn-slider-bar--aurora .sn-slider-bar__fill {
  background-size: 220% 100%;
  box-shadow: 0 0 24rpx rgba(124, 108, 246, 0.35);
}

.sn-slider-bar--animated .sn-slider-bar__fill {
  animation: sn-bar-drift 9s ease-in-out infinite alternate;
}

@keyframes sn-bar-drift {
  from {
    background-position: 0% 50%;
  }
  to {
    background-position: 100% 50%;
  }
}

.sn-slider-bar__star {
  position: absolute;
  width: 6rpx;
  height: 6rpx;
  border-radius: 50%;
  background: #ffffff;
  opacity: 0.5;
}

.sn-slider-bar--animated .sn-slider-bar__star {
  animation: sn-bar-twinkle 3.2s ease-in-out infinite;
}

@keyframes sn-bar-twinkle {
  0%,
  100% {
    opacity: 0.2;
    transform: scale(0.7);
  }
  50% {
    opacity: 0.95;
    transform: scale(1.15);
  }
}

/* Knob: a disc the same height as the track. */
.sn-slider-bar__knob {
  position: absolute;
  width: var(--sn-bar-thickness);
  height: var(--sn-bar-thickness);
  border-radius: 50%;
  background: var(--sn-bar-thumb);
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.28);
  transform: translate(-50%, -50%);
  z-index: 2;
}

.sn-slider-bar--column .sn-slider-bar__knob {
  transform: translate(-50%, 50%);
}

.sn-slider-bar__knob--active {
  transform: translate(-50%, -50%) scale(1.06);
}

.sn-slider-bar--column .sn-slider-bar__knob--active {
  transform: translate(-50%, 50%) scale(1.06);
}

.sn-slider-bar--disabled .sn-slider-bar__knob,
.sn-slider-bar--readonly .sn-slider-bar__knob {
  background: var(--sn-mp-color-action-disabled, rgba(0, 0, 0, 0.25));
}

/* Level ticks. */
.sn-slider-bar__level-mark {
  position: absolute;
  top: 50%;
  width: 6rpx;
  height: 6rpx;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.3);
  z-index: 3;
}

.sn-slider-bar--column .sn-slider-bar__level-mark {
  top: auto;
  left: 50%;
  transform: translate(-50%, 50%);
}

.sn-slider-bar__level-mark--on {
  background: #ffffff;
}

/* In-track text / glyph — two colour states. */
.sn-slider-bar__label,
.sn-slider-bar__suffix,
.sn-slider-bar__glyph {
  position: relative;
  z-index: 4;
  flex: none;
  color: var(--sn-bar-inner-color-empty, var(--sn-mp-color-text-secondary, #888));
  transition: color 0.18s ease;
}

.sn-slider-bar:not(.sn-slider-bar--empty) .sn-slider-bar__label,
.sn-slider-bar:not(.sn-slider-bar--empty) .sn-slider-bar__suffix,
.sn-slider-bar:not(.sn-slider-bar--empty) .sn-slider-bar__glyph {
  color: var(--sn-bar-inner-color, #ffffff);
}

.sn-slider-bar--aurora:not(.sn-slider-bar--empty) .sn-slider-bar__label,
.sn-slider-bar--aurora:not(.sn-slider-bar--empty) .sn-slider-bar__suffix,
.sn-slider-bar--aurora:not(.sn-slider-bar--empty) .sn-slider-bar__glyph {
  color: var(--sn-bar-inner-color, #ffffff);
}

.sn-slider-bar__label {
  padding-left: 24rpx;
  font-size: 24rpx;
  line-height: 1;
  white-space: nowrap;
}

.sn-slider-bar__glyph {
  margin-left: 16rpx;
}

.sn-slider-bar__suffix {
  margin-left: auto;
  padding-right: 24rpx;
  font-size: 24rpx;
  line-height: 1;
  white-space: nowrap;
}

/* Read-out beside / above the bar. */
.sn-slider-bar__value {
  flex: none;
  margin: 0 24rpx 0 20rpx;
  font-size: 24rpx;
  white-space: nowrap;
}

.sn-slider-bar--column .sn-slider-bar__value {
  order: -1;
  align-self: center;
  margin: 12rpx 0 20rpx;
  font-size: 28rpx;
}
</style>
