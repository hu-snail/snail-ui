<script setup lang="ts">
/**
 * sn-col (uni-end) — 24-column grid cell for `sn-layout`.
 *
 * Reference library: wot-ui `wd-col`
 *   (https://wot-ui.cn/component/layout.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-col 1:1
 * (`span` / `offset` / `custom-class` / `custom-style`).
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-layout/sn-col.vue
 * → auto-registered as `<sn-col>` in any .vue that uses it.
 *
 * ## Widths are inline, not class-generated
 *
 * A 24 × 24 class matrix would be ~576 rules for one component. The width is
 * therefore a single inline `flex-basis` computed from `span`, and `offset`
 * becomes a `margin-left`. Both stay exact at every breakpoint because the
 * units are percentages of the row, not fixed lengths.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 行级对齐 — 用 sn-layout 的 justify / align
 *   - 响应式断点 — uni 端无统一断点，由宿主媒体查询处理
 */

import { computed, inject } from 'vue'
import { SN_LAYOUT_KEY } from './sn-layout-types'

defineOptions({ name: 'SnCol' })

/** Total columns in the grid. */
const GRID_COLUMNS = 24

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-col` 1:1 surface ────────────────────────────────────── */

    /** 列元素宽度（栅格占据的列数，共 24 列）。 */
    span?: number
    /** 列元素偏移距离（栅格左侧的间隔列数）。 */
    offset?: number
    /** 根节点自定义类名。 */
    customClass?: string
    /** 根节点自定义样式。 */
    customStyle?: string
  }>(),
  {
    span: 24,
    offset: 0,
    customClass: '',
    customStyle: '',
  },
)

defineSlots<{
  /** 列内容。 */
  default?(): unknown
}>()

const layout = inject(SN_LAYOUT_KEY, null)

/** Clamp span into 1…24 so a typo cannot produce an invisible column. */
const clampedSpan = computed(() => Math.min(Math.max(1, props.span), GRID_COLUMNS))
const clampedOffset = computed(() => Math.min(Math.max(0, props.offset), GRID_COLUMNS - 1))

const rootClass = computed(() => ['sn-col', props.customClass])

const rootStyle = computed(() => {
  const parts: string[] = []
  const gutter = layout?.gutter.value ?? 0
  if (gutter > 0) parts.push(`padding-left: ${gutter / 2}px`, `padding-right: ${gutter / 2}px`)
  parts.push(`flex: 0 0 ${(clampedSpan.value / GRID_COLUMNS) * 100}%`)
  parts.push(`max-width: ${(clampedSpan.value / GRID_COLUMNS) * 100}%`)
  if (clampedOffset.value > 0) {
    parts.push(`margin-left: ${(clampedOffset.value / GRID_COLUMNS) * 100}%`)
  }
  if (props.customStyle) parts.push(props.customStyle)
  return parts.join('; ')
})
</script>

<template>
  <view
    data-snui-component="col"
    :class="rootClass"
    :style="rootStyle"
  >
    <slot />
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only; geometry in rpx (750 design canvas). */
.sn-col {
  box-sizing: border-box;
  min-width: 0;
}
</style>
