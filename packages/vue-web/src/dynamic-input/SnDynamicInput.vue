<script setup lang="ts">
/**
 * SnDynamicInput — web-end dynamic input list (naive-ui n-dynamic-input parity).
 *
 * Renders one editable row per array item. Primitive items (string / number)
 * get a built-in token-styled input; object items are rendered via the
 * scoped default slot (the slot wins over the built-in input whenever
 * provided). Each row carries a − / + suffix pair for remove / insert-after;
 * at the `min` / `max` bounds the corresponding button is hidden.
 *
 * Per AGENTS.md §30/31: contract declared via defineProps / defineEmits /
 * defineSlots + CSS variables. a11y: action buttons expose aria-labels;
 * the empty-state create button is a real <button> (AGENTS.md §113: no
 * emoji icons — inline SVG only).
 */

import { computed, useSlots } from 'vue'

defineOptions({ name: 'SnDynamicInput' })

/**
 * One row value. Primitives render the built-in input; objects go to the
 * scoped default slot. `null` is the naive-ui default created value (the
 * `preset` factory's default), meaningful for slot-rendered rows.
 */
type DynamicInputValue = string | number | Record<string, unknown> | null

/** Factory producing the initial value of a newly inserted row. */
type DynamicInputPreset = () => DynamicInputValue

const props = withDefaults(
  defineProps<{
    /** Bound array of row values. Each row edits exactly one entry in place. */
    modelValue?: DynamicInputValue[]
    /**
     * Factory creating the value of a newly inserted row. Defaults to
     * naive-ui semantics (`null`); pass e.g. `() => ''` for text rows.
     */
    preset?: DynamicInputPreset
    /** Lower bound on the row count. The − button hides at the bound. */
    min?: number
    /** Upper bound on the row count. The + button hides at the bound. */
    max?: number
    /** Disables every row input and the row action buttons. */
    disabled?: boolean
    /**
     * Read-only rows — values are visible but not editable and the
     * structural − / + actions are not rendered (row set is frozen).
     */
    readonly?: boolean
    /** Visual size preset. Drives the built-in input height + font-size. */
    size?: 'mini' | 'tiny' | 'small' | 'medium' | 'large'
    /** Visual status, cascaded to every built-in row input. */
    status?: 'default' | 'error' | 'warning'
    /**
     * New-row post-processor, invoked after `preset` produced the draft
     * value (naive-ui's `on-create`, reshaped to refine the preset result).
     * Receives the draft value + the insertion index; the return value
     * becomes the new row.
     */
    onCreate?: (value: DynamicInputValue, index: number) => DynamicInputValue
  }>(),
  {
    modelValue: () => [],
    preset: () => null,
    min: 0,
    disabled: false,
    readonly: false,
    size: 'medium',
    status: 'default',
  },
)

const emit = defineEmits<{
  /**
   * v-model sync — always the full new array (item edit, insert, remove,
   * empty-state create).
   */
  (e: 'update:modelValue', value: DynamicInputValue[]): void
}>()

defineSlots<{
  /**
   * Custom row renderer, scoped `{ value, index }`. Takes priority over the
   * built-in input for every row — mutate via `update:modelValue`.
   */
  default?(props: { value: DynamicInputValue; index: number }): unknown
}>()

const slots = useSlots()

/** Working copy of the bound array — never mutated in place. */
const rows = computed<DynamicInputValue[]>(() => props.modelValue ?? [])

/** − hidden at the `min` floor. */
const canRemove = computed(() => rows.value.length > props.min)

/** + hidden at the `max` ceiling. */
const canInsert = computed(() =>
  props.max === undefined ? true : rows.value.length < props.max,
)

/** Insert / remove handlers double-guard with this (silent no-op clicks). */
const isInteractive = computed(() => !props.disabled && !props.readonly)

/** The scoped default slot wins over the built-in input (naive parity). */
const useSlot = computed(() => slots.default !== undefined)

const classList = computed(() => [
  'sn-dynamic-input',
  `sn-dynamic-input--${props.size}`,
  {
    'sn-dynamic-input--disabled': props.disabled,
    'sn-dynamic-input--readonly': props.readonly,
    [`sn-dynamic-input--status-${props.status}`]: props.status !== 'default',
  },
])

/** New-row value: preset draft → onCreate refinement. */
function createRowValue(index: number): DynamicInputValue {
  const draft = props.preset()
  if (props.onCreate) return props.onCreate(draft, index)
  return draft
}

