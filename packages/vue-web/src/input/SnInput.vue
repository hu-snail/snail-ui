<script setup lang="ts">
/**
 * SnInput — web-end text input component (AUI-WEB-003).
 *
 * Phase 1 contract: covers the v3.x surface area promised by the docs
 * site (basic types + states + clearable + count + slots). Validation
 * rules (pattern, async, error messages) live on SnFormItem — SnInput
 * itself only surfaces `status` so a FormItem can paint its result.
 *
 * Per AGENTS.md §30/31: name / version / props / events / slots / tokens /
 * accessibility / capabilities declared in `defineProps` + `defineEmits` +
 * `defineSlots` + CSS variables.
 */

import { computed, useId, useSlots } from 'vue'

defineOptions({ name: 'SnInput' })

const props = withDefaults(
  defineProps<{
    /** Bound value. String for text-like types; number coerced for `type="number"`. */
    modelValue?: string | number
    /** Native input type. `textarea` renders a multi-line text area. */
    type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search' | 'textarea'
    /** Visual size preset. Drives height + font-size. */
    size?: 'tiny' | 'small' | 'medium' | 'large'
    /** Placeholder text. Forwarded to the native input/textarea. */
    placeholder?: string
    /** Disables interaction. Native `disabled` attribute is set. */
    disabled?: boolean
    /** Read-only — value is visible but not editable. */
    readonly?: boolean
    /** Required for form submission. Renders `aria-required="true"`. */
    required?: boolean
    /** Native ARIA label. */
    ariaLabel?: string
    /** Max character length. Pairs with `showCount`. */
    maxlength?: number
    /** Min character length. Validates on blur / submit. */
    minlength?: number
    /** Show the running `current / max` counter (right-aligned). */
    showCount?: boolean
    /** Show the clear (×) button when the field has a non-empty value. */
    clearable?: boolean
    /** Visual status. Driven by FormItem validation; manual override allowed. */
    status?: 'default' | 'error' | 'warning'
    /** Lower bound (numeric input only). */
    min?: number
    /** Upper bound (numeric input only). */
    max?: number
    /** Step (numeric input only). */
    step?: number
    /** Textarea row count (textarea only). */
    rows?: number
    /** Auto-grow textarea to fit content. */
    autosize?: boolean | { minRows?: number; maxRows?: number }
    /**
     * Render the 1px border. Set to `false` for a borderless input that
     * relies on background + underline for its outline (common on
     * search bars inside toolbars).
     */
    bordered?: boolean
    /**
     * Background tone. `surface` (default) uses the elevated card color;
     * `transparent` removes the background (e.g. for inputs that sit
     * directly on a colored banner); `soft` is a subtle secondary fill.
     */
    bg?: 'surface' | 'transparent' | 'soft'
    /**
     * Border-radius preset. `default` matches the design system radius;
     * `pill` gives a fully rounded field (search-bar style); `square`
     * is right-angled.
     */
    radius?: 'default' | 'pill' | 'square'
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
    autosize: false,
    bordered: true,
    bg: 'surface',
    radius: 'default',
  },
)

const emit = defineEmits<{
  /** v-model sync. Native input event. */
  (e: 'update:modelValue', value: string | number): void
  /** Native change event — fired on commit (lost focus / Enter). */
  (e: 'change', value: string | number, event: Event): void
  /** Native input event — fired on every keystroke. */
  (e: 'input', value: string | number, event: Event): void
  /** Native focus. */
  (e: 'focus', event: FocusEvent): void
  /** Native blur. */
  (e: 'blur', event: FocusEvent): void
  /** Clear button activated. Payload is the empty value (`''` / `0`). */
  (e: 'clear'): void
}>()

defineSlots<{
  /** Default — not used (single root wrapper). */
  default?(): unknown
  /** Custom prefix content. Renders inside the input box on the left. */
  prefix?(): unknown
  /** Custom suffix content. Renders inside the input box on the right. */
  suffix?(): unknown
  /** Custom clear icon. Replaces the default × glyph. */
  'clear-icon'?(): unknown
  /** Custom count display. Replaces the default `current / max` text. */
  count?(): unknown
}>()

