<script setup lang="ts">
/**
 * SnTransfer — web-end transfer list (AUI-WEB-FORM-017).
 *
 * Reference library: naive-ui `n-transfer`
 *   (https://www.naiveui.com/zh-CN/light/components/transfer)
 * Per AGENTS.md §112, props + semantics mirror n-transfer 1:1.
 *
 * Parity checklist (props):
 *   options / value / default-value / filterable /
 *   source-filter-placeholder / target-filter-placeholder / size /
 *   disabled / source-title / target-title /
 *   render-source-label / render-target-label.
 * Parity checklist (events):
 *   update:value (on-update:value).
 *
 * Documented divergences (not §112 violations):
 *   - The per-item checkbox "selected" state is internal-only; the
 *     reference's `selected` / `default-selected` / `on-update:selected`
 *     controlled surface is not exposed (§112 future marker).
 *   - `virtual-scroll` is not implemented — panels scroll natively
 *     (§112 future marker; not wired to SnVirtualList yet).
 *   - Target panel order follows the `value` array order (options not
 *     present in `options` are skipped).
 *   - Moving buttons: single chevron moves the CHECKED items, double
 *     chevron moves ALL movable items; DOM order is
 *     → (选中右移) ⇉ (全部右移) ⇇ (选中左移) ⇠ (全部左移).
 *   - `renderSourceLabel` / `renderTargetLabel` receive `{ option }` and
 *     return VNodeChild (same shape as the reference).
 *   - Fixed zh locale strings (源 / 目标 / 请搜索 / 无数据), following the
 *     SnEmpty zh-locale precedent; no config-provider / RTL integration.
 *   - Theme values map to web tokens: panel borders use
 *     --sn-web-color-border-default/-subtle, option rows derive heights
 *     from --sn-web-button-height-* per size (small 28 / medium 34 /
 *     large 40), list height is overridable via --sn-transfer-list-height.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnTransfer v-model:value="target" :options="options" />
 *   <SnTransfer v-model:value="target" :options="options" filterable
 *               source-title="候选" target-title="已选" />
 */

import { computed, defineComponent, ref, watch } from 'vue';
import { useLocale } from '../locales/use-locale';
import type { PropType, VNodeChild } from 'vue';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next';
import SnButton from '../button/SnButton.vue';
import SnCheckbox from '../checkbox/SnCheckbox.vue';
import type { SnCheckboxValue } from '../checkbox/sn-checkbox-types';
import SnEmpty from '../empty/SnEmpty.vue';
import SnIcon from '../icon/SnIcon.vue';
import SnInput from '../input/SnInput.vue';

defineOptions({ name: 'SnTransfer' });

/** Active locale (injected once at setup — inject() is setup-only). */
const locale = useLocale();

/** One transferable entry. Mirrors the reference option shape. */
interface SnTransferOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

type SnTransferValue = string | number;

type SnTransferSize = 'small' | 'medium' | 'large';

/** Render-function prop signature (receives `{ option }`, returns VNodeChild). */
type RenderLabelFn = (data: { option: SnTransferOption }) => VNodeChild;

/**
 * Internal renderer for the `renderSourceLabel` / `renderTargetLabel`
 * function props. Renders whatever the function returns (text or vnodes)
 * so templates can stay declarative.
 */
const TransferLabel = defineComponent({
  name: 'SnTransferLabel',
  props: {
    render: {
      type: Function as PropType<RenderLabelFn | undefined>,
      default: undefined,
    },
    option: { type: Object as PropType<SnTransferOption>, required: true },
  },
  setup(labelProps) {
    return () => {
      if (!labelProps.render) return null;
      return labelProps.render({ option: labelProps.option });
    };
  },
});

