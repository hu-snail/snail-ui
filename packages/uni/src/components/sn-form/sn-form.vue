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
  }>(),
  {
    rules: () => ({}),
    showMessage: true,
    statusIcon: false,
    labelPosition: 'right',
    labelWidth: 'auto',
    disabled: false,
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
})

ctx.model = props.model
ctx.rules = props.rules
ctx.showMessage = props.showMessage
ctx.labelPosition = props.labelPosition
ctx.labelWidth = props.labelWidth
ctx.disabled = props.disabled

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
  {
    'sn-form--disabled': props.disabled,
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
  <view :class="classes">
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
</style>