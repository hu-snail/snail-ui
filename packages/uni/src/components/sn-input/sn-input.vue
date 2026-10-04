<script setup lang="ts">
/**
 * sn-input — uni-end text input component (AUI-MP-003).
 *
 * Phase 1 contract: mirrors the surface area of the web `SnInput`
 * (AUI-WEB-003) but tuned for mobile ergonomics:
 *   - 3 sizes (small/medium/large) instead of 4
 *   - rpx instead of px
 *   - `textarea` is supported via the `<textarea>` cross-end element
 *   - `autosize` is omitted on uni-end (unreliable across MP vendors)
 *
 * Per AGENTS.md §32, this component handles rendering + interaction +
 * DOM bridge only. Validation rules live on `sn-form-item`.
 */

import { computed, useId, useSlots } from 'vue'

defineOptions({ name: 'SnInput' })

const props = withDefaults(
  defineProps<{
    /** Bound value. Coerced to `number` when type='number'. */
    modelValue?: string | number
    /** Native input type. */
    type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search' | 'textarea'
    /** Mobile-first size preset. */
    size?: 'small' | 'medium' | 'large'
    /** Placeholder text. */
    placeholder?: string
    /** Disables interaction. */
    disabled?: boolean
    /** Read-only — value is visible but not editable. */
    readonly?: boolean
    /** Required for form submission. Renders `aria-required`. */
    required?: boolean
    /** Accessible label. */
    ariaLabel?: string
    /** Max character length (cross-end: most MP vendors honor this). */
    maxlength?: number
    /** Min character length. */
    minlength?: number
    /** Show the running `current / max` counter (right-aligned). */
    showCount?: boolean
    /** Show × button to clear value. */
    clearable?: boolean
    /** Visual status. Driven by FormItem validation. */
    status?: 'default' | 'error' | 'warning'
    /** Lower bound (numeric input only). */
    min?: number
    /** Upper bound (numeric input only). */
    max?: number
    /** Step (numeric input only). */
    step?: number
    /** Textarea row count (textarea only). */
    rows?: number
  }>(),
  {
    modelValue: '',
    type: 'text',
    size: 'medium',
    placeholder: '',
    disabled: false,
    readonly: false,
    required: false,
    showCount: false,
    clearable: false,
    status: 'default',
    rows: 3,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'input', value: string | number, event: Event): void
  (e: 'change', value: string | number, event: Event): void
  (e: 'focus', event: Event): void
  (e: 'blur', event: Event): void
  (e: 'clear'): void
}>()

defineSlots<{
  default?(): unknown
  prefix?(): unknown
  suffix?(): unknown
  'clear-icon'?(): unknown
  count?(): unknown
}>()

const inputId = useId()
const slots = useSlots()

/** DOM-bound value (always string). */
const nativeValue = computed<string>(() =>
  props.modelValue === null || props.modelValue === undefined
      ? ''
      : String(props.modelValue),
)

const isTextarea = computed(() => props.type === 'textarea')
const textareaRows = computed(() => props.rows ?? 3)

const showClear = computed(
  () => props.clearable && !props.disabled && !props.readonly && nativeValue.value.length > 0,
)

const currentLength = computed(() => nativeValue.value.length)

const ariaInvalid = computed(() => props.status === 'error' ? 'true' : undefined)

function onInput(event: Event): void {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  const raw = target.value
  const next: number | string = props.type === 'number' && raw !== '' ? Number(raw) : raw
  emit('update:modelValue', next)
  emit('input', next, event)
}

function onChange(event: Event): void {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  const raw = target.value
  const next: number | string = props.type === 'number' && raw !== '' ? Number(raw) : raw
  emit('change', next, event)
}

function onFocus(event: Event): void {
  emit('focus', event)
}

function onBlur(event: Event): void {
  emit('blur', event)
}

function onClear(): void {
  emit('update:modelValue', '')
  emit('clear')
}

const classList = computed(() => [
  'sn-input',
  `sn-input--${props.size}`,
  `sn-input--${props.type}`,
  {
    'sn-input--disabled': props.disabled,
    'sn-input--readonly': props.readonly,
    'sn-input--clearable': props.clearable,
    [`sn-input--status-${props.status}`]: props.status !== 'default',
    'sn-input--with-prefix': !!slots.prefix,
    'sn-input--with-suffix': !!slots.suffix,
    'sn-input--with-count': props.showCount,
  },
])
</script>

