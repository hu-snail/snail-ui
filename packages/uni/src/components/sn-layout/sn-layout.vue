<script setup lang="ts">
/**
 * sn-layout (uni-end) — 24-column flex row that hosts `sn-col` cells.
 *
 * Reference library: wot-ui `wd-row`
 *   (https://wot-ui.cn/component/layout.html)
 * Per AGENTS.md §112, the prop surface below mirrors the row half of
 * wd-layout 1:1 (`gutter` / `justify` / `align` / `custom-class` /
 * `custom-style`); the column half lives in `sn-col.vue`.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-layout/sn-layout.vue
 * → auto-registered as `<sn-layout>` in any .vue that uses it.
 * Columns live beside it as `<sn-col>` (components/sn-layout/sn-col.vue).
 *
 * ## Gutter is a negative margin, not a gap
 *
 * A flex `gap` cannot express "columns touch the row edge" the way a grid
 * gutter does: the row has to pull out by half a gutter on each side so the
 * first and last column stay flush with the container. The row therefore
 * publishes `--snui-row-gutter` and the column reads it back for its own
 * horizontal padding — one variable, no per-column prop threading.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 列宽度 / 偏移 — 用 sn-col 的 span / offset
 *   - 宫格布局 — 用 sn-grid
 */

import { computed, provide, toRef } from 'vue';
import { SN_LAYOUT_KEY, type SnLayoutAlign, type SnLayoutJustify } from './sn-layout-types';

defineOptions({ name: 'SnLayout' });

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-row` 1:1 surface ────────────────────────────────────── */

    /** 列元素之间的间距（单位为 px）。 */
    gutter?: number;
    /** 主轴对齐方式。 */
    justify?: SnLayoutJustify;
    /** 交叉轴对齐方式。 */
    align?: SnLayoutAlign;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: string;
  }>(),
  {
    gutter: 0,
    justify: 'start',
    align: 'top',
    customClass: '',
    customStyle: '',
  },
);

defineSlots<{
  /** 行内容（sn-col 列表）。 */
  default?(): unknown;
}>();

provide(SN_LAYOUT_KEY, { gutter: toRef(props, 'gutter') });

const rootClass = computed(() => [
  'sn-layout',
  `sn-layout--justify-${props.justify}`,
  `sn-layout--align-${props.align}`,
  props.customClass,
]);

const rootStyle = computed(() => {
  const parts: string[] = [];
  if (props.gutter > 0) {
    parts.push(`margin-left: ${-props.gutter / 2}px`, `margin-right: ${-props.gutter / 2}px`);
  }
  if (props.customStyle) parts.push(props.customStyle);
  return parts.length > 0 ? parts.join('; ') : undefined;
});
</script>

<template>
  <view data-snui-component="layout" :class="rootClass" :style="rootStyle">
    <slot />
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only; geometry in rpx (750 design canvas). */
.sn-layout {
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  width: 100%;
}

.sn-layout--justify-start {
  justify-content: flex-start;
}
.sn-layout--justify-center {
  justify-content: center;
}
.sn-layout--justify-end {
  justify-content: flex-end;
}
.sn-layout--justify-space-between {
  justify-content: space-between;
}
.sn-layout--justify-space-around {
  justify-content: space-around;
}
.sn-layout--justify-space-evenly {
  justify-content: space-evenly;
}

.sn-layout--align-top {
  align-items: flex-start;
}
.sn-layout--align-middle {
  align-items: center;
}
.sn-layout--align-bottom {
  align-items: flex-end;
}
</style>