const inputId = useId()
const slots = useSlots()

/** Coerced to a string for DOM (number inputs accept string only). */
const nativeValue = computed<string>(() =>
  props.modelValue === null || props.modelValue === undefined
      ? ''
      : String(props.modelValue),
)

/** True when the field is a textarea. */
const isTextarea = computed(() => props.type === 'textarea')

/** Effective rows for the textarea. */
const textareaRows = computed(() => props.rows ?? 3)

/** Show the clear button — needs a non-empty value + clearable + not readonly/disabled. */
const showClear = computed(
  () => props.clearable && !props.disabled && !props.readonly && nativeValue.value.length > 0,
)

/** Counter payload — total length, used for showCount. */
const currentLength = computed(() => nativeValue.value.length)

/** Disabled or readonly? */
const isInteractive = computed(() => !props.disabled && !props.readonly)

/** ARIA-invalid reflects the status. */
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
    'sn-input--bordered': props.bordered,
    'sn-input--borderless': !props.bordered,
    [`sn-input--bg-${props.bg}`]: true,
    [`sn-input--radius-${props.radius}`]: true,
    [`sn-input--status-${props.status}`]: props.status !== 'default',
    'sn-input--with-prefix': !!slots.prefix,
    'sn-input--with-suffix': !!slots.suffix,
    'sn-input--with-count': props.showCount,
  },
])
</script>

<template>
  <div
    :class="classList"
    :data-snui-component="isTextarea ? 'textarea' : 'input'"
    :data-size="size"
    :data-status="status"
  >
    <span v-if="slots.prefix" class="sn-input__prefix" aria-hidden="true">
      <slot name="prefix" />
    </span>

    <textarea
      v-if="isTextarea"
      :id="inputId"
      class="sn-input__native"
      :value="nativeValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :rows="textareaRows"
      :maxlength="maxlength"
      :minlength="minlength"
      :aria-label="ariaLabel"
      :aria-invalid="ariaInvalid"
      :aria-required="required ? 'true' : undefined"
      :aria-disabled="disabled ? 'true' : undefined"
      @input="onInput"
      @change="onChange"
      @focus="(e: FocusEvent) => emit('focus', e)"
      @blur="(e: FocusEvent) => emit('blur', e)"
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
      :required="required"
      :maxlength="maxlength"
      :minlength="minlength"
      :min="min"
      :max="max"
      :step="step"
      :aria-label="ariaLabel"
      :aria-invalid="ariaInvalid"
      :aria-required="required ? 'true' : undefined"
      :aria-disabled="disabled ? 'true' : undefined"
      @input="onInput"
      @change="onChange"
      @focus="(e: FocusEvent) => emit('focus', e)"
      @blur="(e: FocusEvent) => emit('blur', e)"
    />

    <span v-if="showClear" class="sn-input__clear" aria-hidden="true">
      <button
        type="button"
        class="sn-input__clear-btn"
        :tabindex="isInteractive ? 0 : -1"
        :aria-label="ariaLabel ? `Clear ${ariaLabel}` : 'Clear input'"
        @click.stop="onClear"
      >
        <slot name="clear-icon">×</slot>
      </button>
    </span>

    <span v-else-if="slots.suffix" class="sn-input__suffix" aria-hidden="true">
      <slot name="suffix" />
    </span>

    <span v-if="showCount" class="sn-input__count" aria-live="polite">
      <slot
        name="count"
        :current="currentLength"
        :max="maxlength"
      >{{ currentLength }}{{ maxlength ? ` / ${maxlength}` : '' }}</slot>
    </span>
  </div>
</template>

<style scoped>
.sn-input {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  position: relative;
  padding: 0 var(--sn-web-input-padding-x, 10px);
  border: 1px solid var(--sn-web-input-border-color, var(--sn-web-color-border-default));
  border-radius: var(--sn-web-input-radius, 6px);
  background-color: var(--sn-web-input-bg, var(--sn-web-color-background-surface));
  color: var(--sn-web-input-text-color, var(--sn-web-color-text-primary));
  font-family: inherit;
  line-height: 1;
  transition: border-color 0.18s ease-out, box-shadow 0.18s ease-out,
    background-color 0.18s ease-out;
  box-sizing: border-box;
}

