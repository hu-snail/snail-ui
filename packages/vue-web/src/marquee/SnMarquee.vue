<script setup lang="ts">
/**
 * SnMarquee — seamless scrolling ticker (跑马灯).
 *
 * Reference library: **explicit divergence** — naive-ui has NO marquee
 * component (verified against naive-ui `src/components.ts`: it is not in the
 * component list). Per AGENTS.md §112 a divergence has to be documented, so
 * the prop surface follows the near-universal marquee convention established
 * by `react-fast-marquee` / `vue3-marquee` (direction / duration / gap /
 * pause-on-hover) instead of mirroring naive-ui 1:1. The deprecated HTML
 * `<marquee>` element is deliberately NOT used.
 *
 * Seamless-loop contract:
 *   - The `default` slot holds ONE copy of the content.
 *   - The component renders that copy `repeat` times (integer ≥ 2) inside one
 *     flex track and translates the track by exactly one copy box
 *     (`100% / repeat` of the track) per pass, so copy 2 lands where copy 1
 *     started and the wrap-around seam is invisible.
 *   - The gap is applied as trailing padding on each copy, never as flex
 *     `gap` on the animated track: a flex gap collapses to a single gap at
 *     the wrap-around point while the copies stay evenly spaced, which breaks
 *     the loop.
 *
 * Divergences from the reference libraries (documented, not §112 violations):
 *   - `duration` (seconds per pass) instead of `react-fast-marquee`'s `speed`
 *     (px/s): a duration keeps the loop time independent of the content
 *     width, so one prop works for a short notice and for a card strip.
 *   - No JS ticker: one linear infinite CSS keyframe drives the track, so
 *     there is no timer / rAF handle to dispose while idle (AGENTS.md §41).
 *   - `vertical` is a convenience shorthand for `direction="up"`; every
 *     behaviour (keyframes, axis, shift) is still derived from `direction`.
 *   - Only the first copy is exposed to assistive technology; every extra
 *     copy is `aria-hidden="true"`.
 *   - `@media (prefers-reduced-motion: reduce)` stops the animation outright
 *     instead of slowing it (the content stays readable in place).
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnMarquee :duration="20" :gap="32">今日特惠：全场包邮，满 99 减 30</SnMarquee>
 *   <SnMarquee vertical :height="40" direction="up">本周更新公告</SnMarquee>
 */

import { computed } from 'vue'

type SnMarqueeDirection = 'left' | 'right' | 'up' | 'down'

/** Seconds for one full pass when `duration` is omitted or unusable. */
const DEFAULT_DURATION = 12
/** Gap between two copies when `gap` is omitted. */
const DEFAULT_GAP = 24
/** Two copies are the minimum that can hand over without a visible seam. */
const MIN_COPIES = 2

defineOptions({ name: 'SnMarquee' })

const props = withDefaults(
  defineProps<{
    /** Direction the content travels. */
    direction?: SnMarqueeDirection
    /** Seconds for one full pass of the track. Non-positive / non-finite
     *  values fall back to the default so the animation stays valid. */
    duration?: number
    /** How many copies of the slot content are rendered. Coerced to an
     *  integer ≥ 2 — a single copy has nothing to hand over to. */
    repeat?: number
    /** Distance kept between two copies. Number → px. */
    gap?: number | string
    /** Pause the animation while the pointer hovers the marquee. */
    pauseOnHover?: boolean
    /** Whether the ticker runs. `false` freezes it in place. */
    playing?: boolean
    /** Shorthand for a vertical ticker: behaves as `direction="up"` unless
     *  `direction` already is `'up'` / `'down'`. */
    vertical?: boolean
    /** Box height. Number → px. Recommended for a vertical marquee so the
     *  viewport has a fixed height to clip against. */
    height?: number | string
  }>(),
  {
    direction: 'left',
    duration: DEFAULT_DURATION,
    repeat: MIN_COPIES,
    gap: DEFAULT_GAP,
    pauseOnHover: true,
    playing: true,
    vertical: false,
  },
)

defineSlots<{
  /** ONE copy of the ticker content; the component duplicates it. */
  default(): unknown
}>()

// ---------- Derived configuration ----------

/** Direction actually animated. `vertical` only supplies a default; an
 *  explicit vertical `direction` always wins. */
const resolvedDirection = computed<SnMarqueeDirection>(() => {
  if (props.vertical && props.direction !== 'up' && props.direction !== 'down') {
    return 'up'
  }
  return props.direction
})

const isVertical = computed(
  () => resolvedDirection.value === 'up' || resolvedDirection.value === 'down',
)

