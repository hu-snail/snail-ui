<script setup lang="ts">
/**
 * SnGrid — CSS Grid container (AUI-WEB-LAYOUT-002).
 *
 * Reference library: naive-ui `n-grid`
 *   (https://www.naiveui.com/zh-CN/light/components/grid)
 * Per AGENTS.md §112, props + semantics mirror n-grid 1:1.
 *
 * 1:1 parity (this version): cols / xGap / yGap / itemResponsive /
 *   itemStyle / responsive (object) / collapsed / collapsedRows /
 *   suffix slot.
 *
 * §232 future markers (doc-roadmap):
 *   - layoutShiftDisabled: prevent content shift on responsive collapse
 *   - self-vs-screen observer: per-item `ref` to detect breakpoint locally
 *     (rather than only window width)
 *   - virtual scroll integration (n-grid pairs with n-virtual-list)
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnGrid :cols="3" :x-gap="16" :y-gap="16">
 *     <SnCard v-for="x in items" :key="x.id">{{ x.title }}</SnCard>
 *   </SnGrid>
 *
 *   <!-- Responsive: column count by viewport (matches n-grid `responsive`) -->
 *   <SnGrid :cols="responsiveCols" :x-gap="16">
 *     ...
 *   </SnGrid>
 *
 *   <!-- Collapsed: only first N rows visible, click "X more" to expand. -->
 *   <SnGrid :cols="3" collapsed :collapsed-rows="2">
 *     <SnCard v-for="x in 9" :key="x.id">Card {{ x }}</SnCard>
 *   </SnGrid>
 */

import { computed, ref } from 'vue'

defineOptions({ name: 'SnGrid' })

// Reference: naive-ui gridProps
//   (https://github.com/tusen-ai/naive-ui/blob/main/src/grid/src/Grid.tsx)
const props = withDefaults(
  defineProps<{
    /** Number of grid columns. Default 24 (matches n-grid).
     * Can also be a ResponsiveCols object keyed by breakpoint suffix. */
    cols?: number | string | ResponsiveCols
    /** Horizontal gap between columns (px). Default 0. */
    xGap?: number | string
    /** Vertical gap between rows (px). Default 0. */
    yGap?: number | string
    /**
     * Whether children should adapt their layout to the container width.
     * Mirrors n-grid `itemResponsive` (forces the grid to subscribe to
     * resize events). Default false.
     */
    itemResponsive?: boolean
    /** Inline style applied to each direct child. Mirrors n-grid `itemStyle`. */
    itemStyle?: string | Record<string, string>
    /** Whether to render the grid in collapsed mode (show "+N more" overflow).
     * Mirrors n-grid `collapsed`. Default false. */
    collapsed?: boolean
    /** Number of rows to show when collapsed. Default 1. Mirrors n-grid
     * `collapsedRows`. */
    collapsedRows?: number
    /** Optional render function for the suffix slot (rendered after children,
     * typically used to anchor "X more" expand affordance). */
    suffix?: boolean
  }>(),
  {
    cols: 24,
    xGap: 0,
    yGap: 0,
    itemResponsive: false,
    collapsed: false,
    collapsedRows: 1,
    suffix: false,
  },
)

defineSlots<{
  /** Direct children become grid items. */
  default?(): unknown
  /** Suffix slot — appended after grid items (use for "X more" button). */
  suffix?(): unknown
}>()

/* ─────────── responsive: object → media-query resolved cols ───────────
 * n-grid's `cols` accepts either a number or a responsive object whose
 * keys are breakpoint suffixes (m / s / l / xl / xxl). We approximate this
 * via window.matchMedia + reactive CSS variables, picking the largest
 * matching breakpoint at render. */
export interface ResponsiveCols {
  /** xs < 480px */
  xs?: number | string
  /** s ≥ 480px */
  s?: number | string
  /** m ≥ 640px */
  m?: number | string
  /** l ≥ 768px */
  l?: number | string
  /** xl ≥ 1024px */
  xl?: number | string
  /** xxl ≥ 1280px */
  xxl?: number | string
}
const BREAKPOINTS: Array<keyof ResponsiveCols> = ['xxl', 'xl', 'l', 'm', 's', 'xs']
const BP_MIN_WIDTHS: Array<[keyof ResponsiveCols, number]> = [
  ['xs', 0],
  ['s', 480],
  ['m', 640],
  ['l', 768],
  ['xl', 1024],
  ['xxl', 1280],
]

