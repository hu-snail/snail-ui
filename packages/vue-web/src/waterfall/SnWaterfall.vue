<script setup lang="ts">
/**
 * SnWaterfall — slot-driven masonry container (瀑布流) (AUI-WEB-DD-030).
 *
 * Reference library: **none**. naive-ui has NO masonry / waterfall
 * component (no `n-waterfall` in its `src/components.ts` export list, and
 * `n-grid` only lays out uniform rows). Per AGENTS.md §112 that is a
 * deliberate, documented divergence: there is no upstream API to mirror
 * 1:1, so this component defines the surface itself instead of bending a
 * row/grid component into a masonry one.
 *
 * Layout technique: CSS multi-column distribution — the same technique
 * this repo already uses for its own docs demo grid
 * (`apps/docs/.vitepress/utils/demo-grid.ts` groups each demo section
 * into `.sn-demo-grid` / `.sn-demo-cell`; `apps/docs/.vitepress/theme/
 * custom.css` §13 "Demo cards — waterfall layout" declares `column-count`
 * / `column-gap` on the group and `break-inside: avoid` on the cards).
 * Each column packs on its own, so a short column never leaves a hole
 * beside a tall one — the exact failure mode of a row / `grid` layout,
 * where the tallest cell sets the row height for everyone.
 *
 * Why there is no JS in here:
 *   - No `ResizeObserver`, no scroll listener, no measuring pass: the
 *     browser re-flows the columns on its own, so there is nothing to
 *     dispose (AGENTS.md §41 / §82 hold vacuously).
 *   - The trade-off is column-major order — items fill column 1 to the
 *     bottom, then column 2 — where a JS-positioned masonry could order
 *     them top-to-bottom, left-to-right.
 *   - `columns` is a hint: the browser may render fewer columns when the
 *     available width cannot hold them.
 *
 * Slot handling: every direct child of `default` is wrapped in one
 * `.sn-waterfall__item` box and the boxes are distributed into the
 * columns. Fragment children (`<template v-for>` over a data list) are
 * flattened recursively with the same `flattenSlotChildren` shape
 * `SnDescriptions` uses, so v-for-driven item lists work. Comment
 * placeholders (what a `v-if="false"` in the slot leaves behind) are
 * dropped instead of becoming an empty — yet still spaced — item box.
 *
 * Documented divergences:
 *   - No naive-ui counterpart (see above) — nothing to be 1:1 with.
 *   - `role="list"` on the root + `role="listitem"` on each item box are
 *     applied: wrapping each slot child is unavoidable, and the result is
 *     exactly the ARIA list pattern (`div[role=list]` > `div[role=listitem]`).
 *     A consumer that needs other semantics can override the root role
 *     through fallthrough attrs (`:role="…"`).
 *   - The trailing `row-gap` is kept: the last item carries a
 *     `margin-bottom` too, mirroring the in-repo demo grid. The container
 *     height therefore stays predictable (and does not jump when items are
 *     appended). Set `row-gap="0"` for a flush bottom edge.
 *   - When `minColumnWidth` is set the container switches to `column-width`
 *     and the `columns` prop is ignored (responsive mode) — the column
 *     count then follows the available width.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web. It is a
 * pure layout container that paints nothing of its own, so it consumes no
 * `--sn-web-*` alias; the only knobs are its two component-scoped custom
 * properties (px units only).
 *
 * Usage:
 *   <SnWaterfall :columns="3" :row-gap="12">
 *     <SnCard v-for="item in items" :key="item.id" />
 *   </SnWaterfall>
 *
 *   <!-- responsive: as many ~200px columns as fit -->
 *   <SnWaterfall :min-column-width="200">…</SnWaterfall>
 */

import type { VNodeChild } from 'vue'
import { Comment, Fragment, computed, isVNode, useSlots } from 'vue'

defineOptions({ name: 'SnWaterfall' })

const props = withDefaults(
  defineProps<{
    /** Logical column count (integer ≥ 1), applied as `column-count`.
     *  Ignored when `minColumnWidth` is set, and when `masonry` is off. */
    columns?: number
    /** Minimum column width. When set the container uses `column-width`
     *  instead of `column-count`, so the column count follows the
     *  available width (responsive mode) and `columns` is ignored. */
    minColumnWidth?: number | string
    /** Gap between columns (number → px). */
    columnGap?: number | string
    /** Gap between items (number → px); applied as the bottom margin of
     *  each item box. */
    rowGap?: number | string
    /** Convenience "off" switch: `false` renders a plain vertical stack
     *  (single column, no multi-column layout). */
    masonry?: boolean
  }>(),
  {
    columns: 3,
    columnGap: 16,
    rowGap: 16,
    masonry: true,
  },
)

