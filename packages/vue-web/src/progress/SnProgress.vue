<script setup lang="ts">
/**
 * SnProgress — web-end progress indicator (AUI-WEB-FB-014).
 *
 * Reference library: naive-ui `n-progress`
 *   (https://www.naiveui.com/zh-CN/light/components/progress)
 * Per AGENTS.md §112, props + semantics mirror n-progress 1:1:
 *   type ('line' | 'circle' | 'multiple-circle') / percentage (number,
 *   or number[] for multiple-circle) / height / borderRadius /
 *   fillBorderRadius / strokeWidth / indicatorPlacement
 *   ('inside' | 'outside' | 'top') / color (solid | gradient stops |
 *   function) / railColor / showIndicator / status ('default' | 'success'
 *   | 'error' | 'info' | 'warning') / processing / offsetDegree.
 *   Slots: default (custom indicator content) / icon (circle success /
 *   error glyph).
 *
 * Documented divergences (not §112 violations):
 *   - Reference props `unit` and `circleGap` are not implemented:
 *     indicators always use '%' and multiple-circle rings keep a fixed
 *     2px gap.
 *   - `indicatorPlacement` only affects type='line' ('outside' → right of
 *     the rail, 'inside' → inside the fill, 'top' → above the rail);
 *     circle / multiple-circle indicators are always centred in the ring
 *     (multiple-circle shows a colour legend below the rings instead).
 *   - Status colors map to web tokens: success →
 *     --sn-web-color-feedback-success, error → danger, warning → warning,
 *     info → info, default → --sn-web-color-action-primary. Theme
 *     metrics: rail 8px, rail/fill radius 6px, circle stroke 6px,
 *     circle size 120px, indicator font 14px.
 *   - `processing` animates striped overlay on the line fill; on circle
 *     types it pulses the fill arc (the reference does not animate
 *     circle processing).
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnProgress :percentage="60" />
 *   <SnProgress type="circle" :percentage="75" status="success" />
 *   <SnProgress type="multiple-circle" :percentage="[20, 50, 86]" :color="['#0e80eb', '#85aa39', '#8f3c3c']" />
 */

import { computed } from 'vue';

defineOptions({ name: 'SnProgress' });

export type SnProgressType = 'line' | 'circle' | 'multiple-circle';
export type SnProgressStatus = 'default' | 'success' | 'error' | 'info' | 'warning';
export type SnProgressIndicatorPlacement = 'inside' | 'outside' | 'top';

/** Gradient stop — mirrors the reference `{ color, stop }` shape. */
export interface SnProgressGradientStop {
  color: string;
  stop?: number;
}

type ProgressColor = string | SnProgressGradientStop[] | ((percentage: number) => string);

const props = withDefaults(
  defineProps<{
    /** Progress bar type. Mirrors n-progress `type`. Default 'line'. */
    type?: SnProgressType;
    /**
     * Progress value(s) in percent, clamped to 0–100. Pass an array for
     * type='multiple-circle'. Mirrors n-progress `percentage`. Default 0.
     */
    percentage?: number | number[];
    /** Line rail height (px number or CSS length). Mirrors n-progress `height`. */
    height?: number | string | undefined;
    /** Line rail corner radius. Mirrors n-progress `borderRadius`. */
    borderRadius?: number | string | undefined;
    /** Line fill corner radius; falls back to `borderRadius`. Mirrors n-progress `fillBorderRadius`. */
    fillBorderRadius?: number | string | undefined;
    /** Circle ring stroke width in px. Mirrors n-progress `strokeWidth`. Default 6. */
    strokeWidth?: number;
    /**
     * Indicator placement for type='line': 'outside' (right of the rail,
     * default), 'inside' (inside the fill), 'top' (above the rail).
     * Mirrors n-progress `indicatorPlacement`.
     */
    indicatorPlacement?: SnProgressIndicatorPlacement;
    /** Fill color: solid, gradient stops, or `(percentage) => string`. Mirrors n-progress `color`. */
    color?: ProgressColor | undefined;
    /** Rail color: solid or gradient stops. Mirrors n-progress `railColor`. */
    railColor?: string | SnProgressGradientStop[] | undefined;
    /** Whether to render the indicator text. Mirrors n-progress `showIndicator`. Default true. */
    showIndicator?: boolean;
    /** Status — drives the default fill color. Mirrors n-progress `status`. Default 'default'. */
    status?: SnProgressStatus;
    /** Animated striped fill (line) / pulsing arc (circle). Mirrors n-progress `processing`. Default false. */
    processing?: boolean;
    /** Circle start-angle offset in degrees (0 = 12 o'clock). Mirrors n-progress `offsetDegree`. Default 0. */
    offsetDegree?: number;
  }>(),
  {
    type: 'line',
    percentage: 0,
    height: undefined,
    borderRadius: undefined,
    fillBorderRadius: undefined,
    strokeWidth: 6,
    indicatorPlacement: 'outside',
    color: undefined,
    railColor: undefined,
    showIndicator: true,
    status: 'default',
    processing: false,
    offsetDegree: 0,
  },
);

