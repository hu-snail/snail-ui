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

    /* ── wot-ui `wd-form-item` 1:1 parity props ────────────────────────── */

    /** Item-level size — overrides the parent SnForm's size. */
    size?: 'small' | 'medium' | 'large'
    /** Right-align the field value within the cell. */
    valueAlign?: 'left' | 'right'
    /** Override the form-level asterisk position. */
    asteriskPosition?: 'left' | 'right'
    /** Override the form-level hide-asterisk flag. */
    hideAsterisk?: boolean | undefined
    /** Truncate long labels with ellipsis. */
    ellipsis?: boolean | undefined
    /** Add a horizontal divider below this item. */
    border?: boolean | undefined
    /** Override the form-level vertical center flag. */
    center?: boolean | undefined
    /** When true, the entire row is clickable and emits `click`. */
    clickable?: boolean
    /** Show a right arrow to indicate navigation. */
    isLink?: boolean
    /** Placeholder shown when no input slot is provided. */
    placeholder?: string
    /** Helper text shown below the field. */
    description?: string
  }>(),
  {
    showMessage: true,
    required: false,
    iconSize: 32,
    /* Inheritance-resolving booleans default to `undefined` so the
     * computed can distinguish 'not set' (inherit from form) from
     * 'explicitly false' via resolveBool. */
    hideAsterisk: undefined,
    border: undefined,
    center: undefined,
    ellipsis: undefined,
    clickable: false,
    isLink: false,
    placeholder: '',
    description: '',
  },
)

const slots = defineSlots<{
  default?(): unknown
  label?(): unknown
  error?(): unknown
  description?(): unknown
}>()

const ctx = inject(FORM_CONTEXT_KEY, null) as FormContext | null

const emit = defineEmits<{
  /** Fired when the row is clicked and `clickable` is true. */
  (e: 'click', event: Event): void
}>()

/**
 * Resolve a boolean prop with `undefined`-aware inheritance semantics:
 *  - if the FormItem passed a concrete value, that wins;
 *  - else fall back to the parent SnForm's value;
 *  - else fall back to `fallback`.
 *
 * `withDefaults` cannot capture this — passing nothing looks like the
 * default `false`, not 'inherit from context'.
 */
function resolveBool(
  propValue: boolean | undefined,
  ctxValue: boolean | undefined,
  fallback = false,
): boolean {
  return propValue !== undefined ? propValue : ctxValue !== undefined ? ctxValue : fallback
}

function onRowClick(event: Event): void {
  if (!props.clickable) return
  emit('click', event)
}

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
  `sn-form-item--${props.labelPosition ?? ctx?.labelPosition ?? 'right'}`,
  `sn-form-item--status-${status.value}`,
  `sn-form-item--size-${props.size ?? ctx?.size ?? 'medium'}`,
  `sn-form-item--value-align-${props.valueAlign ?? ctx?.valueAlign ?? 'left'}`,
  `sn-form-item--asterisk-${props.asteriskPosition ?? ctx?.asteriskPosition ?? 'left'}`,
  {
    'sn-form-item--required': !!props.required,
    'sn-form-item--disabled': !!ctx?.disabled,
    'sn-form-item--with-icon': hasIcon.value,
    'sn-form-item--border': resolveBool(props.border, ctx?.border),
    'sn-form-item--center': resolveBool(props.center, ctx?.center),
    'sn-form-item--ellipsis': resolveBool(props.ellipsis, ctx?.ellipsis),
    'sn-form-item--hide-asterisk': resolveBool(props.hideAsterisk, ctx?.hideAsterisk),
    'sn-form-item--clickable': !!props.clickable,
    'sn-form-item--is-link': !!props.isLink,
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
    @tap="onRowClick"
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
      <slot>
        <text v-if="placeholder && !slots.default" class="sn-form-item__placeholder">{{ placeholder }}</text>
      </slot>
      <view
        v-if="description || slots.description"
        class="sn-form-item__description"
      >
        <slot name="description">{{ description }}</slot>
      </view>
      <view
        v-if="showMsg"
        class="sn-form-item__message"
        :data-status="status"
        :aria-live="status === 'error' ? 'assertive' : 'polite'"
      >
        <slot name="error">{{ message }}</slot>
      </view>
      <text v-if="isLink" class="sn-form-item__arrow">›</text>
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
/* Asterisk on the right side of the label, mirrors wd-form-item. */
.sn-form-item--asterisk-right .sn-form-item__required {
  margin-left: 4rpx;
  margin-right: 0;
}

/* Ellipsis truncate long labels. */
.sn-form-item--ellipsis .sn-form-item__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

/* Border between this item and the next. */
.sn-form-item--border {
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle, rgba(0, 0, 0, 0.06));
  padding-bottom: 24rpx;
  margin-bottom: 24rpx;
}

/* Center the control column. */
.sn-form-item--center { align-items: center; }

/* Hide asterisk on required fields. */
.sn-form-item--hide-asterisk .sn-form-item__required { display: none; }

/* Clickable row. */
.sn-form-item--clickable {
  cursor: pointer;
}
.sn-form-item--clickable:active {
  background-color: var(--sn-mp-color-background-soft, rgba(0, 0, 0, 0.04));
}

/* Inline label icon — sized via SnIcon's own rpx box. */
.sn-form-item__icon {
  margin-right: 8rpx;
  color: var(--sn-mp-color-text-secondary);
}

/* Size variants — drives default font / line-height for the control. */
.sn-form-item--size-small .sn-form-item__label { font-size: 24rpx; line-height: 56rpx; }
.sn-form-item--size-medium .sn-form-item__label { font-size: 28rpx; line-height: 72rpx; }
.sn-form-item--size-large .sn-form-item__label { font-size: 32rpx; line-height: 88rpx; }

/* Right-aligned value column. */
.sn-form-item--value-align-right .sn-form-item__control { text-align: right; }

/* Placeholder for cell-style items without an input. */
.sn-form-item__placeholder {
  color: var(--sn-mp-color-text-tertiary);
}

/* Description text — wot-ui parity. */
.sn-form-item__description {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
  line-height: 1.4;
}

.sn-form-item__control {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8rpx;
  min-width: 0;
}
.sn-form-item--top .sn-form-item__control {
  flex-direction: column;
  align-items: stretch;
}

/* Right arrow for is-link rows. */
.sn-form-item__arrow {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 32rpx;
  line-height: 1;
  margin-left: auto;
  flex: 0 0 auto;
}

.sn-form-item__message {
  font-size: 24rpx;
  line-height: 1.4;
  flex: 1 1 100%;
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