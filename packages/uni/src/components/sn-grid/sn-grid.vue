<script setup lang="ts">
/**
 * sn-grid (uni-end) — icon / text grid (宫格).
 *
 * Reference library: wot-ui `wd-grid`
 *   (https://wot-ui.cn/component/grid.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-grid 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-grid/sn-grid.vue
 * → auto-registered as `<sn-grid>` in any .vue that uses it.
 *
 * ## Why the border is drawn by the container
 *
 * A grid border is a set of internal hairlines, not a frame around each cell —
 * drawing it per cell doubles the lines between neighbours. The container
 * therefore renders the horizontal rules itself (one per row via `::after` on
 * the row wrapper) and lets `border` mean "show the internal lines".
 *
 * ## Square cells without JS
 *
 * `square` uses the padding-box trick (`padding-top: 100%`) so a cell is
 * square at any width, with no measurement and no resize listener (§41).
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 单个格子内容 — 用 sn-grid-item
 *   - 栅格布局 — 用 sn-layout / sn-col
 */

import { computed, provide, toRef } from 'vue'
import { SN_GRID_KEY, type SnGridDirection } from './sn-grid-types'

defineOptions({ name: 'SnGrid' })

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-grid` 1:1 surface ───────────────────────────────────── */

    /** 列数。 */
    column?: number
    /** 是否显示边框。 */
    border?: boolean
    /** 格子之间的间距，默认单位为 px。 */
    gutter?: number
    /** 是否将格子固定为正方形。 */
    square?: boolean
    /** 是否开启格子点击反馈。 */
    clickable?: boolean
    /** 背景颜色设置（内联覆盖，空 = 令牌默认）。 */
    bgColor?: string
    /** 指定 grid-item 按下去的样式类。 */
    hoverClass?: string
    /** 是否将格子内容居中显示。 */
    center?: boolean
    /** 格子内容排列的方向：horizontal / vertical。 */
    direction?: SnGridDirection
    /** 是否调换图标和文本的位置。 */
    reverse?: boolean
    /** 图标大小，默认单位为 px。 */
    iconSize?: string
    /** 根节点自定义类名。 */
    customClass?: string
    /** 根节点自定义样式。 */
    customStyle?: string
  }>(),
  {
    column: 3,
    border: false,
    gutter: 0,
    square: false,
    clickable: false,
    bgColor: '',
    hoverClass: 'sn-grid-item__content--hover',
    center: true,
    direction: 'vertical',
    reverse: false,
    iconSize: '28px',
    customClass: '',
    customStyle: '',
  },
)

defineSlots<{
  /** 宫格内容（sn-grid-item 列表）。 */
  default?(): unknown
}>()

provide(SN_GRID_KEY, {
  column: toRef(props, 'column'),
  gutter: toRef(props, 'gutter'),
  square: toRef(props, 'square'),
  clickable: toRef(props, 'clickable'),
  hoverClass: toRef(props, 'hoverClass'),
  center: toRef(props, 'center'),
  direction: toRef(props, 'direction'),
  reverse: toRef(props, 'reverse'),
  iconSize: toRef(props, 'iconSize'),
})

const rootClass = computed(() => [
  'sn-grid',
  {
    'sn-grid--border': props.border,
    'sn-grid--clickable': props.clickable,
    'sn-grid--square': props.square,
  },
  props.customClass,
])

const rootStyle = computed(() => {
  const parts: string[] = []
  if (props.gutter > 0) parts.push(`padding: ${props.gutter / 2}px`)
  if (props.bgColor) parts.push(`background-color: ${props.bgColor}`)
  if (props.customStyle) parts.push(props.customStyle)
  return parts.length > 0 ? parts.join('; ') : undefined
})
</script>

<template>
  <view
    data-snui-component="grid"
    :class="rootClass"
    :style="rootStyle"
    role="list"
  >
    <slot />
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only; geometry in rpx (750 design canvas). */
.sn-grid {
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  width: 100%;
  background-color: var(--sn-mp-color-background-surface);
}

.sn-grid--border {
  border-top: 2rpx solid var(--sn-mp-color-border-subtle);
  border-left: 2rpx solid var(--sn-mp-color-border-subtle);
}

.sn-grid--border :deep(.sn-grid-item) {
  border-right: 2rpx solid var(--sn-mp-color-border-subtle);
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle);
}
</style>