const props = withDefaults(
  defineProps<{
    /** Transferable entries. Mirrors n-transfer `options`. */
    options?: SnTransferOption[];
    /** Selected (right-panel) values (controlled). Mirrors n-transfer `value`. */
    value?: SnTransferValue[] | undefined;
    /** Initial selected values for uncontrolled mode. Mirrors n-transfer `default-value`. */
    defaultValue?: SnTransferValue[];
    /** Show the per-panel filter input. Mirrors n-transfer `filterable`. */
    filterable?: boolean;
    /** Filter placeholder in the source panel. Mirrors n-transfer `source-filter-placeholder`. */
    sourceFilterPlaceholder?: string | undefined;
    /** Filter placeholder in the target panel. Mirrors n-transfer `target-filter-placeholder`. */
    targetFilterPlaceholder?: string | undefined;
    /** Visual size of rows / buttons. Mirrors n-transfer `size`. */
    size?: SnTransferSize;
    /** Disable every control. Mirrors n-transfer `disabled`. */
    disabled?: boolean;
    /** Source panel title (fixed zh default). Mirrors n-transfer `source-title`. */
    sourceTitle?: string | undefined;
    /** Target panel title (fixed zh default). Mirrors n-transfer `target-title`. */
    targetTitle?: string | undefined;
    /** Custom label renderer for source rows. Mirrors n-transfer `render-source-label`. */
    renderSourceLabel?: RenderLabelFn | undefined;
    /** Custom label renderer for target rows. Mirrors n-transfer `render-target-label`. */
    renderTargetLabel?: RenderLabelFn | undefined;
  }>(),
  {
    options: () => [],
    value: undefined,
    defaultValue: () => [],
    filterable: false,
    sourceFilterPlaceholder: undefined,
    targetFilterPlaceholder: undefined,
    size: 'medium',
    disabled: false,
    sourceTitle: undefined,
    targetTitle: undefined,
    renderSourceLabel: undefined,
    renderTargetLabel: undefined,
  },
);

const emit = defineEmits<{
  /** Selected values committed (move buttons). Mirrors n-transfer `on-update:value`. */
  (e: 'update:value', value: SnTransferValue[]): void;
}>();

/**
 * Definite-boolean view of `disabled`. Under `exactOptionalPropertyTypes`
 * the raw prop type keeps `| undefined`, which child component prop
 * types (SnButton / SnCheckbox / SnInput) reject — same narrowing as
 * SnDialog's `isLoading`.
 */
const isDisabled = computed(() => props.disabled === true);

/* ─────────── Controlled / uncontrolled target values ─────────── */

const isValueControlled = computed(() => props.value !== undefined);
const uncontrolledTarget = ref<SnTransferValue[]>([...props.defaultValue]);

const targetValues = computed<SnTransferValue[]>(() =>
  isValueControlled.value ? (props.value as SnTransferValue[]) : uncontrolledTarget.value,
);

function commitValue(next: SnTransferValue[]): void {
  if (!isValueControlled.value) uncontrolledTarget.value = next;
  emit('update:value', next);
}

/* ─────────── Derived option lists ─────────── */

const optionMap = computed(() => {
  const map = new Map<SnTransferValue, SnTransferOption>();
  for (const option of props.options) {
    if (!map.has(option.value)) map.set(option.value, option);
  }
  return map;
});

const targetValueSet = computed(() => new Set<SnTransferValue>(targetValues.value));

/** Left panel: everything not selected, in `options` order. */
const sourceOptions = computed(() =>
  props.options.filter((option) => !targetValueSet.value.has(option.value)),
);

/** Right panel: selected values in `value` order, skipping unknown entries. */
const targetOptions = computed(() =>
  targetValues.value
    .map((value) => optionMap.value.get(value))
    .filter((option): option is SnTransferOption => option !== undefined),
);

/* ─────────── Checkbox selection state (internal) ─────────── */

const sourceChecked = ref(new Set<SnTransferValue>());
const targetChecked = ref(new Set<SnTransferValue>());
const sourceFilter = ref('');
const targetFilter = ref('');

function matchesFilter(option: SnTransferOption, pattern: string): boolean {
  return option.label.toLowerCase().includes(pattern.trim().toLowerCase());
}

const filteredSourceOptions = computed(() => {
  if (!props.filterable || sourceFilter.value.trim() === '') return sourceOptions.value;
  return sourceOptions.value.filter((option) => matchesFilter(option, sourceFilter.value));
});

