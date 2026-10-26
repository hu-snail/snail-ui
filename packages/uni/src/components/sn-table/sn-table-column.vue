<script setup lang="ts">
/**
 * sn-table-column (uni-end) — one column definition inside a `sn-table`.
 *
 * Reference library: wot-ui `wd-table-column`
 *   (https://wot-ui.cn/component/table.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-table-column 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * Lives next to `sn-table.vue` so the provide/inject contract
 * (`sn-table-types.ts`) stays beside both halves of the pair — the same layout
 * `sn-tabs` / `sn-tab` and `sn-sidebar` / `sn-sidebar-item` use.
 *
 * ## Renders nothing itself
 *
 * The column is a *declaration*: it registers `{ prop, label, width, sortable,
 * fixed, align }` with the container and renders no visible node of its own.
 * The container draws the header and body cells, because column order, sticky
 * offsets and row striping all depend on the full column list. The `value` slot
 * is handed to the container as a render function so it can render inside each
 * body cell with `{ row, index }`.
 *
 * Registration happens in `onMounted`, not during setup — writing to the
 * container's reactive column list while the container itself is rendering
 * would be a recursive update (same reasoning as `sn-tab`).
 *
 * Per AGENTS.md §32 this component handles declaration only.
 *
 * Not responsible for:
 *   - 表头 / 单元格渲染 — 由 sn-table 承担
 *   - 排序算法 — `sort-method` 交给宿主
 */

import { getCurrentInstance, inject, onBeforeUnmount, onMounted, ref, useSlots } from 'vue';
import {
  SN_TABLE_KEY,
  type SnTableAlign,
  type SnTableRow,
  type SnTableSortOrder,
} from './sn-table-types';

defineOptions({ name: 'SnTableColumn' });

/** Default column width in design px (mirrors `wd-table-column` `width`). */
const DEFAULT_COLUMN_WIDTH = 100;

const props = withDefaults(
  defineProps<{
    /** Data field name (required in practice; `''` renders an empty column). */
    prop?: string;
    /** Header label. */
    label?: string;
    /** Column width — a bare number is design px. */
    width?: string | number;
    /** Tapping the header cycles asc → desc → none. */
    sortable?: boolean;
    /** Pin the column to the left edge while the body scrolls horizontally. */
    fixed?: boolean;
    /** Content alignment. */
    align?: SnTableAlign;
  }>(),
  {
    prop: '',
    label: '',
    width: DEFAULT_COLUMN_WIDTH,
    sortable: false,
    fixed: false,
    align: 'left',
  },
);

defineSlots<{
  /** Custom cell content; the slot receives `{ row, index }`. */
  value?(props: { row: SnTableRow; index: number }): unknown;
}>();

const slots = useSlots();
const instance = getCurrentInstance();
const table = inject(SN_TABLE_KEY, null);

/** Sort order this column is currently in (driven by the container). */
const sortOrder = ref<SnTableSortOrder>('none');

/** Stable registration id — the instance uid never collides across columns. */
const uid = instance?.uid ?? 0;

onMounted(() => {
  if (table === null) return;
  table.registerColumn({
    uid,
    getColumn: () => ({
      prop: props.prop,
      label: props.label,
      width: props.width,
      sortable: props.sortable,
      fixed: props.fixed,
      align: props.align,
      sortOrder: sortOrder.value,
    }),
    setSortOrder: (order: SnTableSortOrder) => {
      sortOrder.value = order;
    },
    getValueSlot: () =>
      slots.value as unknown as
        ((props: { row: SnTableRow; index: number }) => unknown) | undefined,
  });
});

onBeforeUnmount(() => {
  // §41: drop the registration so a removed column stops occupying a slot.
  table?.unregisterColumn(uid);
});
</script>

<template>
  <view v-if="false" data-snui-component="table-column" aria-hidden="true" />
</template>

<style scoped>
/* No styles: this component renders no visible node. */
</style>
