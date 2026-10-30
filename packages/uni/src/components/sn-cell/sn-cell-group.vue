<script setup lang="ts">
/**
 * sn-cell-group (uni-end) — container that groups `sn-cell` rows.
 *
 * Reference library: wot-ui `wd-cell-group`
 *   (https://wot-ui.cn/component/cell.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-cell-group 1:1
 * (`title` / `value` / `border` / `insert` / `custom-class` / `custom-style`).
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-cell/sn-cell-group.vue
 * → auto-registered as `<sn-cell-group>` in any .vue that uses it.
 * (Same directory as sn-cell so the provide/inject contract types stay next to
 * both halves of the pair.)
 *
 * The group owns the card surface and the section heading; the cells inherit
 * `border` / `titleWidth` / `center` / `layout` / `valueAlign` / `card` through
 * `provide`/`inject` (`sn-cell-types.ts`) — wd-cell's documented
 * "继承自 CellGroup" contract.
 *
 * ## Additive: `card` (AUI-OPT-01, AGENTS.md §112.3a)
 *
 * `insert` paints the whole group as one rounded card; `card` (additive) turns
 * every row into its own independent card instead — the group goes transparent,
 * the body gains a token gap and the group outline is dropped (each cell draws
 * its own radius / border / shadow from tokens). `border` stays accepted but
 * has no effect in card mode, so a card group never renders a doubled outline.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 单个单元格的渲染 — 用 sn-cell
 *   - 表单校验 — 用 sn-form-item
 */

import { computed, provide, toRef } from 'vue';
import { SN_CELL_GROUP_KEY } from './sn-cell-types';

defineOptions({ name: 'SnCellGroup' });

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-cell-group` 1:1 surface ─────────────────────────────── */

    /** 分组标题。 */
    title?: string;
    /** 分组右侧内容。 */
    value?: string;
    /** 是否展示外边框。 */
    border?: boolean;
    /** 是否展示为圆角卡片风格。 */
    insert?: boolean;
    /** 分组标题字号（large 档）。 */
    size?: 'default' | 'large';
    /** 单元格布局方式，子单元格继承。 */
    layout?: 'horizontal' | 'vertical';
    /** 右侧内容对齐方式，子单元格继承。 */
    valueAlign?: 'left' | 'right' | 'center';
    /** 左侧标题宽度，子单元格继承。 */
    titleWidth?: string | number | undefined;
    /** 是否使内容垂直居中，子单元格继承。 */
    center?: boolean;
    /** 卡片形态（additive）：每行渲染为独立圆角卡片，组背景透明并以 token 间距分行。 */
    card?: boolean;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: string;
  }>(),
  {
    title: '',
    value: '',
    border: true,
    insert: false,
    size: 'default',
    layout: 'horizontal',
    valueAlign: 'right',
    titleWidth: undefined,
    center: false,
    card: false,
    customClass: '',
    customStyle: '',
  },
);

defineSlots<{
  /** 分组标题区域。 */
  title?(): unknown;
  /** 分组右侧内容区域。 */
  value?(): unknown;
  /** 单元格列表。 */
  default?(): unknown;
}>();

provide(SN_CELL_GROUP_KEY, {
  border: toRef(props, 'border'),
  titleWidth: toRef(props, 'titleWidth'),
  center: toRef(props, 'center'),
  layout: toRef(props, 'layout'),
  valueAlign: toRef(props, 'valueAlign'),
  insert: toRef(props, 'insert'),
  card: toRef(props, 'card'),
});

const rootClass = computed(() => [
  'sn-cell-group',
  {
    'sn-cell-group--insert': props.insert,
    // Card mode owns the row outlines — the group outline would double up.
    'sn-cell-group--bordered': props.border && !props.card,
    'sn-cell-group--large': props.size === 'large',
    'sn-cell-group--card': props.card,
  },
  props.customClass,
]);
</script>

<template>
  <view
    data-snui-component="cell-group"
    :class="rootClass"
    :style="customStyle || undefined"
    role="group"
    :aria-label="title || undefined"
  >
    <view v-if="title || $slots.title || value || $slots.value" class="sn-cell-group__header">
      <view class="sn-cell-group__title">
        <slot name="title">
          <text class="sn-cell-group__title-text">{{ title }}</text>
        </slot>
      </view>
      <view class="sn-cell-group__value">
        <slot name="value">
          <text class="sn-cell-group__value-text">{{ value }}</text>
        </slot>
      </view>
    </view>
    <view :class="['sn-cell-group__body', { 'sn-cell-group__body--card': props.card }]">
      <slot />
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only; geometry in rpx (750 design canvas). */
.sn-cell-group {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: var(--sn-mp-color-background-surface);
}

.sn-cell-group--insert {
  margin: var(--sn-mp-spacing-3);
  border-radius: var(--sn-mp-radius-lg);
  overflow: hidden;
}

/* Card mode (additive): every row paints its own card, so the group goes
   transparent and the body spreads the rows with a token gap. */
.sn-cell-group--card {
  background-color: transparent;
}

.sn-cell-group__body--card {
  gap: var(--sn-mp-spacing-3);
}

.sn-cell-group--bordered {
  border-top: 2rpx solid var(--sn-mp-color-border-subtle);
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle);
}

.sn-cell-group--insert.sn-cell-group--bordered {
  border: 2rpx solid var(--sn-mp-color-border-subtle);
}

.sn-cell-group__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--sn-mp-spacing-3) var(--sn-mp-spacing-4) var(--sn-mp-spacing-2);
}

.sn-cell-group__title {
  display: flex;
  align-items: center;
  min-width: 0;
}

.sn-cell-group__title-text {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-medium);
}

.sn-cell-group--large .sn-cell-group__title-text {
  font-size: var(--sn-mp-font-size-lg);
}

.sn-cell-group__value {
  display: flex;
  align-items: center;
  min-width: 0;
}

.sn-cell-group__value-text {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
}

.sn-cell-group__body {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
