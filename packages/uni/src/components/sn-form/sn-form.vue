<script setup lang="ts">
/**
 * sn-form — uni-end form orchestrator (AUI-MP-004).
 *
 * Mirrors packages/vue-web/src/form/SnForm.vue. Differences are
 * shape-only:
 *   - <view> instead of <form> (uni does not always emit <form>)
 *   - rpx instead of px
 *   - @submit on the wrapping <view> via @tap on a child submit button
 *
 * Per AGENTS.md §58, this package does not import from `@snui/vue-web`.
 * Types / validators are duplicated under sn-form-types.ts and
 * sn-form-validator.ts.
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
    model: Record<string, unknown>
    rules?: FormRules
    showMessage?: boolean
    statusIcon?: boolean
    labelPosition?: 'left' | 'right' | 'top'
    labelWidth?: number | string
    disabled?: boolean

    /* ── wot-ui `wd-form` 1:1 parity props ─────────────────────────────── */

    /** When to fire field-level validation. */
    validateTrigger?: 'blur' | 'change'
    /** Reset every field's error state when the model is mutated externally. */
    resetOnChange?: boolean
    /** Error display strategy: inline message / toast / silent. */
    errorType?: 'message' | 'toast' | 'none'
    /** Add a hairline divider under every FormItem. */
    border?: boolean
    /** Vertically center every FormItem's control column. */
    center?: boolean
    /** Default size for descendant FormItems. */
    size?: 'small' | 'medium' | 'large'
    /** Right-align the field value column (Cell-style menus). */
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
  (e: 'validate', payload: { valid: boolean; errors: Record<string, string> }): void
  (e: 'reset'): void
  (e: 'submit', payload: { valid: boolean }): void
}>()

defineSlots<{
  default?(): unknown
}>()

const ctx = reactive({
  model: props.model,
  rules: props.rules,
  showMessage: props.showMessage,
  statusIcon: false,
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

ctx.model = props.model
ctx.rules = props.rules
ctx.showMessage = props.showMessage
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

const items = new Map<string, FormItemHandle>()
let registryOrder: string[] = []

const initialValues = new Map<string, unknown>()
for (const key of Object.keys(props.model)) {
  initialValues.set(key, deepClone(props.model[key]))
}

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

provide('sn-form-api' as never, { registerItem, unregisterItem } as never)

async function validate(): Promise<boolean> {
  const errors: Record<string, string> = {}
  let valid = true
  for (const prop of registryOrder) {
    const handle = items.get(prop)
    if (!handle) continue
    const ok = await handle.validate()
    if (!ok) {
      valid = false
      const state = (handle as FormItemHandle & { state?: FormItemState }).state
      if (state) errors[prop] = state.message.value
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

function submit(): void {
  void validate().then((valid) => emit('submit', { valid }))
}

const classes = computed(() => [
  'sn-form',
  `sn-form--label-${props.labelPosition}`,
  `sn-form--size-${props.size}`,
  `sn-form--value-align-${props.valueAlign}`,
  {
    'sn-form--disabled': props.disabled,
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
  submit,
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
  <view :class="classes" :data-size="size" :data-border="border" :data-center="center">
    <slot />
  </view>
</template>

<style scoped>
.sn-form {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.sn-form--disabled {
  opacity: 0.6;
  pointer-events: none;
}

/* Border between items — adds a hairline divider under every FormItem. */
.sn-form--border :deep(.sn-form-item) {
  padding-bottom: 24rpx;
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle, rgba(0, 0, 0, 0.06));
  margin-bottom: 24rpx;
}
.sn-form--border :deep(.sn-form-item:last-child) {
  border-bottom: none;
  margin-bottom: 0;
}

/* Vertically center the control column within each item. */
.sn-form--center :deep(.sn-form-item) {
  align-items: center;
}

/* Form-level size hint. */
.sn-form--size-small { font-size: 24rpx; }
.sn-form--size-medium { font-size: 28rpx; }
.sn-form--size-large { font-size: 32rpx; }

/* Doodle skin. */
.snui-skin-doodle.sn-form--border :deep(.sn-form-item) {
  border-bottom-style: dashed;
  border-bottom-color: #1a1a1a;
  border-bottom-width: 4rpx;
}
</style>