const filteredTargetOptions = computed(() => {
  if (!props.filterable || targetFilter.value.trim() === '') return targetOptions.value;
  return targetOptions.value.filter((option) => matchesFilter(option, targetFilter.value));
});

/** Rows that the header checkbox may touch (visible + not disabled). */
const sourceCheckable = computed(() => filteredSourceOptions.value.filter((o) => !o.disabled));
const targetCheckable = computed(() => filteredTargetOptions.value.filter((o) => !o.disabled));

const sourceAllChecked = computed(
  () =>
    sourceCheckable.value.length > 0 &&
    sourceCheckable.value.every((o) => sourceChecked.value.has(o.value)),
);
const sourceSomeChecked = computed(
  () =>
    !sourceAllChecked.value && sourceCheckable.value.some((o) => sourceChecked.value.has(o.value)),
);
const targetAllChecked = computed(
  () =>
    targetCheckable.value.length > 0 &&
    targetCheckable.value.every((o) => targetChecked.value.has(o.value)),
);
const targetSomeChecked = computed(
  () =>
    !targetAllChecked.value && targetCheckable.value.some((o) => targetChecked.value.has(o.value)),
);

function toggleOption(option: SnTransferOption, side: 'source' | 'target'): void {
  if (props.disabled || option.disabled) return;
  const checked = side === 'source' ? sourceChecked.value : targetChecked.value;
  if (checked.has(option.value)) checked.delete(option.value);
  else checked.add(option.value);
}

function toggleAll(side: 'source' | 'target', checked: SnCheckboxValue): void {
  if (props.disabled) return;
  const pool = side === 'source' ? sourceCheckable.value : targetCheckable.value;
  const checkedSet = side === 'source' ? sourceChecked.value : targetChecked.value;
  if (checked === true) {
    for (const option of pool) checkedSet.add(option.value);
  } else {
    for (const option of pool) checkedSet.delete(option.value);
  }
}

/* Prune stale checkbox state when value / options change externally. */
watch(targetValues, (values) => {
  const present = new Set<SnTransferValue>(values);
  for (const v of [...targetChecked.value]) {
    if (!present.has(v)) targetChecked.value.delete(v);
  }
});
watch(
  () => props.options,
  (options) => {
    const known = new Set<SnTransferValue>(options.map((o) => o.value));
    for (const v of [...sourceChecked.value]) {
      if (!known.has(v)) sourceChecked.value.delete(v);
    }
    for (const v of [...targetChecked.value]) {
      if (!known.has(v)) targetChecked.value.delete(v);
    }
  },
);

/* ─────────── Move operations ─────────── */

function collectMovable(all: boolean, side: 'source' | 'target'): SnTransferOption[] {
  const list = side === 'source' ? filteredSourceOptions.value : filteredTargetOptions.value;
  if (all) return list.filter((option) => !option.disabled);
  const checkedSet = side === 'source' ? sourceChecked.value : targetChecked.value;
  return list.filter((option) => !option.disabled && checkedSet.has(option.value));
}

const canMoveSelectedRight = computed(
  () => !props.disabled && collectMovable(false, 'source').length > 0,
);
const canMoveAllRight = computed(
  () => !props.disabled && filteredSourceOptions.value.some((o) => !o.disabled),
);
const canMoveSelectedLeft = computed(
  () => !props.disabled && collectMovable(false, 'target').length > 0,
);
const canMoveAllLeft = computed(
  () => !props.disabled && filteredTargetOptions.value.some((o) => !o.disabled),
);

/** Move checked (or all movable) source entries into the target. */
function moveRight(all: boolean): void {
  if (props.disabled) return;
  const movable = collectMovable(all, 'source');
  if (movable.length === 0) return;
  const movedValues = movable.map((option) => option.value);
  commitValue([...targetValues.value, ...movedValues]);
  for (const value of movedValues) sourceChecked.value.delete(value);
}

/** Move checked (or all movable) target entries back to the source. */
function moveLeft(all: boolean): void {
  if (props.disabled) return;
  const movable = collectMovable(all, 'target');
  if (movable.length === 0) return;
  const moved = new Set<SnTransferValue>(movable.map((option) => option.value));
  commitValue(targetValues.value.filter((value) => !moved.has(value)));
  for (const value of moved) targetChecked.value.delete(value);
}