/*
 * Borderless variant — common for inputs that sit on a colored banner
 * or inside a search bar that already provides a backdrop. The focus
 * state still highlights via a soft outer ring instead of a border swap.
 */
.sn-input--borderless {
  border-color: transparent;
}
.sn-input--borderless:focus-within {
  border-color: transparent;
  box-shadow: 0 0 0 3px var(--sn-web-focus-ring, rgba(22, 119, 255, 0.15));
}

/* Background tones */
.sn-input--bg-surface {
  background-color: var(--sn-web-input-bg, var(--sn-web-color-background-surface));
}
.sn-input--bg-transparent {
  background-color: transparent;
}
.sn-input--bg-soft {
  background-color: var(--sn-web-color-background-soft, rgba(0, 0, 0, 0.04));
}

/* Radius presets */
.sn-input--radius-default {
  border-radius: var(--sn-web-input-radius, 6px);
}
.sn-input--radius-pill {
  border-radius: 999px;
}
.sn-input--radius-square {
  border-radius: 0;
}

/* Focus state — border + outer ring + soft scale so users can see
 * exactly which field owns the focus without a heavy chrome change. */
.sn-input:focus-within {
  border-color: var(--sn-web-input-border-color-focus, var(--sn-web-color-action-primary));
  box-shadow: 0 0 0 3px var(--sn-web-focus-ring, rgba(22, 119, 255, 0.15));
}

/* Sizes */
.sn-input--tiny { height: 24px; font-size: 12px; }
.sn-input--small { height: 28px; font-size: 13px; }
.sn-input--medium { height: 32px; font-size: 14px; }
.sn-input--large { height: 40px; font-size: 15px; }

/* Status — applied after the focus border so error/warning wins. */
.sn-input--status-error {
  border-color: var(--sn-web-color-feedback-danger);
}
.sn-input--status-error:focus-within {
  border-color: var(--sn-web-color-feedback-danger);
  box-shadow: 0 0 0 3px var(--sn-web-color-feedback-danger-soft, rgba(255, 77, 79, 0.15));
}
.sn-input--status-warning {
  border-color: var(--sn-web-color-feedback-warning);
}
.sn-input--status-warning:focus-within {
  border-color: var(--sn-web-color-feedback-warning);
  box-shadow: 0 0 0 3px var(--sn-web-color-feedback-warning-soft, rgba(250, 173, 20, 0.15));
}

/* States */
.sn-input--disabled,
.sn-input--disabled .sn-input__native {
  cursor: not-allowed;
  opacity: 0.5;
}
.sn-input--readonly .sn-input__native {
  cursor: default;
}

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
  color: var(--sn-web-input-placeholder-color, var(--sn-web-color-text-tertiary));
}

/* Textarea gets multi-line layout */
textarea.sn-input__native {
  resize: vertical;
  padding: 6px 0;
}

/* Prefix / suffix */
.sn-input__prefix,
.sn-input__suffix {
  display: inline-flex;
  align-items: center;
  color: var(--sn-web-color-text-secondary);
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
  width: 16px;
  height: 16px;
  border: none;
  background: var(--sn-web-color-background-elevated, rgba(0, 0, 0, 0.06));
  color: var(--sn-web-color-text-secondary);
  border-radius: 50%;
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
}
.sn-input__clear-btn:hover {
  background: var(--sn-web-color-background-overlay, rgba(0, 0, 0, 0.12));
}

/* Count */
.sn-input__count {
  font-size: 11px;
  color: var(--sn-web-color-text-tertiary);
  flex: 0 0 auto;
  min-width: 30px;
  text-align: right;
  line-height: 1;
}

/* When textarea contains its own rows + count, the wrapper should flex-column */
.sn-input--textarea {
  flex-direction: column;
  align-items: stretch;
  height: auto;
  padding: 6px var(--sn-web-input-padding-x, 10px);
}
.sn-input--textarea .sn-input__count {
  align-self: flex-end;
  margin-top: 2px;
}
</style>