/** Copies actually rendered: an integer ≥ 2 (a fractional or out-of-range
 *  `repeat` would break the `100% / repeat` seam arithmetic). */
const copyCount = computed(() => {
  const requested = Math.floor(Number(props.repeat))
  return Number.isFinite(requested) ? Math.max(MIN_COPIES, requested) : MIN_COPIES
})

/** Seconds per pass, guarded so `animation-duration` is never invalid. */
const durationSeconds = computed(() => {
  const value = Number(props.duration)
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_DURATION
})

function formatLength(value: string | number): string {
  return typeof value === 'number' ? `${value}px` : value
}

const gapLength = computed(() => formatLength(props.gap))

/** One pass = one copy box (content + its trailing gap) = `100% / repeat` of
 *  the track. Used by every `sn-marquee-*` keyframe. */
const shiftPercent = computed(() => `${-100 / copyCount.value}%`)

const rootStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {
    '--sn-marquee-duration': `${durationSeconds.value}s`,
    '--sn-marquee-shift': shiftPercent.value,
  }
  if (props.height !== undefined) style.height = formatLength(props.height)
  return style
})

/** Trailing padding keeps the seam gap: the last copy ends with the same gap
 *  that separates every other pair. */
const copyStyle = computed<Record<string, string>>(() =>
  isVertical.value ? { paddingBottom: gapLength.value } : { paddingRight: gapLength.value },
)

const rootClass = computed(() => [
  `sn-marquee--${resolvedDirection.value}`,
  isVertical.value ? 'sn-marquee--vertical' : 'sn-marquee--horizontal',
  {
    'sn-marquee--paused': !props.playing,
    'sn-marquee--pause-on-hover': props.pauseOnHover,
  },
])
</script>

<template>
  <div
    data-snui-component="marquee"
    role="marquee"
    aria-live="off"
    class="sn-marquee"
    :class="rootClass"
    :style="rootStyle"
  >
    <div class="sn-marquee__track">
      <!-- The slot is ONE copy; everything after the first is duplicate
           content that only exists to hide the wrap-around seam. -->
      <div
        v-for="index in copyCount"
        :key="index"
        class="sn-marquee__copy"
        :aria-hidden="index === 1 ? undefined : 'true'"
        :style="copyStyle"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-marquee {
  display: block;
  box-sizing: border-box;
  overflow: hidden;
  min-width: 0;
  background: var(--sn-web-color-background-surface, #ffffff);
  color: var(--sn-web-color-text-primary, #1f2329);
  font-size: var(--sn-web-font-size-md, 14px);
  line-height: var(--sn-web-font-line-height-normal, 1.5715);
}

/* The animated track: one row (or one column) of identical copies, always
 * larger than the viewport, clipped by the root. */
.sn-marquee__track {
  display: flex;
  flex-wrap: nowrap;
  width: max-content;
  animation-duration: var(--sn-marquee-duration, 12s);
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-play-state: running;
  will-change: transform;
}

.sn-marquee--horizontal .sn-marquee__track {
  flex-direction: row;
  align-items: center;
}

.sn-marquee--vertical .sn-marquee__track {
  flex-direction: column;
  align-items: flex-start;
}

/* Copies keep their intrinsic size — shrinking one would desynchronise the
 * copies and re-introduce the seam. */
.sn-marquee__copy {
  display: block;
  flex: 0 0 auto;
}

/* One pass translates the track by exactly one copy box. */
@keyframes sn-marquee-x {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(var(--sn-marquee-shift, -50%), 0, 0);
  }
}

@keyframes sn-marquee-y {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(0, var(--sn-marquee-shift, -50%), 0);
  }
}

.sn-marquee--left .sn-marquee__track {
  animation-name: sn-marquee-x;
}

/* Moving right = the same horizontal pass played backwards, which keeps the
 * loop seam-free without a second keyframe. */
.sn-marquee--right .sn-marquee__track {
  animation-name: sn-marquee-x;
  animation-direction: reverse;
}

.sn-marquee--up .sn-marquee__track {
  animation-name: sn-marquee-y;
}

.sn-marquee--down .sn-marquee__track {
  animation-name: sn-marquee-y;
  animation-direction: reverse;
}

.sn-marquee--paused .sn-marquee__track,
.sn-marquee--pause-on-hover:hover .sn-marquee__track {
  animation-play-state: paused;
}

/* Motion is decorative here: stop it outright rather than slowing it down.
 * Two-class selector so it outranks the direction rules that precede it. */
@media (prefers-reduced-motion: reduce) {
  .sn-marquee .sn-marquee__track {
    animation: none;
  }
}
</style>