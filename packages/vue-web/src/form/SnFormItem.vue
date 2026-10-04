<script setup lang="ts">
/**
 * SnFormItem — web-end field wrapper (AUI-WEB-004).
 *
 * Lives inside an SnForm. Provides:
 *   - label slot
 *   - default slot (typically SnInput or similar)
 *   - error-message line below the field
 *
 * Registers itself with the parent SnForm on mount via the
 * `registerItem` helper exposed through provide/inject. Exposes its
 * imperative handle so the form can iterate validate() / resetField()
 * without DOM lookups.
 */

import { computed, inject, onBeforeUnmount, onMounted, provide, ref } from 'vue'
import {
  FORM_CONTEXT_KEY,
  FORM_ITEM_STATE_KEY,
  type FormContext,
  type FormItemHandle,
  type FormItemState,
  type FormRule,
  getByPath,
  setByPath,
} from './sn-form-types'
import { validateValue } from './sn-form-validator'

defineOptions({ name: 'SnFormItem' })

const props = withDefaults(
  defineProps<{
    /** Dot-path into the form model. Matches the key in SnForm.rules. */
    prop?: string
    /** Visible field label (rendered through the `label` slot by default). */
    label?: string
    /** Marks the field as required — surfaces a * marker in the label. */
    required?: boolean
    /** Item-local rules. Merged with the parent SnForm's rules. */
    rules?: FormRule[]
    /** Show the message line. Inherits from SnForm by default. */
    showMessage?: boolean
    /** Override the form's label width for this item. */
    labelWidth?: number | string
    /** Override the form's label position for this item. */
    labelPosition?: 'left' | 'right' | 'top'
    /** Accessible label override (used when label is hidden but a11y needs an accessible name). */
    ariaLabel?: string
  }>(),
  {
    showMessage: true,
    required: false,
  },
)

const slots = defineSlots<{
  /** Default — the input element(s) for this field. */
  default?(): unknown
  /** Custom label content. Falls back to the `label` prop. */
  label?(): unknown
  /** Custom error / warning message content. */
  error?(): unknown
}>()

const ctx = inject(FORM_CONTEXT_KEY, null) as FormContext | null

/** Reactive error / warning state for this item. */
const status = ref<'default' | 'error' | 'warning'>('default')
const message = ref<string>('')

/** Initial value snapshot — used by `resetField()`. */
let initialValue: unknown = undefined

async function runValidation(): Promise<boolean> {
  if (!ctx || !props.prop) return true
  const rules = mergedRules()
  const value = getByPath(ctx.model, props.prop)
  const result = await validateValue(value, rules)
  if (result === '') {
    status.value = 'default'
    message.value = ''
    return true
  }
  status.value = 'error'
  message.value = result
  return false
}

function mergedRules(): FormRule[] {
  if (!ctx || !props.prop) return props.rules ?? []
  const formRules = ctx.rules[props.prop] ?? []
  return [...(props.rules ?? []), ...formRules]
}

const handle: FormItemHandle & { state?: FormItemState } = {
  prop: props.prop ?? '',
  async validate() {
    return runValidation()
  },
  resetField() {
    if (!ctx || !props.prop) return
    setByPath(ctx.model, props.prop, initialValue as never)
    status.value = 'default'
    message.value = ''
  },
  clearValidate() {
    status.value = 'default'
    message.value = ''
  },
}

// Wire state up so the parent can read it during validate().
const state: FormItemState = { status, message, handle }
handle.state = state
provide(FORM_ITEM_STATE_KEY, state)

// Register with the parent form (consume form's exposed API via a
// provide-key based event channel — see notes in SnForm.vue).
onMounted(() => {
  if (!ctx || !props.prop) return
  initialValue = deepClone(getByPath(ctx.model, props.prop))
  // Reach the form via the FormContext — the form has attached itself
  // via a side-channel provide.
  const form = (inject('sn-form-api' as never, null) as {
    registerItem?: (h: FormItemHandle) => void
  } | null)
  form?.registerItem?.(handle)
})

onBeforeUnmount(() => {
  if (!ctx || !props.prop) return
  const form = (inject('sn-form-api' as never, null) as {
    unregisterItem?: (prop: string) => void
  } | null)
  form?.unregisterItem?.(props.prop)
})

const showMsg = computed(() => {
  if (!ctx) return props.showMessage && message.value.length > 0
  const flag = props.showMessage !== undefined ? props.showMessage : ctx.showMessage
  return flag && message.value.length > 0
})

const classes = computed(() => [
  'sn-form-item',
  `sn-form-item--${ctx?.labelPosition ?? 'right'}`,
  `sn-form-item--status-${status.value}`,
  {
    'sn-form-item--required': !!props.required,
    'sn-form-item--disabled': !!ctx?.disabled,
  },
])

const labelStyle = computed(() => {
  const width = props.labelWidth ?? ctx?.labelWidth ?? 'auto'
  return width === 'auto' ? undefined : { width: typeof width === 'number' ? `${width}px` : width }
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
  <div
    :class="classes"
    :data-snui-component="props.prop ? 'form-item' : 'form-item-static'"
    :data-prop="props.prop"
    :data-status="status"
  >
    <label
      v-if="props.label || slots.label"
      class="sn-form-item__label"
      :style="labelStyle"
      :aria-label="ariaLabel"
    >
      <span v-if="required" class="sn-form-item__required" aria-hidden="true">*</span>
      <slot name="label">{{ props.label }}</slot>
    </label>

    <div class="sn-form-item__control">
      <slot />
      <p
        v-if="showMsg"
        class="sn-form-item__message"
        :data-status="status"
        :aria-live="status === 'error' ? 'assertive' : 'polite'"
      >
        <slot name="error">{{ message }}</slot>
      </p>
    </div>
  </div>
</template>

<style scoped>
.sn-form-item {
  display: grid;
  gap: 6px;
  align-items: start;
}
.sn-form-item--left,
.sn-form-item--right {
  grid-template-columns: auto 1fr;
  align-items: center;
}
.sn-form-item--left { grid-template-areas: 'label control'; }
.sn-form-item--right { grid-template-areas: 'label control'; }
.sn-form-item--left .sn-form-item__label { grid-area: label; text-align: left; }
.sn-form-item--right .sn-form-item__label { grid-area: label; text-align: right; }
.sn-form-item--top { grid-template-areas: 'label' 'control'; }
.sn-form-item--top .sn-form-item__label { grid-area: label; }

.sn-form-item__label {
  font-size: 13px;
  color: var(--sn-web-color-text-primary);
  padding: 0 8px 0 0;
  line-height: 32px;
}
.sn-form-item--top .sn-form-item__label {
  line-height: 1.4;
  padding: 0 0 4px;
}
.sn-form-item__required {
  color: var(--sn-web-color-feedback-danger);
  margin-right: 2px;
}

.sn-form-item__control {
  grid-area: control;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.sn-form-item__message {
  margin: 0;
  font-size: 12px;
  line-height: 1.4;
}
.sn-form-item__message[data-status="error"] {
  color: var(--sn-web-color-feedback-danger);
}
.sn-form-item__message[data-status="warning"] {
  color: var(--sn-web-color-feedback-warning);
}

.sn-form-item--disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>