/**
 * Commit a rebuilt array. Always copies so reactive owners that compare
 * references still see a change.
 */
function commit(next: DynamicInputValue[]): void {
  emit('update:modelValue', next)
}

/** Insert a new row after `index` (−1 appends for the empty-state button). */
function insertRow(index: number): void {
  if (!isInteractive.value || !canInsert.value) return
  const next = Array.from(rows.value)
  const at = index + 1
  next.splice(at, 0, createRowValue(at))
  commit(next)
}

/** Remove the row at `index`; respects the `min` floor. */
function removeRow(index: number): void {
  if (!isInteractive.value || !canRemove.value) return
  const next = Array.from(rows.value)
  next.splice(index, 1)
  commit(next)
}

/**
 * Built-in input commit. Preserves the item's numeric type: editing a
 * number row with numeric text commits a number (empty / non-numeric text
 * commits the raw string, like naive-ui's input preset).
 */
function onRowInput(index: number, event: Event): void {
  // Guard: readonly / disabled rows must never commit — setValue-style
  // programmatic edits and some IME/paste paths still fire native input.
  if (!isInteractive.value) return
  const target = event.target as HTMLInputElement
  const raw = target.value
  const current = rows.value[index]
  const next = Array.from(rows.value)
  if (typeof current === 'number' && raw.trim() !== '' && Number.isFinite(Number(raw))) {
    next[index] = Number(raw)
  } else {
    next[index] = raw
  }
  commit(next)
}

/** Display string for the built-in input. */
function displayValue(row: DynamicInputValue): string | number {
  if (typeof row === 'number') return row
  return String(row ?? '')
}
</script>

<template>
  <div
    :class="classList"
    :data-snui-component="'dynamic-input'"
    :data-size="size"
    :data-status="status"
  >
    <button
      v-if="rows.length === 0"
      type="button"
      class="sn-dynamic-input__create"
      :disabled="!isInteractive || !canInsert"
      aria-label="Add"
      @click="insertRow(-1)"
    >
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
      <span class="sn-dynamic-input__create-text">Add</span>
    </button>

    <div
      v-for="(row, index) in rows"
      :key="index"
      class="sn-dynamic-input__item"
      :data-index="index"
    >
      <slot v-if="useSlot" :value="row" :index="index" />
      <input
        v-else
        class="sn-dynamic-input__input"
        type="text"
        :value="displayValue(row)"
        :disabled="disabled"
        :readonly="readonly"
        :aria-label="`Row ${index + 1}`"
        :aria-invalid="status === 'error' ? 'true' : undefined"
        :aria-disabled="disabled ? 'true' : undefined"
        @input="onRowInput(index, $event)"
      />

      <div v-if="!readonly" class="sn-dynamic-input__actions">
        <button
          v-if="canRemove"
          type="button"
          class="sn-dynamic-input__btn sn-dynamic-input__btn--remove"
          :disabled="disabled"
          :aria-label="`Remove row ${index + 1}`"
          @click="removeRow(index)"
        >
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /></svg>
        </button>
        <button
          v-if="canInsert"
          type="button"
          class="sn-dynamic-input__btn sn-dynamic-input__btn--insert"
          :disabled="disabled"
          :aria-label="`Add row after ${index + 1}`"
          @click="insertRow(index)"
        >
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sn-dynamic-input {
  display: flex;
  flex-direction: column;
  gap: var(--sn-web-dynamic-input-row-gap, 8px);
  font-family: inherit;
  box-sizing: border-box;
}

/* Empty state — dashed "Add" button replaces the row list (naive parity). */
.sn-dynamic-input__create {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  border: 1px dashed var(--sn-web-dynamic-input-border-color, var(--sn-web-color-border-default));
  border-radius: var(--sn-web-input-radius, 6px);
  background-color: var(--sn-web-dynamic-input-bg, var(--sn-web-color-background-surface));
  color: var(--sn-web-dynamic-input-text-color, var(--sn-web-color-text-secondary));
  cursor: pointer;
  padding: 0 var(--sn-web-input-padding-x, 10px);
  font: inherit;
  transition: color 0.15s ease-out, border-color 0.15s ease-out;
}

.sn-dynamic-input__create:hover:not(:disabled) {
  color: var(--sn-web-color-action-primary);
  border-color: var(--sn-web-color-action-primary);
}

