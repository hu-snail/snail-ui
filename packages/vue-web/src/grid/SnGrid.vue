<script setup lang="ts">
/**
 * SnGrid — CSS Grid container (AUI-WEB-LAYOUT-002).
 *
 * Reference library: naive-ui `n-grid`
 *   (https://www.naiveui.com/zh-CN/light/components/grid)
 * Per AGENTS.md §112, prop names + defaults + control semantics mirror n-grid.
 * Advanced n-grid features (suffix, collapsed, collapsedRows,
 * layoutShiftDisabled, self-vs-screen responsive breakpoint observer) are
 * §112 future markers — not implemented in v0.1 because the docs-site use
 * case is plain N-column equal-width responsive grid. Add when a consumer
 * needs them.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnGrid :cols="3" :x-gap="16" :y-gap="16">
 *     <div v-for="x in items" :key="x.id">{{ x.title }}</div>
 *   </SnGrid>
 */

defineOptions({ name: 'SnGrid' })

// Reference: naive-ui gridProps
//   (https://github.com/tusen-ai/naive-ui/blob/main/src/grid/src/Grid.tsx)
const props = withDefaults(
  defineProps<{
    /** Number of grid columns. Default 24 (matches n-grid). */
    cols?: number | string
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
  }>(),
  {
    cols: 24,
    xGap: 0,
    yGap: 0,
    itemResponsive: false,
  },
)

defineSlots<{
  /** Direct children become grid items. */
  default?(): unknown
}>()

/** Resolve cols to a numeric value for `grid-template-columns`. */
const resolvedCols = (): number => {
  const n = Number(props.cols)
  return Number.isFinite(n) && n > 0 ? n : 24
}

/** Resolve xGap / yGap to px string. Accepts number | "32rpx" | "32". */
const resolvedGap = (value: number | string | undefined): string => {
  if (value === undefined || value === null || value === '') return '0px'
  const n = Number(value)
  return Number.isFinite(n) ? `${n}px` : String(value)
}
</script>

<template>
  <div
    :class="['sn-grid', itemResponsive ? 'sn-grid--item-responsive' : '']"
    :style="{
      display: 'grid',
      gridTemplateColumns: `repeat(${resolvedCols()}, minmax(0, 1fr))`,
      columnGap: resolvedGap(xGap),
      rowGap: resolvedGap(yGap),
      width: '100%',
    }"
  >
    <slot />
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

/* Doodle skin — heavier gap + chunky borders on grid items */
.snui-skin-doodle .sn-grid > :deep(*) {
  border: 2.5px solid #1a1a1a;
  border-radius: 6px;
}
</style>