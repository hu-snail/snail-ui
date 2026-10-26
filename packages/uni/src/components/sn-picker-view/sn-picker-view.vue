<script setup lang="ts">
/**
 * sn-picker-view (uni-end) — multi-column roller picker body.
 *
 * Reference library: wot-ui `wd-picker-view`
 *   (https://wot-ui.cn/component/picker-view.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-picker-view 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-picker-view/sn-picker-view.vue
 * → auto-registered as `<sn-picker-view>` in any .vue that uses it.
 *
 * ## Why a hand-built roller instead of the native `<picker-view>`
 *
 * Per CONTRIBUTING §2.3 the uni-end templates may only use cross-end
 * primitives (`view` / `text` / `image` / `scroll-view` / `input` …). The
 * native `picker-view` element is not in that allowlist, so the roller is
 * built from `<view>` + `transform: translateY()` driven by touch events.
 * Geometry stays in `rpx` (1px = 2rpx design) so the wheel snaps on every
 * screen density.
 *
 * ## Touch lifecycle (AGENTS.md §41)
 *
 * The gesture math lives in `sn-picker-view-drag.ts` (shared with
 * `sn-datetime-picker-view`): no global listeners, no timers, no observers.
 * Drag state is plain component state that is reset on `touchend` /
 * `touchcancel` and dies with the component. Nothing to dispose.
 *
 * The column binds `@touchmove.stop.prevent` — `.stop` compiles to
 * `catchtouchmove` on mini-programs so the page cannot scroll the gesture
 * away (the old "滑不动"), and `.prevent` blocks native scroll on H5 / App.
 *
 * ## Desktop H5 input — mouse drag + wheel (additive, AGENTS.md §112)
 *
 * `bindMouseGestures` from the shared engine is attached to the root element
 * on mount — browser hosts only, mini-programs have no `document`. A mouse
 * drag runs the same drag core as touch; the wheel advances one committed row
 * per notch. The root carries `data-snui-mouse-gesture` so the docs-preview
 * mouse→touch bridge can leave these gestures to the component.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 弹层 / 工具栏 / 确认取消 — 用 sn-picker
 *   - 日期列生成 — 用 sn-datetime-picker-view
 */

import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import type {
  NormalizedPickerOption,
  PickerColumn,
  PickerOption,
  PickerValue,
  PickerViewChangePayload,
} from './sn-picker-view-types';
import { createRollerDrag } from './sn-picker-view-drag';

