<script setup lang="ts">
/**
 * SnForm — web-end form orchestrator (AUI-WEB-004).
 *
 * Phase 1 contract:
 *   - Provides a `FormContext` to descendant SnFormItem components
 *   - Tracks FormItems by their `prop` field so imperative
 *     `validate() / resetFields() / clearValidate()` can dispatch
 *     without DOM lookups
 *   - Emits `validate` with a `valid: boolean` payload after every
 *     full-form validation
 *
 * Per AGENTS.md §30/31: name / version / props / events / slots /
 * tokens / accessibility / capabilities declared in `defineProps` +
 * `defineEmits` + `defineSlots` + CSS variables.
 */

import { computed, onBeforeUnmount, provide, reactive, ref } from 'vue'
import {
  FORM_CONTEXT_KEY,
  type FormItemHandle,
  type FormItemState,
  FORM_ITEM_STATE_KEY,
  type FormRules,
  setByPath,
} from './sn-form-types'

defineOptions({ name: 'SnForm' })

const props = withDefaults(
  defineProps<{
    /**
     * Reactive model the form validates. Items read from here and write
     * back via v-model on SnInput (or the equivalent).
     */
    model: Record<string, unknown>
    /** Validation rules keyed by field `prop` (matches SnFormItem.prop). */
    rules?: FormRules
    /** Native form novalidate — disable browser HTML5 validation. */
    novalidate?: boolean
    /** Show the message line below each FormItem. */
    showMessage?: boolean
    /** Show an icon next to the message (success / warning / error). */
    statusIcon?: boolean
    /** Label position for child FormItems. */
    labelPosition?: 'left' | 'right' | 'top'
    /** Label width for child FormItems (number = px, string = CSS length). */
    labelWidth?: number | string
    /** Disable the entire form — propagated to every FormItem. */
    disabled?: boolean
  }>(),
  {
    rules: () => ({}),
    novalidate: true,
    showMessage: true,
    statusIcon: false,
    labelPosition: 'right',
    labelWidth: 'auto',
    disabled: false,
  },
)

const emit = defineEmits<{
  /** Emitted once when validate() finishes. `valid` is true iff every field passed. */
  (e: 'validate', payload: { valid: boolean; errors: Record<string, string> }): void
  /** Emitted on resetFields(). */
  (e: 'reset'): void
  /** Emitted on submit. Fires after validate(). `valid` is the result. */
  (e: 'submit', payload: { valid: boolean }): void
}>()

defineSlots<{
  /** Default slot — typically SnFormItem + SnButton submit. */
  default?(): unknown
}>()

/** Reactive context object the form shares with descendant items. */
const ctx = reactive({
  model: props.model,
  rules: props.rules,
  showMessage: props.showMessage,
  statusIcon: props.statusIcon,
  labelPosition: props.labelPosition,
  labelWidth: props.labelWidth,
  disabled: props.disabled,
})

// Keep ctx in sync with prop changes.
ctx.model = props.model
ctx.rules = props.rules
ctx.showMessage = props.showMessage
ctx.statusIcon = props.statusIcon
ctx.labelPosition = props.labelPosition
ctx.labelWidth = props.labelWidth
ctx.disabled = props.disabled

provide(FORM_CONTEXT_KEY, ctx)

/**
 * Map of registered FormItem handles keyed by `prop`.
 * FormItems call `provide(FORM_ITEM_STATE_KEY, state)` on mount and
 * a `registerItem` helper (defined below) records them.
 *
 * Using a Map (not reactive Set) so adding/removing doesn't trigger
 * downstream re-renders.
 */
const items = new Map<string, FormItemHandle>()
let registryOrder: string[] = []

/** Initial values captured at mount — used by `resetFields()`. */
const initialValues = new Map<string, unknown>()
for (const key of Object.keys(props.model)) {
  initialValues.set(key, deepClone(props.model[key]))
}

/**
 * Public imperative API. Consumed by SnFormItem.send events to register
 * themselves, and exposed via the form's own template ref so apps can
 * call `validate() / resetFields()` from outside.
 */
