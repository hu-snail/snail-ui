<script setup lang="ts">
/**
 * SnLoadingSpinner — internal spinner graphic for SnLoading.
 *
 * Not part of the public API and not exported from the package entry; it
 * exists so the bare and wrapped render paths in `SnLoading.vue` share one
 * SVG definition instead of duplicating the SMIL arcs.
 *
 * The arc geometry mirrors naive-ui's `NBaseLoading`: an SVG circle whose
 * stroke is a rounded dash, animated by two SMIL tracks — a continuous
 * `0→270°` sweep of the wrapper group and a `0→135°→450°` sweep of the circle
 * itself, plus a dash-offset pulse. SMIL is used rather than a CSS rotation
 * because it produces the "arc grows then chases" look upstream has; a plain
 * CSS spin would just rotate a static arc.
 */

defineOptions({ name: 'SnLoadingSpinner' })

const props = withDefaults(
  defineProps<{
    /** SVG arc radius in design units. */
    radius?: number
    /** Scale factor applied to `radius`. */
    scale?: number
    /** Arc stroke width in SVG units. */
    strokeWidth?: number
  }>(),
  {
    radius: 100,
    scale: 1,
    strokeWidth: 28,
  },
)

/** SMIL cycle length, matching upstream's `duration` constant. */
const ROTATION_DURATION = '1.6s'

const scaledRadius = props.radius / props.scale
/** Upstream insets the sweeping circle by half the stroke width. */
const circleRadius = props.radius - props.strokeWidth / 2
const circumference = 2 * Math.PI * circleRadius
/** Upstream draws a fixed 0.9-of-circumference arc, offset by 0.75. */
const dashArray = (0.9 * circumference).toFixed(3)
const dashOffset = (0.75 * circumference).toFixed(3)
const dashOffsetMin = (0.25 * circumference).toFixed(3)
</script>

<template>
  <svg
    class="sn-loading-spinner__svg"
    :viewBox="`0 0 ${2 * scaledRadius} ${2 * scaledRadius}`"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <g>
      <animateTransform
        attributeName="transform"
        type="rotate"
        :values="`0 ${scaledRadius} ${scaledRadius};270 ${scaledRadius} ${scaledRadius}`"
        begin="0s"
        :dur="ROTATION_DURATION"
        fill="freeze"
        repeatCount="indefinite"
      />
      <circle
        fill="none"
        stroke="currentColor"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        :cx="scaledRadius"
        :cy="scaledRadius"
        :r="circleRadius"
        :stroke-dasharray="dashArray"
        :stroke-dashoffset="dashOffset"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          :values="`0 ${scaledRadius} ${scaledRadius};135 ${scaledRadius} ${scaledRadius};450 ${scaledRadius} ${scaledRadius}`"
          begin="0s"
          :dur="ROTATION_DURATION"
          fill="freeze"
          repeatCount="indefinite"
        />
        <animate
          attributeName="stroke-dashoffset"
          :values="`${dashArray};${dashOffsetMin};${dashArray}`"
          begin="0s"
          :dur="ROTATION_DURATION"
          fill="freeze"
          repeatCount="indefinite"
        />
      </circle>
    </g>
  </svg>
</template>

<style scoped>
.sn-loading-spinner__svg {
  height: 100%;
  width: 100%;
  display: block;
}
</style>
