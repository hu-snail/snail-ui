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

import { computed, onBeforeUnmount, provide, reactive } from 'vue'
import {
  FORM_CONTEXT_KEY,
  type FormItemHandle,
  type FormItemState,
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

    /* ── wot-ui `wd-form` 1:1 parity props ─────────────────────────────── */

    /**
     * When to fire field-level validation. `blur` validates on blur;
     * `change` validates on every input change. Defaults to `blur`.
     */
    validateTrigger?: 'blur' | 'change'
    /**
     * Reset every field's error state when the model is mutated
     * externally (e.g. after a successful submit). Defaults to `true`
     * to mirror Element Plus / Ant Design forms.
     */
    resetOnChange?: boolean
    /**
     * Error display strategy:
     *  - `message` — inline message under the offending field (default)
     *  - `toast`   — emit `validate` event and let the host show a toast
     *  - `none`    — silently validate (return value is still authoritative)
     */
    errorType?: 'message' | 'toast' | 'none'
    /** Add a horizontal divider between every FormItem. */
    border?: boolean
    /** Vertically center every FormItem's control column. */
    center?: boolean
    /** Default size for descendant FormItems. */
    size?: 'small' | 'medium' | 'large'
    /**
     * Right-align the field value within the cell (when items render as
     * a list / menu). Mirrors wd-form `value-align`.
     */
    valueAlign?: 'left' | 'right'
    /** Asterisk position for required fields. */
    asteriskPosition?: 'left' | 'right'
    /** Hide the asterisk on required fields. */
    hideAsterisk?: boolean
    /** Truncate long labels with ellipsis. */
    ellipsis?: boolean
  }>(),
  {
    rules: () => ({}),
    novalidate: true,
    showMessage: true,
    statusIcon: false,
    labelPosition: 'right',
    labelWidth: 'auto',
    disabled: false,
    validateTrigger: 'blur',
    resetOnChange: true,
    errorType: 'message',
    border: false,
    center: false,
    size: 'medium',
    valueAlign: 'left',
    asteriskPosition: 'left',
    hideAsterisk: false,
    ellipsis: false,
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
  validateTrigger: props.validateTrigger,
  resetOnChange: props.resetOnChange,
  errorType: props.errorType,
  size: props.size,
  valueAlign: props.valueAlign,
  asteriskPosition: props.asteriskPosition,
  hideAsterisk: props.hideAsterisk,
  ellipsis: props.ellipsis,
  border: props.border,
  center: props.center,
})

// Keep ctx in sync with prop changes.
ctx.model = props.model
ctx.rules = props.rules
ctx.showMessage = props.showMessage
ctx.statusIcon = props.statusIcon
ctx.labelPosition = props.labelPosition
ctx.labelWidth = props.labelWidth
ctx.disabled = props.disabled
ctx.validateTrigger = props.validateTrigger
ctx.resetOnChange = props.resetOnChange
ctx.errorType = props.errorType
ctx.size = props.size
ctx.valueAlign = props.valueAlign
ctx.asteriskPosition = props.asteriskPosition
ctx.hideAsterisk = props.hideAsterisk
ctx.ellipsis = props.ellipsis
ctx.border = props.border
ctx.center = props.center

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
  `sn-form--size-${props.size}`,
  `sn-form--value-align-${props.valueAlign}`,
  {
    'sn-form--disabled': props.disabled,
    'sn-form--status-icon': props.statusIcon,
    'sn-form--border': props.border,
    'sn-form--center': props.center,
    'sn-form--hide-asterisk': props.hideAsterisk,
    'sn-form--ellipsis': props.ellipsis,
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
    :data-size="size"
    :data-border="border"
    :data-center="center"
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

/* Border between items — adds a hairline divider under every FormItem. */
.sn-form--border :deep(.sn-form-item) {
  padding-bottom: 12px;
  border-bottom: 1px solid var(--sn-web-color-border-subtle, rgba(0, 0, 0, 0.06));
  margin-bottom: 12px;
}
.sn-form--border :deep(.sn-form-item:last-child) {
  border-bottom: none;
  margin-bottom: 0;
}

/* Vertically center the control column within each item. */
.sn-form--center :deep(.sn-form-item) {
  align-items: center;
}

/* Form-level size hint — FormItems with no override inherit this. */
.sn-form--size-small { font-size: 12px; }
.sn-form--size-medium { font-size: 14px; }
.sn-form--size-large { font-size: 15px; }

/* Doodle skin: dashed ink separators between items. */
.snui-skin-doodle.sn-form--border :deep(.sn-form-item) {
  border-bottom-style: dashed;
  border-bottom-color: #1a1a1a;
  border-bottom-width: 2px;
}
</style>