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
 * `insert` paints the whole group as one rounded card; `card` (additive) is
 * the elevated form of the same idea — the whole group renders as ONE card
 * (token radius / border / shadow), rows separated by the cells' inner
 * hairlines instead of per-row cards. A standalone `sn-cell card` still makes
 * that single row a card; inside a card group rows stay plain unless a cell
 * explicitly opts in. `border` draws the container outline in card mode, so
 * the card never doubles up with per-row outlines.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 单个单元格的渲染 — 用 sn-cell
 *   - 表单校验 — 用 sn-form-item
 */

import { computed, provide, ref, toRef } from 'vue';
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
    /** 卡片形态（additive）：整组渲染为一张圆角卡片，行间以内嵌分割线分开。 */
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

/** Child-cell registry: cells register on mount so the group knows which row
 * is last and that row can drop its hairline (App has no :last-child, §116.2).
 * Mount order matches DOM order for static and keyed lists. */
let cellSeq = 0;
const cellIds = ref<number[]>([]);

function registerCell(): { id: number; unregister: () => void } {
  const id = ++cellSeq;
  cellIds.value = [...cellIds.value, id];
  return {
    id,
    unregister: () => {
      cellIds.value = cellIds.value.filter((x) => x !== id);
    },
  };
}

const lastCellId = computed(() => {
  const ids = cellIds.value;
  return ids.length > 0 ? (ids[ids.length - 1] ?? 0) : 0;
});

provide(SN_CELL_GROUP_KEY, {
  border: toRef(props, 'border'),
  titleWidth: toRef(props, 'titleWidth'),
  center: toRef(props, 'center'),
  layout: toRef(props, 'layout'),
  valueAlign: toRef(props, 'valueAlign'),
  insert: toRef(props, 'insert'),
  registerCell,
  lastCellId,
});

const rootClass = computed(() => [
  'sn-cell-group',
  {
    'sn-cell-group--insert': props.insert,
    // Card mode draws its container outline through the bordered combo too.
    'sn-cell-group--bordered': props.border,
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
    <view class="sn-cell-group__body">
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

/* Rounded container shared by insert (wot-ui parity) and card (additive):
 * the whole group becomes ONE card; rows inside stay contiguous and are
 * separated by the cells' own hairlines. Horizontal margin stays 0 — the
 * hosting page owns the gutter, so cards align with every other section. */
.sn-cell-group--insert,
.sn-cell-group--card {
  margin: var(--sn-mp-spacing-3) 0;
  border-radius: var(--sn-mp-radius-lg);
  overflow: hidden;
}

/* Card mode (additive) — the elevated card look: token shadow on top of the
   insert container treatment. */
.sn-cell-group--card {
  box-shadow: var(--sn-mp-shadow-sm);
}

.sn-cell-group--bordered {
  border-top: 2rpx solid var(--sn-mp-color-border-subtle);
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle);
}

.sn-cell-group--insert.sn-cell-group--bordered,
.sn-cell-group--card.sn-cell-group--bordered {
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