defineSlots<{
  /** Custom indicator content. Receives `{ percentage }`. Mirrors n-progress `default`. */
  default?(scope: { percentage: number }): unknown;
  /** Custom glyph for the circle success / error state. Mirrors n-progress `icon`. */
  icon?(): unknown;
}>();

/* ─────────── Status color mapping ─────────── */

const STATUS_TOKENS: Record<SnProgressStatus, string> = {
  default: 'var(--sn-web-color-action-primary)',
  success: 'var(--sn-web-color-feedback-success)',
  error: 'var(--sn-web-color-feedback-danger)',
  info: 'var(--sn-web-color-feedback-info)',
  warning: 'var(--sn-web-color-feedback-warning)',
};

/* ─────────── Value normalization ─────────── */

function clamp(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

/** Values for the current type; a scalar percentage is a one-element list. */
const percentageList = computed<number[]>(() => {
  const raw = Array.isArray(props.percentage) ? props.percentage : [props.percentage];
  return raw.map((value) => clamp(value));
});

/** First value — drives role="progressbar" ARIA attributes. */
const primaryPercentage = computed(() => percentageList.value[0] ?? 0);

/* ─────────── Color resolution ─────────── */

function stopsToGradient(stops: SnProgressGradientStop[]): string {
  const sorted = [...stops].sort((a, b) => (a.stop ?? 0) - (b.stop ?? 0));
  const parts = sorted.map((stop, index) => {
    const at = stop.stop ?? Math.round((index / Math.max(sorted.length - 1, 1)) * 100);
    return `${stop.color} ${at}%`;
  });
  return `linear-gradient(to right, ${parts.join(', ')})`;
}

/** Resolve a color-ish prop into a concrete CSS background value. */
function resolveColor(color: ProgressColor | undefined, percentage: number): string | undefined {
  if (color === undefined) return undefined;
  if (typeof color === 'function') return color(percentage);
  if (Array.isArray(color)) return stopsToGradient(color);
  return color;
}

/**
 * Per-ring fill colors. Array-of-strings maps ring → color; gradient
 * stops / functions resolve once and apply to every ring.
 */
function resolveRingColor(index: number, percentage: number): string {
  const color = props.color;
  if (color === undefined) return STATUS_TOKENS[props.status];
  if (typeof color === 'string') return color;
  if (Array.isArray(color)) {
    // Array of solid colors maps ring index → color; gradient stops and
    // functions resolve once and apply to every ring.
    const first = color[0];
    if (typeof first === 'string') {
      const ring = color as unknown as string[];
      return ring[Math.min(index, ring.length - 1)] ?? STATUS_TOKENS[props.status];
    }
    return resolveColor(color, percentage) ?? STATUS_TOKENS[props.status];
  }
  return resolveColor(color, percentage) ?? STATUS_TOKENS[props.status];
}

const lineFillColor = computed(
  () => resolveColor(props.color, primaryPercentage.value) ?? STATUS_TOKENS[props.status],
);

const RAIL_FALLBACK = 'var(--sn-web-color-background-subtle)';

const lineRailColor = computed<string>(() =>
  props.railColor === undefined
    ? RAIL_FALLBACK
    : (resolveColor(props.railColor, primaryPercentage.value) ?? RAIL_FALLBACK),
);

const circleRailColor = computed<string>(() =>
  props.railColor === undefined
    ? RAIL_FALLBACK
    : (resolveColor(props.railColor, primaryPercentage.value) ?? RAIL_FALLBACK),
);

/* ─────────── Geometry ─────────── */

const CIRCLE_SIZE = 120;
/** Fixed gap between adjacent multiple-circle rings (px, viewBox units). */
const RING_GAP = 2;

const lineStyle = computed(() => {
  const style: Record<string, string> = {};
  style.height = typeof props.height === 'number' ? `${props.height}px` : (props.height ?? '8px');
  const radius =
    typeof props.borderRadius === 'number' ? `${props.borderRadius}px` : props.borderRadius;
  if (radius !== undefined) style.borderRadius = radius;
  style.background = lineRailColor.value;
  return style;
});

const fillStyle = computed(() => {
  const style: Record<string, string> = {
    width: `${primaryPercentage.value}%`,
    background: lineFillColor.value,
  };
  const radius = props.fillBorderRadius !== undefined ? props.fillBorderRadius : props.borderRadius;
  const radiusPx = typeof radius === 'number' ? `${radius}px` : radius;
  if (radiusPx !== undefined) style.borderRadius = radiusPx;
  return style;
});

/* Circle ring: circumference of the standard 120px ring. */
const circleRadius = computed(() => CIRCLE_SIZE / 2 - props.strokeWidth / 2);
const circleCircumference = computed(() => 2 * Math.PI * circleRadius.value);

function circleDashArray(percentage: number): string {
  const filled = (circleCircumference.value * percentage) / 100;
  return `${filled.toFixed(2)} ${circleCircumference.value.toFixed(2)}`;
}

/* 0deg offset starts at 12 o'clock: the SVG dash origin sits at 3 o'clock,
 * so the base rotation is -90deg plus the user offset. */
const circleRotation = computed(
  () => `rotate(${props.offsetDegree - 90} ${CIRCLE_SIZE / 2} ${CIRCLE_SIZE / 2})`,
);

interface Ring {
  percentage: number;
  radius: number;
  color: string;
  dashArray: string;
}

const rings = computed<Ring[]>(() =>
  percentageList.value.map((percentage, index) => ({
    percentage,
    radius: circleRadius.value - index * (props.strokeWidth + RING_GAP),
    color: resolveRingColor(index, percentage),
    dashArray: circleDashArray(percentage),
  })),
);

/* ─────────── Indicator helpers ─────────── */

const hasIconState = computed(() => props.status === 'success' || props.status === 'error');

/** type='line' hides the indicator in favour of the status icon only on circle. */
const lineIndicatorVisible = computed(() => props.showIndicator);

const rootClass = computed(() => [
  `sn-progress--${props.type}`,
  `sn-progress--status-${props.status}`,
  {
    'sn-progress--processing': props.processing,
  },
]);

const ariaAttributes = computed(() => {
  if (props.type === 'multiple-circle') {
    return {
      role: 'img',
      'aria-label': `Progress ${percentageList.value.map((p) => `${p}%`).join(', ')}`,
    };
  }
  return {
    role: 'progressbar',
    'aria-valuemin': 0,
    'aria-valuemax': 100,
    'aria-valuenow': primaryPercentage.value,
  };
});
</script>

<template>
  <div
    data-snui-component="progress"
    class="sn-progress"
    :class="rootClass"
    v-bind="ariaAttributes"
  >
    <!-- ── line ─────────────────────────────────────────────────────────── -->
    <template v-if="type === 'line'">
      <div
        v-if="indicatorPlacement === 'top' && lineIndicatorVisible"
        class="sn-progress__line-indicator sn-progress__line-indicator--top"
      >
        <slot :percentage="primaryPercentage">{{ primaryPercentage }}%</slot>
      </div>
      <div class="sn-progress__line" :style="lineStyle">
        <div
          class="sn-progress__line-fill"
          :class="{ 'sn-progress__line-fill--processing': processing }"
          :style="fillStyle"
        >
          <span
            v-if="indicatorPlacement === 'inside' && lineIndicatorVisible"
            class="sn-progress__line-indicator sn-progress__line-indicator--inside"
          >
            <slot :percentage="primaryPercentage">{{ primaryPercentage }}%</slot>
          </span>
        </div>
      </div>
      <span
        v-if="indicatorPlacement === 'outside' && lineIndicatorVisible"
        class="sn-progress__line-indicator sn-progress__line-indicator--outside"
      >
        <slot :percentage="primaryPercentage">{{ primaryPercentage }}%</slot>
      </span>
    </template>

    <!-- ── circle ───────────────────────────────────────────────────────── -->
    <template v-else-if="type === 'circle'">
      <div class="sn-progress__circle">
        <svg
          class="sn-progress__circle-svg"
          :class="{ 'sn-progress__circle-svg--processing': processing }"
          :width="CIRCLE_SIZE"
          :height="CIRCLE_SIZE"
          :viewBox="`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`"
          aria-hidden="true"
        >
          <g :transform="circleRotation">
            <circle
              class="sn-progress__circle-rail"
              :cx="CIRCLE_SIZE / 2"
              :cy="CIRCLE_SIZE / 2"
              :r="circleRadius"
              fill="none"
              :stroke-width="strokeWidth"
              :stroke="circleRailColor"
            />
            <circle
              class="sn-progress__circle-fill"
              :cx="CIRCLE_SIZE / 2"
              :cy="CIRCLE_SIZE / 2"
              :r="circleRadius"
              fill="none"
              :stroke-width="strokeWidth"
              :stroke="resolveRingColor(0, primaryPercentage)"
              :stroke-dasharray="circleDashArray(primaryPercentage)"
              :stroke-linecap="primaryPercentage > 0 ? 'round' : 'butt'"
            />
          </g>
        </svg>
        <div v-if="showIndicator" class="sn-progress__circle-indicator">
          <span
            v-if="hasIconState"
            class="sn-progress__circle-status-icon"
            :class="`sn-progress__circle-status-icon--${status}`"
          >
            <!--
              Built-in status glyphs are inline SVGs (packages/vue-web does
              not depend on an icon package); the `icon` slot replaces them.
            -->
            <slot name="icon">
              <svg
                v-if="status === 'success'"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m8.5 12.5 2.5 2.5 4.5-5.5" />
              </svg>
              <svg
                v-else
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m9 9 6 6M15 9l-6 6" />
              </svg>
            </slot>
          </span>
          <span v-else class="sn-progress__circle-text">
            <slot :percentage="primaryPercentage">{{ primaryPercentage }}%</slot>
          </span>
        </div>
      </div>
    </template>

    <!-- ── multiple-circle ──────────────────────────────────────────────── -->
    <template v-else>
      <div class="sn-progress__multiple">
        <svg
          class="sn-progress__multiple-svg"
          :width="CIRCLE_SIZE"
          :height="CIRCLE_SIZE"
          :viewBox="`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`"
          aria-hidden="true"
        >
          <g
            v-for="(ring, index) in rings"
            :key="index"
            :transform="`rotate(${(offsetDegree ?? 0) - 90} ${CIRCLE_SIZE / 2} ${CIRCLE_SIZE / 2})`"
          >
            <circle
              class="sn-progress__circle-rail"
              :cx="CIRCLE_SIZE / 2"
              :cy="CIRCLE_SIZE / 2"
              :r="ring.radius"
              fill="none"
              :stroke-width="strokeWidth"
              :stroke="index === 0 ? circleRailColor : 'transparent'"
            />
            <circle
              class="sn-progress__circle-fill"
              :cx="CIRCLE_SIZE / 2"
              :cy="CIRCLE_SIZE / 2"
              :r="ring.radius"
              fill="none"
              :stroke-width="strokeWidth"
              :stroke="ring.color"
              :stroke-dasharray="ring.dashArray"
              :stroke-linecap="ring.percentage > 0 ? 'round' : 'butt'"
            />
          </g>
        </svg>
        <div v-if="showIndicator" class="sn-progress__legend">
          <span v-for="(ring, index) in rings" :key="index" class="sn-progress__legend-item">
            <span
              class="sn-progress__legend-dot"
              :style="{ background: ring.color }"
              aria-hidden="true"
            />
            <span class="sn-progress__legend-text">
              <slot :percentage="ring.percentage">{{ ring.percentage }}%</slot>
            </span>
          </span>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-progress {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  color: var(--sn-web-color-text-secondary);
}

/* ── line ─────────────────────────────────────────────────────────── */

.sn-progress--line {
  width: 100%;
  gap: 8px;
}

.sn-progress__line {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  background: var(--sn-web-color-background-subtle);
  border-radius: 6px;
  transition: background 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sn-progress__line-fill {
  position: relative;
  height: 100%;
  overflow: hidden;
  border-radius: 6px;
  transition:
    width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    background 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* `processing` — animated diagonal stripes over the fill. */
.sn-progress__line-fill--processing::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.22) 0,
    rgba(255, 255, 255, 0.22) 6px,
    transparent 6px,
    transparent 12px
  );
  animation: sn-progress-stripes 1s linear infinite;
}