/* ─────────── Titles ─────────── */

const resolvedSourceTitle = computed(() => props.sourceTitle ?? '源');
const resolvedTargetTitle = computed(() => props.targetTitle ?? '目标');
</script>

<template>
  <div
    data-snui-component="transfer"
    class="sn-transfer"
    :class="[`sn-transfer--${size}`, { 'sn-transfer--disabled': isDisabled }]"
  >
    <!-- Source panel -->
    <div class="sn-transfer__panel sn-transfer__panel--source">
      <div class="sn-transfer__header">
        <SnCheckbox
          class="sn-transfer__header-checkbox"
          :model-value="sourceAllChecked"
          :indeterminate="sourceSomeChecked"
          :disabled="isDisabled || sourceCheckable.length === 0"
          :aria-label="locale.Transfer.selectAll.replace('{title}', resolvedSourceTitle)"
          @update:model-value="toggleAll('source', $event as SnCheckboxValue)"
        />
        <span class="sn-transfer__title">{{ resolvedSourceTitle }}</span>
        <span class="sn-transfer__count"
          >{{ sourceChecked.size }} / {{ sourceOptions.length }}</span
        >
      </div>
      <div v-if="filterable" class="sn-transfer__filter">
        <SnInput
          v-model="sourceFilter"
          size="small"
          clearable
          :placeholder="sourceFilterPlaceholder ?? locale.Transfer.searchPlaceholder"
          :disabled="isDisabled"
          :aria-label="locale.Transfer.filterSource"
        />
      </div>
      <div
        class="sn-transfer__list"
        role="listbox"
        aria-multiselectable="true"
        :aria-label="resolvedSourceTitle"
      >
        <div
          v-for="option in filteredSourceOptions"
          :key="option.value"
          class="sn-transfer__option"
          :class="{ 'sn-transfer__option--disabled': option.disabled === true || isDisabled }"
          role="option"
          :aria-selected="sourceChecked.has(option.value) ? 'true' : 'false'"
          :aria-disabled="option.disabled === true || isDisabled ? 'true' : undefined"
          @click="toggleOption(option, 'source')"
        >
          <SnCheckbox
            class="sn-transfer__option-checkbox"
            :model-value="sourceChecked.has(option.value)"
            :disabled="option.disabled === true || isDisabled"
            :aria-label="option.label"
          />
          <span class="sn-transfer__option-label">
            <TransferLabel v-if="renderSourceLabel" :render="renderSourceLabel" :option="option" />
            <template v-else>{{ option.label }}</template>
          </span>
        </div>
        <SnEmpty
          v-if="filteredSourceOptions.length === 0"
          size="small"
          class="sn-transfer__empty"
        />
      </div>
    </div>

    <!-- Move operations -->
    <div class="sn-transfer__operations">
      <SnButton
        size="small"
        circle
        :disabled="!canMoveSelectedRight"
        :aria-label="locale.Transfer.moveSelectedRight"
        @click="moveRight(false)"
      >
        <SnIcon :icon="ChevronRight" :size="16" />
      </SnButton>
      <SnButton
        size="small"
        circle
        :disabled="!canMoveAllRight"
        :aria-label="locale.Transfer.moveAllRight"
        @click="moveRight(true)"
      >
        <SnIcon :icon="ChevronsRight" :size="16" />
      </SnButton>
      <SnButton
        size="small"
        circle
        :disabled="!canMoveSelectedLeft"
        :aria-label="locale.Transfer.moveSelectedLeft"
        @click="moveLeft(false)"
      >
        <SnIcon :icon="ChevronsLeft" :size="16" />
      </SnButton>
      <SnButton
        size="small"
        circle
        :disabled="!canMoveAllLeft"
        :aria-label="locale.Transfer.moveAllLeft"
        @click="moveLeft(true)"
      >
        <SnIcon :icon="ChevronLeft" :size="16" />
      </SnButton>
    </div>

    <!-- Target panel -->
    <div class="sn-transfer__panel sn-transfer__panel--target">
      <div class="sn-transfer__header">
        <SnCheckbox
          class="sn-transfer__header-checkbox"
          :model-value="targetAllChecked"
          :indeterminate="targetSomeChecked"
          :disabled="isDisabled || targetCheckable.length === 0"
          :aria-label="locale.Transfer.selectAll.replace('{title}', resolvedTargetTitle)"
          @update:model-value="toggleAll('target', $event as SnCheckboxValue)"
        />
        <span class="sn-transfer__title">{{ resolvedTargetTitle }}</span>
        <span class="sn-transfer__count"
          >{{ targetChecked.size }} / {{ targetOptions.length }}</span
        >
      </div>
      <div v-if="filterable" class="sn-transfer__filter">
        <SnInput
          v-model="targetFilter"
          size="small"
          clearable
          :placeholder="targetFilterPlaceholder ?? locale.Transfer.searchPlaceholder"
          :disabled="isDisabled"
          :aria-label="locale.Transfer.filterTarget"
        />
      </div>
      <div
        class="sn-transfer__list"
        role="listbox"
        aria-multiselectable="true"
        :aria-label="resolvedTargetTitle"
      >
        <div
          v-for="option in filteredTargetOptions"
          :key="option.value"
          class="sn-transfer__option"
          :class="{ 'sn-transfer__option--disabled': option.disabled === true || isDisabled }"
          role="option"
          :aria-selected="targetChecked.has(option.value) ? 'true' : 'false'"
          :aria-disabled="option.disabled === true || isDisabled ? 'true' : undefined"
          @click="toggleOption(option, 'target')"
        >
          <SnCheckbox
            class="sn-transfer__option-checkbox"
            :model-value="targetChecked.has(option.value)"
            :disabled="option.disabled === true || isDisabled"
            :aria-label="option.label"
          />
          <span class="sn-transfer__option-label">
            <TransferLabel v-if="renderTargetLabel" :render="renderTargetLabel" :option="option" />
            <template v-else>{{ option.label }}</template>
          </span>
        </div>
        <SnEmpty
          v-if="filteredTargetOptions.length === 0"
          size="small"
          class="sn-transfer__empty"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-transfer {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sn-transfer--disabled {
  cursor: not-allowed;
}

/* Panels */
.sn-transfer__panel {
  display: flex;
  flex-direction: column;
  width: 220px;
  border: 1px solid var(--sn-web-color-border-default);
  border-radius: var(--sn-web-input-radius, 3px);
  background-color: var(--sn-web-color-background-surface);
  overflow: hidden;
}

.sn-transfer__header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--sn-web-color-border-subtle);
  background-color: var(--sn-web-color-background-subtle);
}