<template>
  <view
    :class="classList"
    :data-snui-component="isTextarea ? 'textarea' : 'input'"
    :data-size="size"
    :data-status="status"
  >
    <view v-if="slots.prefix" class="sn-input__prefix" aria-hidden="true">
      <slot name="prefix" />
    </view>

    <textarea
      v-if="isTextarea"
      :id="inputId"
      class="sn-input__native"
      :value="nativeValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :rows="textareaRows"
      :aria-label="ariaLabel"
      :aria-invalid="ariaInvalid"
      :aria-required="required ? 'true' : undefined"
      @input="onInput"
      @change="onChange"
      @focus="onFocus"
      @blur="onBlur"
    />

    <input
      v-else
      :id="inputId"
      class="sn-input__native"
      :type="type"
      :value="nativeValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :minlength="minlength"
      :min="min"
      :max="max"
      :step="step"
      :aria-label="ariaLabel"
      :aria-invalid="ariaInvalid"
      :aria-required="required ? 'true' : undefined"
      @input="onInput"
      @change="onChange"
      @focus="onFocus"
      @blur="onBlur"
    />

    <view v-if="showClear" class="sn-input__clear" aria-hidden="true">
      <view
        class="sn-input__clear-btn"
        :aria-label="ariaLabel ? `Clear ${ariaLabel}` : 'Clear input'"
        @tap.stop="onClear"
      >
        <slot name="clear-icon">×</slot>
      </view>
    </view>

    <view v-else-if="slots.suffix" class="sn-input__suffix" aria-hidden="true">
      <slot name="suffix" />
    </view>

    <view v-if="showCount" class="sn-input__count" aria-live="polite">
      <slot name="count" :current="currentLength" :max="maxlength">
        {{ currentLength }}{{ maxlength ? ` / ${maxlength}` : '' }}
      </slot>
    </view>
  </view>
</template>

<style scoped>
/**
 * Geometry in rpx — uni-app uses rpx for cross-device sizing on every
 * compile target (H5 / WeChat MP / App). Color tokens resolve via the
 * `--sn-mp-*` alias layer that ships from `@snui/tokens-mp`.
 */
.sn-input {
  display: inline-flex;
  align-items: center;
  gap: 12rpx;
  position: relative;
  padding: 0 var(--sn-mp-input-padding-x, 20rpx);
  border: 2rpx solid var(--sn-mp-input-border-color, var(--sn-mp-color-border-default));
  border-radius: var(--sn-mp-input-radius, 12rpx);
  background-color: var(--sn-mp-input-bg, var(--sn-mp-color-background-surface));
  color: var(--sn-mp-input-text-color, var(--sn-mp-color-text-primary));
  font-family: inherit;
  line-height: 1;
  box-sizing: border-box;
}

.sn-input:focus-within {
  border-color: var(--sn-mp-input-border-color-focus, var(--sn-mp-color-action-primary));
}

/* Sizes */
.sn-input--small { height: 56rpx; font-size: 24rpx; }
.sn-input--medium { height: 72rpx; font-size: 28rpx; }
.sn-input--large { height: 88rpx; font-size: 32rpx; }

/* Status */
.sn-input--status-error { border-color: var(--sn-mp-color-feedback-danger); }
.sn-input--status-warning { border-color: var(--sn-mp-color-feedback-warning); }

/* States */
.sn-input--disabled,
.sn-input--disabled .sn-input__native { cursor: not-allowed; opacity: 0.5; }
.sn-input--readonly .sn-input__native { cursor: default; }

/* Native input/textarea fill the available row */
.sn-input__native {
  flex: 1 1 auto;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: inherit;
  font: inherit;
  line-height: 1.4;
  padding: 0;
}
.sn-input__native::placeholder {
  color: var(--sn-mp-input-placeholder-color, var(--sn-mp-color-text-tertiary));
}

textarea.sn-input__native {
  resize: vertical;
  padding: 8rpx 0;
}

/* Prefix / suffix */
.sn-input__prefix,
.sn-input__suffix {
  display: inline-flex;
  align-items: center;
  color: var(--sn-mp-color-text-secondary);
  font-size: 0.9em;
  flex: 0 0 auto;
}

/* Clear button */
.sn-input__clear {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
}
.sn-input__clear-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32rpx;
  height: 32rpx;
  background: var(--sn-mp-color-background-elevated, rgba(0, 0, 0, 0.06));
  color: var(--sn-mp-color-text-secondary);
  border-radius: 50%;
  font-size: 24rpx;
  line-height: 1;
  cursor: pointer;
}

/* Count */
.sn-input__count {
  font-size: 22rpx;
  color: var(--sn-mp-color-text-tertiary);
  flex: 0 0 auto;
  min-width: 60rpx;
  text-align: right;
  line-height: 1;
}

/* Textarea wrapper layout */
.sn-input--textarea {
  flex-direction: column;
  align-items: stretch;
  height: auto;
  padding: 12rpx var(--sn-mp-input-padding-x, 20rpx);
}
.sn-input--textarea .sn-input__count {
  align-self: flex-end;
  margin-top: 4rpx;
}
</style>