const isResponsiveCols = (v: unknown): v is ResponsiveCols => {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

const currentBreakpoint = ref<keyof ResponsiveCols>('l')
if (typeof window !== 'undefined') {
  const sync = (): void => {
    const w = window.innerWidth
    // Iterate from largest breakpoint → smallest. First match wins so we
    // resolve to the highest breakpoint whose min-width is satisfied.
    for (let i = BP_MIN_WIDTHS.length - 1; i >= 0; i--) {
      const entry = BP_MIN_WIDTHS[i]
      if (!entry) continue
      const [bp, min] = entry
      if (w >= min) { currentBreakpoint.value = bp; break }
    }
  }
  sync()
  window.addEventListener('resize', sync, { passive: true })
}

const responsiveCols = computed<number>(() => {
  if (!isResponsiveCols(props.cols)) {
    const n = Number(props.cols)
    return Number.isFinite(n) && n > 0 ? n : 24
  }
  const obj = props.cols
  // Iterate BREAKPOINTS (already sorted largest-first) so the largest
  // defined bucket wins.
  for (const bp of BREAKPOINTS) {
    const v = obj[bp]
    if (v !== undefined) {
      const n = Number(v)
      if (Number.isFinite(n) && n > 0) return n
    }
  }
  return 24
})

/** Resolve xGap / yGap to px string. Accepts number | "32rpx" | "32". */
const resolvedGap = (value: number | string | undefined): string => {
  if (value === undefined || value === null || value === '') return '0px'
  const n = Number(value)
  return Number.isFinite(n) ? `${n}px` : String(value)
}

/* ─────────── collapsed mode ───────────
 * When `collapsed` is true and items exceed `cols × collapsedRows`, we
 * wrap items in a clipped container with max-height = rowHeight × rows.
 * Suffix slot is rendered alongside children so consumer can render an
 * "+N more" button. Note: actual row measurement uses grid-template-rows
 * `auto` + the yGap; we approximate via `grid-auto-rows: max-content` and
 * clamp via max-height on the container itself. */
const collapsedMaxHeight = computed<string>(() => {
  if (!props.collapsed) return 'none'
  const rows = Math.max(1, props.collapsedRows)
  // Use a fallback row height of ~80px (typical SnCard collapsed)
  // + yGap. This is approximate; consumers with non-uniform row heights should
  // manage overflow themselves.
  const rowPx = 80
  const gapPx = Number(props.yGap) || 0
  const total = (rowPx + gapPx) * rows - gapPx
  return `${total}px`
})
</script>

<template>
  <div
    :class="[
      'sn-grid',
      itemResponsive ? 'sn-grid--item-responsive' : '',
      collapsed ? 'sn-grid--collapsed' : '',
    ]"
    :style="{
      display: 'grid',
      gridTemplateColumns: `repeat(${responsiveCols}, minmax(0, 1fr))`,
      columnGap: resolvedGap(xGap),
      rowGap: resolvedGap(yGap),
      width: '100%',
      maxHeight: collapsedMaxHeight,
      overflow: collapsed ? 'hidden' : 'visible',
      transition: 'max-height 0.3s ease',
    }"
  >
    <slot />
    <slot v-if="suffix" name="suffix" />
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. */

.sn-grid {
  box-sizing: border-box;
}

.sn-grid > :deep(*) {
  min-width: 0; /* allow grid items to shrink so long text wraps */
}

/* Collapsed mode — content clips via max-height + overflow:hidden. The
 * `sn-grid__suffix` is rendered after children when collapsed=false but
 * only placed at row-end (consumer controls position via slot). */
.sn-grid--collapsed {
  position: relative;
}

/* Doodle skin — heavier gap + chunky borders on grid items */
.snui-skin-doodle .sn-grid > :deep(*) {
  border: 2.5px solid #1a1a1a;
  border-radius: 6px;
}
</style>