@keyframes sn-progress-stripes {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 17px 0;
  }
}

.sn-progress__line-indicator {
  flex: 0 0 auto;
  font-size: 14px;
  line-height: 1.4;
  color: var(--sn-web-color-text-secondary);
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sn-progress__line-indicator--top {
  align-self: flex-end;
  margin-bottom: 2px;
}

.sn-progress__line-indicator--inside {
  position: absolute;
  top: 50%;
  right: 4px;
  transform: translateY(-50%);
  color: var(--sn-web-color-text-on-primary, #fff);
}

/* ── circle / multiple-circle ─────────────────────────────────────── */

.sn-progress--circle {
  display: inline-flex;
}

.sn-progress__circle {
  position: relative;
  display: inline-flex;
}

.sn-progress__circle-svg {
  display: block;
}

.sn-progress__circle-rail,
.sn-progress__circle-fill {
  transition:
    stroke-dasharray 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    stroke 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* `processing` on circle types — pulse the fill arc. */
.sn-progress__circle-svg--processing .sn-progress__circle-fill {
  animation: sn-progress-pulse 1.6s ease-in-out infinite;
}

@keyframes sn-progress-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.55;
  }
}

.sn-progress__circle-indicator {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.sn-progress__circle-text {
  font-size: 14px;
  color: var(--sn-web-color-text-secondary);
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sn-progress__circle-status-icon {
  display: inline-flex;
  color: var(--sn-web-color-action-primary);
}

.sn-progress__circle-status-icon svg {
  width: 34px;
  height: 34px;
}

.sn-progress__circle-status-icon--success {
  color: var(--sn-web-color-feedback-success);
}

.sn-progress__circle-status-icon--error {
  color: var(--sn-web-color-feedback-danger);
}

/* ── multiple-circle legend ───────────────────────────────────────── */

.sn-progress--multiple-circle {
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.sn-progress__multiple {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.sn-progress__legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px 12px;
}

.sn-progress__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.sn-progress__legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.sn-progress__legend-text {
  font-size: 14px;
  color: var(--sn-web-color-text-secondary);
}
</style>
