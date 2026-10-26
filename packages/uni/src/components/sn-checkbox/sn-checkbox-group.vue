<script setup lang="ts">
/**
 * sn-checkbox-group (uni-end) — checkbox group container for mobile.
 *
 * Reference library: wot-ui `wd-checkbox-group`
 *   (https://wot-ui.cn/component/checkbox.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-checkbox-group 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-checkbox/sn-checkbox-group.vue
 * → auto-registered as `<sn-checkbox-group>` in any .vue that uses it.
 * (Same directory as sn-checkbox so the provide/inject contract types stay
 * next to both halves of the pair.)
 *
 * The group owns the array `v-model`; children (`sn-checkbox`) read the
 * selection through `provide`/`inject` (`sn-checkbox-types.ts`) and inherit
 * every `undefined` prop from here — that is exactly wd-checkbox's
 * "继承自 CheckboxGroup" contract.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 * No business logic.
 *
 * Not responsible for:
 *   - 单个选项的渲染 — 用 sn-checkbox
 *   - 校验信息展示 — 用 sn-form-item
 */

import { computed, provide, toRef } from 'vue'
import {
  SN_CHECKBOX_GROUP_KEY,
  type SnCheckboxChild,
  type SnCheckboxDirection,
  type SnCheckboxPlacement,
  type SnCheckboxSize,
  type SnCheckboxType,
  type SnCheckboxValue,
} from './sn-checkbox-types'

defineOptions({ name: 'SnCheckboxGroup' })

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-checkbox-group` 1:1 surface ─────────────────────────── */

    /** Selected values (v-model array). */
    modelValue?: SnCheckboxValue[]
    /** Shape preset inherited by every child. */
    type?: SnCheckboxType
    /** Checked color inherited by every child (empty = token default). */
    checkedColor?: string
    /** Unchecked color inherited by every child (empty = token default). */
    uncheckedColor?: string
    /** Disables every child. */
    disabled?: boolean
    /** Makes every child read-only. */
    readonly?: boolean
    /** Minimum number of selected values; `0` means unconstrained. */
    min?: number
    /** Maximum number of selected values; `0` means unconstrained. */
    max?: number
    /** Size preset inherited by every child. */
    size?: SnCheckboxSize
    /** Tick position inherited by every child. */
    placement?: SnCheckboxPlacement
    /** Layout direction of the children. */
    direction?: SnCheckboxDirection
    /** Class on the root wrapper. */
    customClass?: string
    /** Inline style on the root wrapper. */
    customStyle?: string
  }>(),
  {
    modelValue: () => [],
    type: 'circle',
    checkedColor: '',
    uncheckedColor: '',
    disabled: false,
    readonly: false,
    min: 0,
    max: 0,
    size: undefined,
    placement: 'left',
    direction: 'vertical',
    customClass: '',
    customStyle: '',
  },
)

const emit = defineEmits<{
  /** v-model sync — fires with the full next selection array. */
  (e: 'update:modelValue', value: SnCheckboxValue[]): void
  /** Selection changed (alias of `update:modelValue`, wd-checkbox-group parity). */
  (e: 'change', value: SnCheckboxValue[]): void
}>()

const selection = computed<SnCheckboxValue[]>(() => props.modelValue ?? [])

/** Whether `name` is currently selected. */
function isChecked(name: SnCheckboxValue): boolean {
  return selection.value.includes(name)
}

/**
 * Apply a selection change for `name`.
 *
 * `min` / `max` gate the change the way wd-checkbox-group does: exceeding
 * `max` is a silent no-op (the child stays unchecked), and dropping below
 * `min` keeps the last required entry selected.
 */
function toggle(name: SnCheckboxValue, nextChecked: boolean): void {
  if (props.disabled || props.readonly) return
  const current = selection.value
  if (nextChecked) {
    if (current.includes(name)) return
    if (props.max > 0 && current.length >= props.max) return
    commit([...current, name])
    return
  }
  if (!current.includes(name)) return
  if (props.min > 0 && current.length <= props.min) return
  commit(current.filter(v => v !== name))
}

function commit(next: SnCheckboxValue[]): void {
  emit('update:modelValue', next)
  emit('change', next)
}

/**
 * Registered children — keyed by `name` so `toggleAll` can enumerate the real
 * options and honour `skipDisabled` without inspecting the DOM. Children
 * register on mount and unregister on unmount (§41: no leaks).
 */
const children = new Map<SnCheckboxValue, SnCheckboxChild>()

function registerChild(child: SnCheckboxChild): void {
  children.set(child.name, child)
}

function unregisterChild(name: SnCheckboxValue): void {
  children.delete(name)
}

provide(SN_CHECKBOX_GROUP_KEY, {
  isChecked,
  toggle,
  groupDisabled: toRef(props, 'disabled'),
  groupReadonly: toRef(props, 'readonly'),
  groupType: toRef(props, 'type'),
  groupCheckedColor: toRef(props, 'checkedColor'),
  groupUncheckedColor: toRef(props, 'uncheckedColor'),
  groupSize: toRef(props, 'size'),
  groupPlacement: toRef(props, 'placement'),
  groupDirection: toRef(props, 'direction'),
  registerChild,
  unregisterChild,
})

/**
 * Select / deselect every registered child at once — mirrors
 * wd-checkbox-group's `toggleAll`. `min` / `max` still apply, and
 * `skipDisabled` leaves disabled children untouched.
 */
function toggleAll(checked: boolean, skipDisabled = false): void {
  if (props.disabled || props.readonly) return
  const eligible = [...children.values()].filter(
    child => !(skipDisabled && child.isDisabled()),
  )
  if (checked) {
    const next = [...selection.value]
    for (const child of eligible) {
      if (props.max > 0 && next.length >= props.max) break
      if (!next.includes(child.name)) next.push(child.name)
    }
    commit(next)
    return
  }
  const kept = selection.value.filter(
    value => !eligible.some(child => child.name === value),
  )
  const floor = props.min > 0 ? props.min : 0
  if (kept.length >= floor) commit(kept)
}

/** Public imperative API — host pages drive the group without internals (§14). */
defineExpose({ toggle, toggleAll, isChecked })

const classList = computed(() => [
  'sn-checkbox-group',
  `sn-checkbox-group--${props.direction}`,
  {
    'sn-checkbox-group--disabled': props.disabled,
    'sn-checkbox-group--readonly': props.readonly,
  },
  props.customClass,
])

const wrapperStyle = computed(() => props.customStyle || undefined)
</script>

<template>
  <view
    :class="classList"
    :style="wrapperStyle"
    :data-snui-component="'checkbox-group'"
    role="group"
  >
    <slot />
  </view>
</template>

<style scoped>
.sn-checkbox-group {
  display: flex;
  gap: var(--sn-mp-spacing-3);
  font-family: inherit;
  color: var(--sn-mp-color-text-primary);
}

.sn-checkbox-group--vertical {
  flex-direction: column;
  align-items: flex-start;
}

.sn-checkbox-group--horizontal {
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}

.sn-checkbox-group--disabled {
  opacity: 0.6;
}

/* Doodle skin — thicker gap so the hand-drawn ticks do not touch. */
.snui-skin-doodle .sn-checkbox-group {
  gap: var(--sn-mp-spacing-4);
}
</style>