.sn-transfer__title {
  flex: 1;
  font-size: 14px;
  color: var(--sn-web-color-text-primary);
}

.sn-transfer__count {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}

.sn-transfer__filter {
  padding: 8px 8px 0;
}

/* Option list */
.sn-transfer__list {
  height: var(--sn-transfer-list-height, 200px);
  overflow-y: auto;
  padding: 4px 0;
}

.sn-transfer__option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  cursor: pointer;
  color: var(--sn-web-color-text-primary);
  transition: background-color 0.15s;
}

.sn-transfer__option:hover:not(.sn-transfer__option--disabled) {
  background-color: var(--sn-web-color-background-subtle);
}

.sn-transfer__option--disabled {
  cursor: not-allowed;
  color: var(--sn-web-color-text-disabled);
}

/* Row heights per size — derived from the button height metrics
 * (small 28 / medium 34 / large 40). */
.sn-transfer--small .sn-transfer__option {
  height: var(--sn-web-button-height-small, 28px);
}

.sn-transfer--medium .sn-transfer__option {
  height: var(--sn-web-button-height-medium, 34px);
}

.sn-transfer--large .sn-transfer__option {
  height: var(--sn-web-button-height-large, 40px);
  font-size: 15px;
}

.sn-transfer__option-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sn-transfer__empty {
  padding: 16px 0;
}

/* Move operations column */
.sn-transfer__operations {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