defineSlots<{
  /** Items — each direct child becomes one `.sn-waterfall__item` box. */
  default?(): unknown
}>()

const slots = useSlots()

/** Functional fragment: renders a captured array of slot vnodes. */
const VNodes = (props: { nodes: VNodeChild[] }): VNodeChild => props.nodes

/** Number → px, string → passthrough (`'12rem'`, `'2vw'`, …). */
function formatLength(value: string | number): string {
  return typeof value === 'number' ? `${value}px` : value
}

function flattenSlotChildren(children: unknown): VNodeChild[] {
  const out: VNodeChild[] = []
  const walk = (input: unknown): void => {
    if (Array.isArray(input)) {
      input.forEach(walk)
      return
    }
    if (input === null || input === undefined || typeof input === 'boolean') {
      return
    }
    // `<template v-for>` compiles to a Fragment vnode holding the repeated
    // items; recurse so data-driven item lists work.
    if (isVNode(input) && input.type === Fragment) {
      walk(input.children)
      return
    }
    // A `v-if="false"` inside the slot leaves a Comment placeholder behind;
    // it must not become an item box (each box carries a `row-gap` margin,
    // so an empty box punches a hole into its column).
    if (isVNode(input) && input.type === Comment) {
      return
    }
    out.push(input as VNodeChild)
  }
  walk(children)
  return out
}

/** One item box per flattened slot child, in slot order. */
function resolveItems(): VNodeChild[] {
  const slot = slots.default
  return slot ? flattenSlotChildren(slot()) : []
}

/** `columns` coerced to an integer ≥ 1 (`column-count` must be ≥ 1). */
const columnCount = computed(() => {
  const value = props.columns
  return typeof value === 'number' && Number.isFinite(value) && value >= 1
    ? Math.floor(value)
    : 1
})

/** The gaps are always exposed; the column geometry only in masonry mode.
 *  Anything derived from a prop is inlined so the static rule set stays in
 *  `<style scoped>` and the two custom properties stay retunable. */
function rootStyle(): Record<string, string> {
  const style: Record<string, string> = {
    '--sn-waterfall-column-gap': formatLength(props.columnGap),
    '--sn-waterfall-row-gap': formatLength(props.rowGap),
  }
  if (!props.masonry) return style

  const minWidth = props.minColumnWidth
  if (minWidth === undefined || minWidth === '') {
    style.columnCount = String(columnCount.value)
  } else {
    style.columnWidth = formatLength(minWidth)
  }
  return style
}
</script>

<template>
  <div
    data-snui-component="waterfall"
    class="sn-waterfall"
    :class="masonry ? 'sn-waterfall--masonry' : 'sn-waterfall--stacked'"
    role="list"
    :style="rootStyle()"
  >
    <div
      v-for="(node, index) in resolveItems()"
      :key="index"
      class="sn-waterfall__item"
      role="listitem"
    >
      <VNodes :nodes="[node]" />
    </div>
  </div>
</template>

<style scoped>
/* Web side: layout only — no color alias is consumed, so there is nothing
 * that can leak a wrong-end alias
 * (`pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-waterfall {
  /* Component-scoped knobs. Both are inlined from the `column-gap` /
   * `row-gap` props; these declarations are the literal fallback for a
   * consumer that clears them. */
  --sn-waterfall-column-gap: 16px;
  --sn-waterfall-row-gap: 16px;
  display: block;
  width: 100%;
  box-sizing: border-box;
}

/* Masonry mode: CSS multi-column distribution (same technique as this
 * repo's own docs demo grid). No `column-count` / `column-width` here on
 * purpose — that value is prop-driven and inlined, and an inline
 * declaration would win over the class anyway. */
.sn-waterfall--masonry {
  column-gap: var(--sn-waterfall-column-gap, 16px);
}

/* One item box. `break-inside: avoid` (plus its legacy spellings) keeps an
 * item in one piece, so a column break can only ever land between items.
 * The column gap owns the horizontal spacing and each item owns the
 * vertical one. */
.sn-waterfall__item {
  break-inside: avoid;
  -webkit-column-break-inside: avoid;
  page-break-inside: avoid;
  margin-bottom: var(--sn-waterfall-row-gap, 16px);
  min-width: 0;
  box-sizing: border-box;
}

/* Off switch: a plain vertical stack — no multi-column layout at all. */
.sn-waterfall--stacked {
  columns: unset;
}
</style>