.sn-dynamic-input__create:disabled {
  color: var(--sn-web-color-text-disabled);
  cursor: not-allowed;
}

.sn-dynamic-input--mini .sn-dynamic-input__create { height: 22px; font-size: 11px; }
.sn-dynamic-input--tiny .sn-dynamic-input__create { height: 24px; font-size: 12px; }
.sn-dynamic-input--small .sn-dynamic-input__create { height: 28px; font-size: 13px; }
.sn-dynamic-input--medium .sn-dynamic-input__create { height: 32px; font-size: 14px; }
.sn-dynamic-input--large .sn-dynamic-input__create { height: 40px; font-size: 15px; }

/* Rows */
.sn-dynamic-input__item {
  display: flex;
  align-items: center;
  gap: var(--sn-web-dynamic-input-action-gap, 6px);
}

/* Built-in primitive input — token-aligned to the SnInput visual language. */
.sn-dynamic-input__input {
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  border: 1px solid var(--sn-web-dynamic-input-border-color, var(--sn-web-color-border-default));
  border-radius: var(--sn-web-input-radius, 6px);
  background-color: var(--sn-web-dynamic-input-bg, var(--sn-web-color-background-surface));
  color: var(--sn-web-dynamic-input-text-color, var(--sn-web-color-text-primary));
  font: inherit;
  padding: 0 var(--sn-web-input-padding-x, 10px);
  outline: none;
  transition: border-color 0.18s ease-out, box-shadow 0.18s ease-out;
}

.sn-dynamic-input__input::placeholder {
  color: var(--sn-web-input-placeholder-color, var(--sn-web-color-text-tertiary));
}

.sn-dynamic-input__input:focus {
  border-color: var(--sn-web-input-border-color-focus, var(--sn-web-color-action-primary));
  box-shadow: 0 0 0 3px var(--sn-web-focus-ring);
}

.sn-dynamic-input--mini .sn-dynamic-input__input { height: 22px; font-size: 11px; }
.sn-dynamic-input--tiny .sn-dynamic-input__input { height: 24px; font-size: 12px; }
.sn-dynamic-input--small .sn-dynamic-input__input { height: 28px; font-size: 13px; }
.sn-dynamic-input--medium .sn-dynamic-input__input { height: 32px; font-size: 14px; }
.sn-dynamic-input--large .sn-dynamic-input__input { height: 40px; font-size: 15px; }

/* Status cascade — status color wins over the focus border. */
.sn-dynamic-input--status-error .sn-dynamic-input__input {
  border-color: var(--sn-web-color-feedback-danger);
}
.sn-dynamic-input--status-warning .sn-dynamic-input__input {
  border-color: var(--sn-web-color-feedback-warning);
}

.sn-dynamic-input__input:disabled,
.sn-dynamic-input--disabled .sn-dynamic-input__input {
  background-color: var(--sn-web-color-background-subtle);
  color: var(--sn-web-color-text-disabled);
  cursor: not-allowed;
}

.sn-dynamic-input__input[readonly],
.sn-dynamic-input--readonly .sn-dynamic-input__input {
  background-color: var(--sn-web-color-background-subtle);
  cursor: default;
}

/* Row action buttons */
.sn-dynamic-input__actions {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.sn-dynamic-input__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--sn-web-dynamic-input-btn-size, 26px);
  height: var(--sn-web-dynamic-input-btn-size, 26px);
  border: 1px solid var(--sn-web-dynamic-input-border-color, var(--sn-web-color-border-default));
  border-radius: calc(var(--sn-web-input-radius, 6px) - 2px);
  background-color: var(--sn-web-dynamic-input-bg, var(--sn-web-color-background-surface));
  color: var(--sn-web-color-text-secondary);
  cursor: pointer;
  padding: 0;
  transition: color 0.15s ease-out, border-color 0.15s ease-out,
    background-color 0.15s ease-out;
}

.sn-dynamic-input__btn:hover:not(:disabled) {
  color: var(--sn-web-color-action-primary);
  border-color: var(--sn-web-color-action-primary);
}

.sn-dynamic-input__btn--remove:hover:not(:disabled) {
  color: var(--sn-web-color-feedback-danger);
  border-color: var(--sn-web-color-feedback-danger);
}

.sn-dynamic-input__btn:disabled {
  color: var(--sn-web-color-text-disabled);
  cursor: not-allowed;
}
</style>