defineOptions({ name: 'SnPickerView' });

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-picker-view` 1:1 surface ────────────────────────────── */

    /** Selected value per column (`v-model`). */
    modelValue?: PickerValue[];
    /**
     * Columns. Each entry is a column of primitives / option objects.
     * In `cascade` mode pass the option *tree* here instead: the component
     * derives the visible columns from the selected path.
     */
    columns?: PickerColumn[];
    /** Row height in px design units (converted to rpx for layout). */
    itemHeight?: number;
    /** Number of visible rows; must be odd so a row can sit in the middle. */
    visibleItemCount?: number;
    /** Option key holding the value. */
    valueKey?: string;
    /** Option key holding the visible label. */
    labelKey?: string;
    /** Option key holding the children (cascade mode only). */
    childrenKey?: string;
    /** Emit `change` while dragging instead of only on release. */
    immediateChange?: boolean;
    /** Treat `columns` as a nested option tree. */
    cascade?: boolean;
    /** Disables the whole roller. */
    disabled?: boolean;
    /** Class on the root node. */
    customClass?: string;
    /** Inline style on the root node. */
    customStyle?: string;
  }>(),
  {
    modelValue: () => [],
    columns: () => [],
    itemHeight: 44,
    visibleItemCount: 6,
    valueKey: 'value',
    labelKey: 'label',
    childrenKey: 'children',
    immediateChange: false,
    cascade: false,
    disabled: false,
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: PickerValue[]): void;
  (e: 'change', payload: PickerViewChangePayload): void;
  (e: 'pickstart'): void;
  (e: 'pickend'): void;
}>();

/* ── Normalisation ─────────────────────────────────────────────────────── */

function readKey(raw: PickerOption | PickerValue, key: string): unknown {
  if (typeof raw !== 'object' || raw === null) return undefined;
  return raw[key];
}

function normalizeOption(raw: PickerValue | PickerOption): NormalizedPickerOption {
  if (typeof raw === 'object' && raw !== null) {
    const value = readKey(raw, props.valueKey);
    const label = readKey(raw, props.labelKey);
    return {
      value: typeof value === 'string' || typeof value === 'number' ? value : String(label ?? ''),
      label: label === undefined || label === null ? '' : String(label),
      disabled: readKey(raw, 'disabled') === true,
      raw,
    };
  }
  return { value: raw, label: String(raw), disabled: false, raw };
}

function normalizeColumn(column: PickerColumn | undefined): NormalizedPickerOption[] {
  if (!column) return [];
  return column.map(normalizeOption);
}

function readChildren(raw: PickerOption | PickerValue): PickerColumn | undefined {
  const children = readKey(raw, props.childrenKey);
  return Array.isArray(children) ? (children as PickerColumn) : undefined;
}

/**
 * Columns actually rendered for a given selection.
 *
 * Non-cascade: one column per `columns` entry. Cascade: the root list plus one
 * column per selected option that still has children.
 */
function resolveColumns(values: PickerValue[]): NormalizedPickerOption[][] {
  if (!props.cascade) return props.columns.map(normalizeColumn);
  const root = normalizeColumn(props.columns as unknown as PickerColumn);
  const result: NormalizedPickerOption[][] = [root];
  for (let i = 0; i < values.length; i += 1) {
    const current = result[i];
    if (!current) break;
    const selected = current.find((option) => option.value === values[i]);
    if (!selected) break;
    const children = readChildren(selected.raw);
    if (!children || children.length === 0) break;
    result.push(normalizeColumn(children));
  }
  return result;
}

const resolvedColumns = computed<NormalizedPickerOption[][]>(() =>
  resolveColumns(props.modelValue),
);

/** Index of the selected row per column (0 when the value is not present). */
const selectedIndexes = computed<number[]>(() =>
  resolvedColumns.value.map((column, ci) => {
    const index = column.findIndex((option) => option.value === props.modelValue[ci]);
    return index < 0 ? 0 : index;
  }),
);

/** Value per column, falling back to the first option when unset. */
const effectiveValues = computed<PickerValue[]>(() =>
  resolvedColumns.value.map((column, ci) => {
    const index = selectedIndexes.value[ci] ?? 0;
    const option = column[index];
    return option ? option.value : (props.modelValue[ci] ?? '');
  }),
);

/* ── Geometry (all rpx — 1px design = 2rpx) ────────────────────────────── */

const RATIO = 2;

const itemRpx = computed(() => Math.max(props.itemHeight, 1) * RATIO);
const itemHeightRpx = computed(() => `${itemRpx.value}rpx`);
const visibleCount = computed(() => Math.max(props.visibleItemCount, 1));
const columnHeightRpx = computed(() => `${itemRpx.value * visibleCount.value}rpx`);

/* ── Drag engine (shared with sn-datetime-picker-view) ─────────────────── */

const drag = createRollerDrag({
  isDisabled: () => props.disabled,
  itemRpx: () => itemRpx.value,
  visibleCount: () => visibleCount.value,
  indexOf: (columnIndex) => selectedIndexes.value[columnIndex] ?? 0,
  lengthOf: (columnIndex) => resolvedColumns.value[columnIndex]?.length ?? 0,
  isRowDisabled: (columnIndex, rowIndex) =>
    resolvedColumns.value[columnIndex]?.[rowIndex]?.disabled === true,
  isImmediate: () => props.immediateChange,
  commit,
  onStart: () => emit('pickstart'),
  onEnd: () => emit('pickend'),
});

const {
  isDragging,
  snapDurationMs,
  columnOffsetRpx,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onTouchCancel,
  shouldIgnoreTap,
  bindMouseGestures,
} = drag;

/* ── Desktop H5: mouse drag + wheel (additive) ─────────────────────────── */

const rootRef = ref<unknown>(null);
let disposeMouseGestures: (() => void) | null = null;

onMounted(() => {
  // Browser hosts only — a mini-program page has no `document`, and uni H5
  // wraps `<view>` in a component instance, so unwrap `$el` when present.
  if (typeof document === 'undefined') return;
  const el = (rootRef.value as { $el?: unknown } | null)?.$el ?? (rootRef.value as unknown);
  if (el instanceof HTMLElement) disposeMouseGestures = bindMouseGestures(el);
});

onBeforeUnmount(() => {
  disposeMouseGestures?.();
  disposeMouseGestures = null;
});

/** Commit a row index for one column: emits `update:modelValue` + `change`. */
function commit(columnIndex: number, rowIndex: number): void {
  const column = resolvedColumns.value[columnIndex];
  if (!column || column.length === 0) return;
  const target = column[rowIndex];
  if (!target || target.disabled) return;
  if (selectedIndexes.value[columnIndex] === rowIndex) return;

  // Cascade: a parent change invalidates every deeper selection, so the
  // emitted path stops right after the changed column and is re-derived.
  const base = props.cascade
    ? effectiveValues.value.slice(0, columnIndex + 1)
    : effectiveValues.value.slice();
  base[columnIndex] = target.value;
  const trimmed = base.slice(0, resolveColumns(base).length);

  emit('update:modelValue', trimmed);
  emit('change', buildPayload(trimmed, columnIndex));
}

function buildPayload(values: PickerValue[], columnIndex: number): PickerViewChangePayload {
  const columns = resolveColumns(values);
  const selectedOptions: Array<PickerOption | PickerValue> = [];
  const selectedLabels: string[] = [];
  const selectedIndexes: number[] = [];
  columns.forEach((column, ci) => {
    const index = Math.max(
      column.findIndex((option) => option.value === values[ci]),
      0,
    );
    const option = column[index];
    selectedIndexes.push(index);
    selectedOptions.push(option ? option.raw : '');
    selectedLabels.push(option ? option.label : '');
  });
  return {
    selectedValues: values,
    selectedOptions,
    selectedLabels,
    selectedIndexes,
    columnIndex,
  };
}

function onItemTap(columnIndex: number, rowIndex: number): void {
  if (props.disabled) return;
  // Uni re-fires `tap` on the touchstart target when the finger lifts; after
  // a real drag that row is no longer the one the gesture settled on.
  if (shouldIgnoreTap()) return;
  commit(columnIndex, rowIndex);
}

/* ── Public imperative API (wd-picker-view parity) ─────────────────────── */

function getSelectedValues(): PickerValue[] {
  return effectiveValues.value.slice();
}

function getSelectedOptions(): Array<PickerOption | PickerValue> {
  return buildPayload(effectiveValues.value, 0).selectedOptions;
}

function getSelectedLabels(): string[] {
  return buildPayload(effectiveValues.value, 0).selectedLabels;
}

function getSelectedIndex(): number[] {
  return selectedIndexes.value.slice();
}

function getColumnsData(): NormalizedPickerOption[][] {
  return resolvedColumns.value;
}

function getColumnData(columnIndex: number): NormalizedPickerOption[] {
  return resolvedColumns.value[columnIndex] ?? [];
}

function getColumnIndex(): number[] {
  return selectedIndexes.value.slice();
}

/** Reset every column to its first selectable option. */
function resetColumns(): void {
  const nextValues = resolvedColumns.value.map((column) => {
    const first = column.find((option) => !option.disabled) ?? column[0];
    return first ? first.value : '';
  });
  emit('update:modelValue', nextValues);
  emit('change', buildPayload(nextValues, 0));
}

defineExpose({
  getSelectedValues,
  getSelectedOptions,
  getSelectedLabels,
  getSelectedIndex,
  getColumnsData,
  getColumnData,
  getColumnIndex,
  resetColumns,
});

/* ── Presentation ──────────────────────────────────────────────────────── */

const rootClass = computed(() => [
  'sn-picker-view',
  {
    'sn-picker-view--disabled': props.disabled,
    'sn-picker-view--cascade': props.cascade,
  },
  props.customClass,
]);

/** Half the leftover space — the top / bottom fade covers exactly that. */
const maskHeightRpx = computed(() => {
  const rest = itemRpx.value * (visibleCount.value - 1);
  return `${Math.max(rest / 2, 0)}rpx`;
});

const rootStyle = computed(() => {
  const vars = [
    `--sn-picker-view-item-height: ${itemHeightRpx.value}`,
    `--sn-picker-view-mask-height: ${maskHeightRpx.value}`,
    `--sn-picker-view-settle-duration: ${snapDurationMs.value}ms`,
  ].join('; ');
  return props.customStyle ? `${vars}; ${props.customStyle}` : vars;
});

function isActive(columnIndex: number, rowIndex: number): boolean {
  return (selectedIndexes.value[columnIndex] ?? 0) === rowIndex;
}

function ariaSelected(columnIndex: number, rowIndex: number): 'true' | 'false' {
  return isActive(columnIndex, rowIndex) ? 'true' : 'false';
}
</script>

<template>
  <view
    ref="rootRef"
    :class="rootClass"
    :style="rootStyle"
    :data-snui-component="'picker-view'"
    :data-snui-mouse-gesture="'picker-view'"
    role="group"
    :aria-disabled="disabled ? 'true' : undefined"
  >
    <view
      v-for="(column, columnIndex) in resolvedColumns"
      :key="columnIndex"
      class="sn-picker-view__column"
      :data-snui-column="columnIndex"
      :style="{ height: columnHeightRpx }"
      @touchstart="onTouchStart($event, columnIndex)"
      @touchmove.stop.prevent="onTouchMove($event, columnIndex)"
      @touchend="onTouchEnd($event, columnIndex)"
      @touchcancel="onTouchCancel(columnIndex)"
    >
      <view
        class="sn-picker-view__roller"
        :class="{ 'sn-picker-view__roller--dragging': isDragging }"
        :style="{ transform: `translateY(${columnOffsetRpx(columnIndex)}rpx)` }"
      >
        <view
          v-for="(option, rowIndex) in column"
          :key="option.value"
          :class="[
            'sn-picker-view__item',
            {
              'sn-picker-view__item--active': isActive(columnIndex, rowIndex),
              'sn-picker-view__item--disabled': option.disabled,
            },
          ]"
          :style="{ height: itemHeightRpx }"
          role="button"
          :aria-selected="ariaSelected(columnIndex, rowIndex)"
          :aria-disabled="option.disabled ? 'true' : undefined"
          @tap="onItemTap(columnIndex, rowIndex)"
          >{{ option.label }}</view
        >
      </view>
      <view class="sn-picker-view__mask sn-picker-view__mask--top" aria-hidden="true" />
      <view class="sn-picker-view__mask sn-picker-view__mask--bottom" aria-hidden="true" />
      <view class="sn-picker-view__indicator" aria-hidden="true" />
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). */

.sn-picker-view {
  display: flex;
  align-items: stretch;
  justify-content: center;
  width: 100%;
  padding: var(--sn-mp-spacing-3) 0;
  box-sizing: border-box;
  background-color: var(--sn-mp-color-background-elevated);
  color: var(--sn-mp-color-text-primary);
  font-family: inherit;
  overflow: hidden;
}

.sn-picker-view__column {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  overflow: hidden;
  /* H5 / App webview: a roller drag must never become a page scroll.
     Mini-programs use `catchtouchmove` (the `.stop` modifier) instead. */
  touch-action: none;
  -webkit-user-select: none;
  user-select: none;
}

.sn-picker-view__roller {
  /* Settle only — the length scales with the distance to the snapped row. */
  transition: transform var(--sn-picker-view-settle-duration, 180ms) cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

/* While a finger is down the roller tracks it 1:1: any transition here makes
   the wheel lag behind and read as "the wheel will not move". */
.sn-picker-view__roller--dragging {
  transition: none;
}

.sn-picker-view__item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--sn-mp-spacing-3);
  box-sizing: border-box;
  font-size: var(--sn-mp-font-size-md);
  color: var(--sn-mp-color-text-secondary);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.sn-picker-view__item--active {
  color: var(--sn-mp-color-text-primary);
  font-weight: var(--sn-mp-font-weight-semibold);
}

.sn-picker-view__item--disabled {
  color: var(--sn-mp-color-text-disabled);
}

.sn-picker-view__indicator {
  position: absolute;
  left: var(--sn-mp-spacing-2);
  right: var(--sn-mp-spacing-2);
  top: 50%;
  height: var(--sn-picker-view-item-height);
  margin-top: calc(var(--sn-picker-view-item-height) / -2);
  border-top: 2rpx solid var(--sn-mp-color-border-subtle);
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle);
  pointer-events: none;
  z-index: 2;
}

.sn-picker-view__mask {
  position: absolute;
  left: 0;
  right: 0;
  height: var(--sn-picker-view-mask-height);
  pointer-events: none;
  z-index: 1;
}

.sn-picker-view__mask--top {
  top: 0;
  background: linear-gradient(to bottom, var(--sn-mp-color-background-elevated), transparent);
}

.sn-picker-view__mask--bottom {
  bottom: 0;
  background: linear-gradient(to top, var(--sn-mp-color-background-elevated), transparent);
}

.sn-picker-view--disabled {
  opacity: 0.6;
}

/* Doodle skin — heavier indicator so the hand-drawn wheel stays readable. */
.snui-skin-doodle .sn-picker-view__indicator {
  border-top-width: 4rpx;
  border-bottom-width: 4rpx;
  border-top-color: var(--sn-mp-color-text-primary);
  border-bottom-color: var(--sn-mp-color-text-primary);
}
</style>
