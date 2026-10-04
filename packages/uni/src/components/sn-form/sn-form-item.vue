<script setup lang="ts">
/**
 * sn-form-item — uni-end field wrapper (AUI-MP-004).
 *
 * Mirror of packages/vue-web/src/form/SnFormItem.vue with the same
 * rules-engine and provide/inject contract; only the rendering
 * surface is uni-shaped (view + rpx).
 */

import { computed, inject, markRaw, onBeforeUnmount, onMounted, provide, ref } from 'vue'
import SnIcon from '../sn-icon/sn-icon.vue'
import type { IconData } from '../sn-icon/sn-icon.vue'
import { resolveIconByName } from '../sn-icon/sn-icon-registry'
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
    prop?: string
    label?: string
    required?: boolean
    rules?: FormRule[]
    showMessage?: boolean
    labelWidth?: number | string
    labelPosition?: 'left' | 'right' | 'top'
    ariaLabel?: string
    /**
     * Optional icon data (frozen `{ viewBox, paths }`) rendered inline
     * with the label. Use `iconName` for the registry lookup path.
     */
    iconData?: IconData
    /** Icon name resolved via the sn-icon registry. */
    iconName?: string
    /** rpx / pixel size forwarded to the embedded sn-icon. Default 32. */
    iconSize?: number | string
  }>(),
  {
    showMessage: true,
    required: false,
    iconSize: 32,
  },
)

const slots = defineSlots<{
  default?(): unknown
  label?(): unknown
  error?(): unknown
}>()

const ctx = inject(FORM_CONTEXT_KEY, null) as FormContext | null

const status = ref<'default' | 'error' | 'warning'>('default')
const message = ref<string>('')

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

const state: FormItemState = { status, message, handle }
handle.state = state
provide(FORM_ITEM_STATE_KEY, state)

onMounted(() => {
  if (!ctx || !props.prop) return
  initialValue = deepClone(getByPath(ctx.model, props.prop))
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

/** Resolved icon data (uni). */
const resolvedIconData = computed<IconData | null>(() => {
  const icon = props.iconData ?? (props.iconName ? resolveIconByName(props.iconName) : null)
  return icon ? markRaw(icon) : null
})

const hasIcon = computed(() => resolvedIconData.value !== null)

const classes = computed(() => [
  'sn-form-item',
  `sn-form-item--${ctx?.labelPosition ?? 'right'}`,
  `sn-form-item--status-${status.value}`,
  {
    'sn-form-item--required': !!props.required,
    'sn-form-item--disabled': !!ctx?.disabled,
    'sn-form-item--with-icon': hasIcon.value,
  },
])

const labelStyle = computed(() => {
  const width = props.labelWidth ?? ctx?.labelWidth ?? 'auto'
  return width === 'auto'
    ? undefined
    : { width: typeof width === 'number' ? `${width}rpx` : width }
})

const gridStyle = computed(() => {
  const position = props.labelPosition ?? ctx?.labelPosition ?? 'right'
  if (position === 'top') return undefined
  const width = props.labelWidth ?? ctx?.labelWidth ?? 'auto'
  const track = width === 'auto' ? 'auto' : typeof width === 'number' ? `${width}rpx` : width
  return { gridTemplateColumns: `${track} 1fr` }
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
  <view
    :class="classes"
    :style="gridStyle"
    :data-snui-component="props.prop ? 'form-item' : 'form-item-static'"
    :data-prop="props.prop"
    :data-status="status"
  >
    <view
      v-if="props.label || slots.label"
      class="sn-form-item__label"
      :style="labelStyle"
      :aria-label="ariaLabel"
    >
      <text v-if="required" class="sn-form-item__required" aria-hidden="true">*</text>
      <SnIcon
        v-if="resolvedIconData"
        class="sn-form-item__icon"
        :icon="resolvedIconData"
        :size="iconSize ?? 32"
      />
      <slot name="label">{{ props.label }}</slot>
    </view>

    <view class="sn-form-item__control">
      <slot />
      <view
        v-if="showMsg"
        class="sn-form-item__message"
        :data-status="status"
        :aria-live="status === 'error' ? 'assertive' : 'polite'"
      >
        <slot name="error">{{ message }}</slot>
      </view>
    </view>
  </view>
</template>

<style scoped>
.sn-form-item {
  display: grid;
  gap: 12rpx;
  align-items: start;
}
.sn-form-item--left,
.sn-form-item--right {
  grid-template-columns: auto 1fr;
  align-items: center;
}
.sn-form-item--left .sn-form-item__label { grid-area: auto; text-align: left; }
.sn-form-item--right .sn-form-item__label { grid-area: auto; text-align: right; }
.sn-form-item--top { grid-template-areas: 'auto' 'auto'; }

.sn-form-item__label {
  font-size: 26rpx;
  color: var(--sn-mp-color-text-primary);
  padding: 0 16rpx 0 0;
  line-height: 1.4;
}
.sn-form-item__required {
  color: var(--sn-mp-color-feedback-danger);
  margin-right: 4rpx;
}

/* Inline label icon — sized via SnIcon's own rpx box. */
.sn-form-item__icon {
  margin-right: 8rpx;
  color: var(--sn-mp-color-text-secondary);
}

.sn-form-item__control {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  min-width: 0;
}

.sn-form-item__message {
  font-size: 24rpx;
  line-height: 1.4;
}
.sn-form-item__message[data-status="error"] {
  color: var(--sn-mp-color-feedback-danger);
}
.sn-form-item__message[data-status="warning"] {
  color: var(--sn-mp-color-feedback-warning);
}

.sn-form-item--disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>