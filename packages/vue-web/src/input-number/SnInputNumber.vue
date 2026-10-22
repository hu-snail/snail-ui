<script setup lang="ts">
/**
 * SnInputNumber — web-end numeric input with steppers (naive-ui 1:1 parity).
 *
 * Independent implementation (not built on SnInput internals) with visual
 * tokens aligned to SnInput (`--sn-web-input-*`, `sn-input-number--{size}`).
 *
 * Steppers follow naive-ui's InputNumber: transparent icon text-buttons —
 * `buttonPlacement="right"` (default) renders the − / + pair side by side in
 * the tail; `"both"` splits minus into the head (prefix side) and plus into
 * the tail. No divider chrome; the icon tints with the action colour on
 * hover and fades to the disabled colour at bounds.
 *
 * Per AGENTS.md §30/31: contract declared via defineProps/defineEmits/
 * defineSlots + CSS variables. a11y: role="spinbutton" on the native input
 * with aria-valuenow / aria-valuemin / aria-valuemax.
 */

import { computed, onBeforeUnmount, ref, useSlots } from 'vue'

defineOptions({ name: 'SnInputNumber' })

const props = withDefaults(
  defineProps<{
    /** Bound numeric value; `null` represents an empty field. */
    modelValue?: number | null
    /** Lower bound. Out-of-range commits are clamped. */
    min?: number
    /** Upper bound. Out-of-range commits are clamped. */
    max?: number
    /** Step size for buttons / ArrowUp / ArrowDown. */
    step?: number
    /** Decimal places forced on committed values (0–100). */
    precision?: number
    /** Visual size preset. */
    size?: 'mini' | 'tiny' | 'small' | 'medium' | 'large'
    /** Disables interaction (input, buttons, clear). */
    disabled?: boolean
    /** Read-only — value visible, not editable. */
    readonly?: boolean
    /** Placeholder text. */
    placeholder?: string
    /** Require committed values to be integer multiples of `step`. */
    stepStrictly?: boolean
    /** Render the + / − stepper buttons. */
    showButton?: boolean
    /** Where the stepper buttons are placed. */
    buttonPlacement?: 'both' | 'right'
    /** Show the clear (×) button when a value is present. */
    clearable?: boolean
    /** Custom display formatter (e.g. append `%`). */
    format?: (value: number) => string | number
    /** Reverse of `format` — parses user text back to a number. */
    parse?: (input: string) => number | null
    /** Custom validator; returning false rejects the commit. */
    validator?: (value: number) => boolean
    /** Border preset (see SnInput). */
    border?: 'all' | 'bottom' | 'none'
    /** @deprecated alias: true → border 'all', false → border 'none'. */
    bordered?: boolean
    /** Native ARIA label. */
    ariaLabel?: string
  }>(),
  {
    modelValue: null,
    step: 1,
    size: 'medium',
    disabled: false,
    readonly: false,
    placeholder: '',
    stepStrictly: false,
    showButton: true,
    buttonPlacement: 'right',
    clearable: false,
    border: 'all',
    bordered: true,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void
  /** Fired when a committed value differs from the previous one. */
  (e: 'change', value: number | null): void
  (e: 'input', value: number | null): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}>()

defineSlots<{
  prefix?(): unknown
  suffix?(): unknown
}>()

const slots = useSlots()

/** Raw editing buffer — the user's in-flight text, committed on change/blur/Enter. */
const editingText = ref<string | null>(null)

/** True while the user is actively editing (uncommitted text may differ). */
const isFocused = ref(false)

function clamp(value: number): number {
  let v = value
  if (props.min !== undefined && v < props.min) v = props.min
  if (props.max !== undefined && v > props.max) v = props.max
  return v
}

/** Round to `precision` decimal places (default 0 when precision is unset is NOT applied — naive keeps raw unless precision given). */
function toPrecision(value: number): number {
  if (props.precision === undefined) return value
  const factor = 10 ** props.precision
  return Math.round(value * factor) / factor
}

function isValidNumber(n: number): boolean {
  return Number.isFinite(n)
}

/** Parse user text → number using `parse` prop when provided. Returns null for empty/invalid. */
function parseInput(raw: string): number | null {
  const text = raw.trim()
  if (text === '') return null
  if (props.parse) {
    const parsed = props.parse(text)
    return parsed === null || !isValidNumber(parsed) ? null : parsed
  }
  const n = Number(text)
  return isValidNumber(n) ? n : null
}

/** Full commit pipeline: parse → validate → clamp → precision → stepStrictly. */
function tryCommit(raw: string): number | null | undefined {
  const parsed = parseInput(raw)
  // Non-numeric text is never committed — the old value is kept.
  if (parsed === null && raw.trim() !== '') return undefined
  if (parsed === null) return null
  if (props.validator && !props.validator(parsed)) return undefined
  let next = clamp(parsed)
  if (props.stepStrictly && props.step !== 0) {
    const base = props.min !== undefined ? props.min : 0
    next = base + Math.round((next - base) / props.step) * props.step
    next = clamp(next)
  }
  return toPrecision(next)
}

function commitValue(next: number | null): void {
  if (next !== props.modelValue) {
    emit('update:modelValue', next)
    emit('change', next)
  }
}

/** Display string: in-flight edit text while focused, otherwise formatted value. */
const displayValue = computed<string>(() => {
  if (editingText.value !== null) return editingText.value
  if (props.modelValue === null || props.modelValue === undefined) return ''
  return String(props.format ? props.format(props.modelValue) : props.modelValue)
})

const isInteractive = computed(() => !props.disabled && !props.readonly)

const clearVisible = computed(() =>
  props.clearable && isInteractive.value && props.modelValue !== null && props.modelValue !== undefined,
)

const borderMode = computed<'all' | 'bottom' | 'none'>(() => {
  if (props.border !== 'all') return props.border
  return props.bordered === false ? 'none' : 'all'
})

const minusDisabled = computed(() => {
  if (!isInteractive.value) return true
  if (props.modelValue === null || props.modelValue === undefined) return false
  return props.min !== undefined && props.modelValue <= props.min
})

const plusDisabled = computed(() => {
  if (!isInteractive.value) return true
  if (props.modelValue === null || props.modelValue === undefined) return false
  return props.max !== undefined && props.modelValue >= props.max
})

function doStep(direction: 1 | -1): void {
  if (!isInteractive.value) return
  if (direction < 0 && minusDisabled.value) return
  if (direction > 0 && plusDisabled.value) return
  const step = props.step === 0 ? 1 : props.step
  // Step anchored to min (or 0) so results stay on-step.
  const base = props.min !== undefined ? props.min : 0
  let next: number
  const current = props.modelValue
  if (current === null || current === undefined) {
    // Empty field: naive-ui semantics — jump to the nearest bound, or
    // one step from the anchor when no bound is set on that side.
    if (direction > 0) {
      next = props.min !== undefined ? props.min : base + step
    } else {
      next = props.max !== undefined ? props.max : base - step
    }
  } else {
    next = base + Math.round((current - base) / step) * step + direction * step
  }
  next = toPrecision(clamp(next))
  if (props.validator && !props.validator(next)) return
  editingText.value = null
  commitValue(next)
}

/** Step by `factor` × step in one commit (PageUp / PageDown use ×10). */
function doStepMultiple(direction: 1 | -1, factor: number): void {
  if (!isInteractive.value) return
  if (direction < 0 && minusDisabled.value) return
  if (direction > 0 && plusDisabled.value) return
  const step = (props.step === 0 ? 1 : props.step) * factor
  const base = props.min !== undefined ? props.min : 0
  const current = props.modelValue
  let next: number
  if (current === null || current === undefined) {
    if (direction > 0) {
      next = props.min !== undefined ? props.min : base + step
    } else {
      next = props.max !== undefined ? props.max : base - step
    }
  } else {
    next = base + Math.round((current - base) / step) * step + direction * step
  }
  next = toPrecision(clamp(next))
  if (props.validator && !props.validator(next)) return
  editingText.value = null
  commitValue(next)
}

/* --- long-press repeat for stepper buttons --- */
let repeatTimer: ReturnType<typeof setInterval> | null = null
let repeatDelay: ReturnType<typeof setTimeout> | null = null
let repeatDirection: 1 | -1 = 1

const REPEAT_DELAY_MS = 400
const REPEAT_INTERVAL_MS = 100

function stopRepeat(): void {
  if (repeatTimer !== null) {
    clearInterval(repeatTimer)
    repeatTimer = null
  }
  if (repeatDelay !== null) {
    clearTimeout(repeatDelay)
    repeatDelay = null
  }
}

function startRepeat(direction: 1 | -1): void {
  if (!isInteractive.value) return
  stopRepeat()
  repeatDirection = direction
  doStep(direction)
  repeatDelay = setTimeout(() => {
    repeatTimer = setInterval(() => doStep(repeatDirection), REPEAT_INTERVAL_MS)
  }, REPEAT_DELAY_MS)
}

onBeforeUnmount(stopRepeat)

function onMinusDown(): void {
  startRepeat(-1)
}

function onPlusDown(): void {
  startRepeat(1)
}

function onInput(event: Event): void {
  const target = event.target as HTMLInputElement
  editingText.value = target.value
  const parsed = parseInput(target.value)
  emit('input', parsed)
}

function onBlur(event: FocusEvent): void {
  isFocused.value = false
  commitEditingText()
  emit('blur', event)
}

function onFocus(event: FocusEvent): void {
  isFocused.value = true
  emit('focus', event)
}

/** Commit on native change (blur with a change, or explicit commit). */
function onChange(): void {
  commitEditingText()
}

/**
 * Commit the in-flight edit text. Empty text commits `null`; text that
 * fails to parse (and is not empty) is discarded, keeping the old value.
 */
function commitEditingText(): void {
  const raw = editingText.value
  if (raw === null) return
  const committed = raw.trim() === '' ? null : tryCommit(raw)
  if (committed !== undefined) commitValue(committed)
  editingText.value = null
}

function onKeydown(event: KeyboardEvent): void {
  if (!isInteractive.value) return
  if (event.key === 'ArrowUp' || event.key === 'PageUp') {
    event.preventDefault()
    doStepMultiple(1, event.key === 'PageUp' ? 10 : 1)
  } else if (event.key === 'ArrowDown' || event.key === 'PageDown') {
    event.preventDefault()
    doStepMultiple(-1, event.key === 'PageDown' ? 10 : 1)
  } else if (event.key === 'Enter') {
    commitEditingText()
  }
}

function onClear(): void {
  if (!isInteractive.value) return
  editingText.value = null
  commitValue(null)
}

const ariaValueNow = computed<string | undefined>(() =>
  props.modelValue === null || props.modelValue === undefined ? undefined : String(props.modelValue),
)
const ariaValueMin = computed<string | undefined>(() =>
  props.min !== undefined ? String(props.min) : undefined,
)
const ariaValueMax = computed<string | undefined>(() =>
  props.max !== undefined ? String(props.max) : undefined,
)

/** Stepper icon size per size preset (naive-ui parity: scaled with field height). */
const iconSize = computed<number>(() => {
  switch (props.size) {
    case 'mini':
    case 'tiny':
      return 14
    case 'small':
    case 'medium':
      return 16
    case 'large':
      return 20
  }
})

const classList = computed(() => [
  'sn-input-number',
  `sn-input-number--${props.size}`,
  `sn-input-number--border-${borderMode.value}`,
  {
    'sn-input-number--disabled': props.disabled,
    'sn-input-number--readonly': props.readonly,
    [`sn-input-number--placement-${props.buttonPlacement}`]: props.showButton,
    'sn-input-number--with-clear': clearVisible.value,
  },
])
</script>

<template>
  <div :class="classList" :data-snui-component="'input-number'" :data-size="size">
    <span
      v-if="showButton && buttonPlacement === 'both'"
      class="sn-input-number__stepper sn-input-number__stepper--head"
      @mouseleave="stopRepeat"
      @mouseup="stopRepeat"
    >
      <button
        type="button"
        class="sn-input-number__btn sn-input-number__btn--minus"
        :disabled="minusDisabled"
        :tabindex="-1"
        aria-label="Decrease"
        @mousedown.prevent="onMinusDown"
      >
        <svg viewBox="0 0 512 512" :width="iconSize" :height="iconSize" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M400 256H112" stroke="currentColor" stroke-width="32" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
    </span>

    <span v-if="slots.prefix" class="sn-input-number__prefix" aria-hidden="true">
      <slot name="prefix" />
    </span>

    <input
      class="sn-input-number__native"
      type="text"
      inputmode="decimal"
      role="spinbutton"
      :value="displayValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :aria-label="ariaLabel"
      :aria-valuenow="ariaValueNow"
      :aria-valuemin="ariaValueMin"
      :aria-valuemax="ariaValueMax"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @change="onChange"
      @keydown="onKeydown"
    />

    <span
      v-if="clearVisible"
      class="sn-input-number__clear"
    >
      <button
        type="button"
        class="sn-input-number__clear-btn"
        aria-label="Clear value"
        @mousedown.prevent
        @click.stop="onClear"
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
      </button>
    </span>

    <span
      v-if="showButton"
      class="sn-input-number__stepper sn-input-number__stepper--tail"
      @mouseleave="stopRepeat"
      @mouseup="stopRepeat"
    >
      <button
        v-if="buttonPlacement === 'right'"
        type="button"
        class="sn-input-number__btn sn-input-number__btn--minus"
        :disabled="minusDisabled"
        :tabindex="-1"
        aria-label="Decrease"
        @mousedown.prevent="onMinusDown"
      >
        <svg viewBox="0 0 512 512" :width="iconSize" :height="iconSize" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M400 256H112" stroke="currentColor" stroke-width="32" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
      <button
        type="button"
        class="sn-input-number__btn sn-input-number__btn--plus"
        :disabled="plusDisabled"
        :tabindex="-1"
        aria-label="Increase"
        @mousedown.prevent="onPlusDown"
      >
        <svg viewBox="0 0 512 512" :width="iconSize" :height="iconSize" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M256 112V400M400 256H112" stroke="currentColor" stroke-width="32" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
    </span>

    <span v-if="slots.suffix" class="sn-input-number__suffix" aria-hidden="true">
      <slot name="suffix" />
    </span>
  </div>
</template>

<style scoped>
.sn-input-number {
  display: inline-flex;
  align-items: stretch;
  position: relative;
  border: 1px solid var(--sn-web-input-border-color, var(--sn-web-color-border-default));
  border-radius: var(--sn-web-input-radius, 6px);
  background-color: var(--sn-web-input-bg, var(--sn-web-color-background-surface));
  color: var(--sn-web-input-text-color, var(--sn-web-color-text-primary));
  font-family: inherit;
  line-height: 1;
  transition: border-color 0.18s ease-out, box-shadow 0.18s ease-out;
  box-sizing: border-box;
  overflow: hidden;
}

.sn-input-number:focus-within {
  border-color: var(--sn-web-input-border-color-focus, var(--sn-web-color-action-primary));
  box-shadow: 0 0 0 3px var(--sn-web-focus-ring, rgba(22, 119, 255, 0.15));
}

.sn-input-number--border-bottom {
  border: none;
  border-bottom: 1px solid var(--sn-web-input-border-color, var(--sn-web-color-border-default));
  border-radius: 0;
}

.sn-input-number--border-none {
  border-color: transparent;
}
.sn-input-number--border-none:focus-within {
  border-color: transparent;
  box-shadow: 0 0 0 3px var(--sn-web-focus-ring, rgba(22, 119, 255, 0.15));
}

/* Sizes — mirror SnInput presets. */
.sn-input-number--mini { height: 22px; font-size: 11px; }
.sn-input-number--tiny { height: 24px; font-size: 12px; }
.sn-input-number--small { height: 28px; font-size: 13px; }
.sn-input-number--medium { height: 32px; font-size: 14px; }
.sn-input-number--large { height: 40px; font-size: 15px; }

.sn-input-number__native {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: inherit;
  font: inherit;
  padding: 0 var(--sn-web-input-padding-x, 10px);
}

.sn-input-number__native::placeholder {
  color: var(--sn-web-input-placeholder-color, var(--sn-web-color-text-tertiary, rgba(0, 0, 0, 0.35)));
}

.sn-input-number__prefix,
.sn-input-number__suffix {
  display: inline-flex;
  align-items: center;
  padding-left: var(--sn-web-input-padding-x, 10px);
}
.sn-input-number__suffix {
  padding-left: 0;
  padding-right: var(--sn-web-input-padding-x, 10px);
}

/* Steppers — naive-ui-style icon text buttons: transparent, no divider
 * chrome; the icon itself tints to the action colour on hover and fades to
 * the disabled colour at bounds. The `right` placement keeps both buttons
 * side by side in the tail (horizontal pair); `both` splits minus into the
 * head stepper (prefix side) and plus into the tail. */
.sn-input-number__stepper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.sn-input-number__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  align-self: stretch;
  border: none;
  background: transparent;
  color: var(--sn-web-color-text-secondary, rgba(0, 0, 0, 0.55));
  cursor: pointer;
  padding: 0;
  transition: color 0.15s ease-out;
}

.sn-input-number__btn:hover:not(:disabled) {
  color: var(--sn-web-color-action-primary-hover, var(--sn-web-color-action-primary, rgba(22, 119, 255, 0.9)));
}

.sn-input-number__btn:disabled {
  color: var(--sn-web-color-text-disabled, rgba(0, 0, 0, 0.25));
  cursor: not-allowed;
}

/* Clear button */
.sn-input-number__clear {
  display: inline-flex;
  align-items: center;
}
.sn-input-number__clear-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--sn-web-color-text-tertiary, rgba(0, 0, 0, 0.35));
  cursor: pointer;
  padding: 0 4px;
}
.sn-input-number__clear-btn:hover {
  color: var(--sn-web-color-text-primary, rgba(0, 0, 0, 0.85));
}

/* Disabled greys the surface (naive-ui parity); readonly keeps the normal
 * surface and just blocks edits. */
.sn-input-number--disabled {
  background-color: var(--sn-web-color-background-soft, rgba(0, 0, 0, 0.04));
  cursor: not-allowed;
  color: var(--sn-web-color-text-disabled, rgba(0, 0, 0, 0.25));
}
.sn-input-number--readonly {
  cursor: default;
}
</style>