function registerItem(handle: FormItemHandle): void {
  items.set(handle.prop, handle)
  if (!registryOrder.includes(handle.prop)) registryOrder.push(handle.prop)
  if (!initialValues.has(handle.prop)) {
    initialValues.set(handle.prop, deepClone(ctx.model[handle.prop]))
  }
}

function unregisterItem(prop: string): void {
  items.delete(prop)
  registryOrder = registryOrder.filter((p) => p !== prop)
}

/**
 * Side-channel API surface that descendant FormItems pick up via
 * `inject('sn-form-api')`. Kept separate from `FORM_CONTEXT_KEY`
 * (data-only) so items can be type-narrow without touching the
 * imperative handle set.
 */
const api = {
  registerItem,
  unregisterItem,
}
provide('sn-form-api' as never, api as never)

async function validate(): Promise<boolean> {
  const errors: Record<string, string> = {}
  let valid = true
  for (const prop of registryOrder) {
    const handle = items.get(prop)
    if (!handle) continue
    const ok = await handle.validate()
    if (!ok) {
      valid = false
      const itemState = itemStateFor(prop)
      if (itemState) errors[prop] = itemState.message.value
    }
  }
  emit('validate', { valid, errors })
  return valid
}

async function validateField(prop: string | string[]): Promise<boolean> {
  const props = Array.isArray(prop) ? prop : [prop]
  let valid = true
  for (const p of props) {
    const handle = items.get(p)
    if (!handle) continue
    const ok = await handle.validate()
    if (!ok) valid = false
  }
  return valid
}

function resetFields(): void {
  for (const [prop, value] of initialValues) {
    setByPath(ctx.model, prop, value as never)
  }
  for (const handle of items.values()) {
    handle.resetField()
  }
  emit('reset')
}

function clearValidate(prop?: string | string[]): void {
  if (!prop) {
    for (const handle of items.values()) handle.clearValidate()
    return
  }
  const targets = Array.isArray(prop) ? prop : [prop]
  for (const p of targets) {
    items.get(p)?.clearValidate()
  }
}

const itemStateFor = (prop: string): FormItemState | undefined => {
  // Each FormItem also exposes its state via provide — we ask via the
  // known FormItemHandle chain rather than the injection chain.
  // The FormItem stores its state on its handle via closure, so we
  // surface the message through the FormItem's exposed state object.
  const handle = items.get(prop)
  if (!handle) return undefined
  // The handle is augmented by SnFormItem with a `state` reference.
  return (handle as FormItemHandle & { state?: FormItemState }).state
}

function onSubmit(event: Event): void {
  if (props.novalidate) event.preventDefault()
  void validate().then((valid) => emit('submit', { valid }))
}

const classes = computed(() => [
  'sn-form',
  `sn-form--label-${props.labelPosition}`,
  {
    'sn-form--disabled': props.disabled,
    'sn-form--status-icon': props.statusIcon,
  },
])

defineExpose({
  validate,
  validateField,
  resetFields,
  clearValidate,
  registerItem,
  unregisterItem,
})

onBeforeUnmount(() => {
  items.clear()
  registryOrder = []
  initialValues.clear()
})

function deepClone<T>(value: T): T {
  if (value === null || value === undefined) return value
  if (typeof value !== 'object') return value
  if (Array.isArray(value)) return value.map(deepClone) as unknown as T
  const out: Record<string, unknown> = {}
  for (const k of Object.keys(value as Record<string, unknown>)) {
    out[k] = deepClone((value as Record<string, unknown>)[k])
  }
  return out as unknown as T
}
</script>

<template>
  <form
    :class="classes"
    :novalidate="novalidate"
    @submit="onSubmit"
    @submit.prevent
  >
    <slot />
  </form>
</template>

<style scoped>
.sn-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.sn-form--label-top {
  flex-direction: column;
}
.sn-form--label-left,
.sn-form--label-right {
  /* items manage their own labels via SnFormItem */
}
.sn-form--disabled {
  opacity: 0.6;
  pointer-events: none;
}
</style>