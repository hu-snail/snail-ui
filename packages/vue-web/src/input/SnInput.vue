<script setup lang="ts">
/**
 * SnInput — web-end text input component (AUI-WEB-003).
 *
 * Phase 2 contract: covers the long-promised web-end text input surface.
 * Property list mirrors wot-ui's `wd-input` 1:1 (the uni-end mirror is
 * sn-input, AUI-MP-004). Anything new added here MUST also be added to
 * sn-input and to the wot-ui reference list in AGENTS.md §112.
 *
 * Per AGENTS.md §30/31: name / version / props / events / slots / tokens /
 * accessibility / capabilities declared in `defineProps` + `defineEmits` +
 * `defineSlots` + CSS variables.
 */

import { computed, markRaw, nextTick, ref, useId, useSlots } from 'vue'
import { EyeIcon, EyeOffIcon, XIcon } from '../icon/sn-input-icons'

defineOptions({ name: 'SnInput' })

const props = withDefaults(
  defineProps<{
    /** Bound value. String for text-like types; number coerced for `type="number"`. */
    modelValue?: string | number
    /**
     * Native input type. The 8 MP / Web universal types from `wd-input`,
     * plus `textarea` which renders a multi-line text area.
     */
    type?: 'text' | 'number' | 'digit' | 'idcard' | 'safe-password' | 'nickname'
      | 'tel' | 'password' | 'email' | 'url' | 'search' | 'textarea'
    /** Visual size preset. Drives height + font-size. */
    size?: 'mini' | 'tiny' | 'small' | 'medium' | 'large'
    /** Placeholder text. Forwarded to the native input/textarea. */
    placeholder?: string
    /**
     * Inline CSS for the placeholder pseudo-element. Accepts a string
     * of declarations (e.g. `color: #999; font-size: 12px;`) per the
     * `wd-input` placeholder-style contract.
     */
    placeholderStyle?: string
    /** Class applied to the placeholder pseudo-element. */
    placeholderClass?: string
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
    /**
     * Show the running `current / max` counter (right-aligned).
     * Aliased as `showWordLimit` for wot-ui parity.
     */
    showCount?: boolean
    /** wot-ui alias for `showCount`. */
    showWordLimit?: boolean
    /** Show the clear (×) button when the field has a non-empty value. */
    clearable?: boolean
    /**
     * When the clear button is shown. `always` shows whenever there is a
     * value; `focus` shows only when the input is focused. Mirrors
     * `wd-input` clear-trigger.
     */
    clearTrigger?: 'always' | 'focus'
    /** After clicking the clear button, refocus the input. */
    focusWhenClear?: boolean
    /**
     * Render an inline eye-toggle that flips between password and text.
     * Applies only when `type === 'password'`.
     */
    showPassword?: boolean
    /**
     * Front-icon name. Resolved via `registerSnIcons()`. Use the `prefix`
     * slot for arbitrary rich content.
     */
    prefixIcon?: string
    /** Tail-icon name. Resolved via `registerSnIcons()`. */
    suffixIcon?: string
    /**
     * CSS-icon mode. When `true`, `prefixIcon` / `suffixIcon` are
     * treated as class names applied directly to a span (rather than
     * resolved through the SnIcon registry).
     */
    cssIcon?: boolean | string
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
     * Border preset.
     *  - `all`    — full 1px border on all sides (default).
     *  - `bottom` — only the bottom edge gets a border, top / left / right
     *               are transparent. Common for inline form rows.
     *  - `none`   — no border at all.
     *
     * The older boolean `bordered` prop is kept as a deprecated alias —
     * `bordered: true` === `border: 'all'`, `bordered: false` === `border: 'none'`.
     */
    border?: 'all' | 'bottom' | 'none'
    /**
     * @deprecated Use `border="all" | "none"` instead. Boolean aliases:
     *   bordered: true   → border: 'all'
     *   bordered: false  → border: 'none'
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
    /** Right-align the value (numeric / amount fields). */
    alignRight?: boolean
    /**
     * Compact layout — strips default padding / background so the field
     * nests cleanly inside FormItem / Cell. Mirrors `wd-input` compact.
     */
    compact?: boolean
    /** Initial focus on mount. */
    focus?: boolean
    /** HTML inputmode hint. */
    inputmode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url'
    /** Class on the inner native `<input>` / `<textarea>`. */
    customInputClass?: string
    /** Class on the root wrapper. */
    customClass?: string
    /** Inline style on the root wrapper. */
    customStyle?: string | Record<string, string>
  }>(),
  {
    modelValue: '',
    type: 'text',
    size: 'medium',
    placeholder: '',
    placeholderStyle: '',
    placeholderClass: '',
    disabled: false,
    readonly: false,
    required: false,
    showCount: false,
    showWordLimit: false,
    clearable: false,
    clearTrigger: 'always',
    focusWhenClear: true,
    showPassword: false,
    prefixIcon: '',
    suffixIcon: '',
    cssIcon: false,
    status: 'default',
    rows: 3,
    autosize: false,
    border: 'all',
    bordered: true,
    bg: 'surface',
    radius: 'default',
    alignRight: false,
    compact: false,
    focus: false,
    inputmode: 'text',
    customInputClass: '',
    customClass: '',
    customStyle: '',
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
  /** Click on the root wrapper. */
  (e: 'click', event: MouseEvent): void
  /** User clicked the prefix icon button. */
  (e: 'clickPrefixIcon', event: MouseEvent): void
  /** User clicked the suffix icon button. */
  (e: 'clickSuffixIcon', event: MouseEvent): void
  /** Native confirm (Enter key on a single-line field). */
  (e: 'confirm', value: string | number): void
}>()

defineSlots<{
  /** Custom prefix content. Wins over `prefixIcon` when both are set. */
  prefix?(): unknown
  /** Custom suffix content. Wins over `suffixIcon` when both are set. */
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

/** True when the field is a password input. */
const isPassword = computed(() => props.type === 'password')

/** Effective rows for the textarea. */
const textareaRows = computed(() => props.rows ?? 3)

/**
 * Effective border mode after the `bordered` boolean alias is folded
 * into the canonical `border` string.
 */
const borderMode = computed<'all' | 'bottom' | 'none'>(() => {
  if (props.border !== 'all') return props.border
  // backwards-compat: bordered: false forces 'none' even when border is left as default
  return props.bordered === false ? 'none' : 'all'
})

/** Whether the clear button should be visible right now. */
const clearVisible = computed(() => {
  if (!props.clearable || props.disabled || props.readonly) return false
  if (nativeValue.value.length === 0) return false
  if (props.clearTrigger === 'focus') return isFocused.value
  return true
})

/** Counter payload — total length, used for showCount. */
const currentLength = computed(() => nativeValue.value.length)

/** Disabled or readonly? */
const isInteractive = computed(() => !props.disabled && !props.readonly)

/** ARIA-invalid reflects the status. */
const ariaInvalid = computed(() => props.status === 'error' ? 'true' : undefined)

/** Whether `showCount` is requested (either spelling). */
const showCounter = computed(() => props.showCount || props.showWordLimit)

/** Local focus tracker (drives `clearTrigger === 'focus'`). */
const isFocused = ref(false)

function onInput(event: Event): void {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  const raw = target.value
  const next: number | string = (props.type === 'number' || props.type === 'digit') && raw !== '' ? Number(raw) : raw
  emit('update:modelValue', next)
  emit('input', next, event)
}

function onChange(event: Event): void {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  const raw = target.value
  const next: number | string = (props.type === 'number' || props.type === 'digit') && raw !== '' ? Number(raw) : raw
  emit('change', next, event)
}

function onClear(event?: MouseEvent): void {
  emit('update:modelValue', '')
  emit('clear')
  if (!props.focusWhenClear) return
  nextTick(() => {
    const el = document.getElementById(inputId) as HTMLInputElement | HTMLTextAreaElement | null
    el?.focus()
  })
}

function onClickRoot(event: MouseEvent): void {
  emit('click', event)
}

function onClickPrefixIcon(event: MouseEvent): void {
  emit('clickPrefixIcon', event)
}

function onClickSuffixIcon(event: MouseEvent): void {
  emit('clickSuffixIcon', event)
}

function onFocus(event: FocusEvent): void {
  isFocused.value = true
  emit('focus', event)
}

function onBlur(event: FocusEvent): void {
  isFocused.value = false
  emit('blur', event)
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter') {
    const next: number | string = (props.type === 'number' || props.type === 'digit') && nativeValue.value !== '' ? Number(nativeValue.value) : nativeValue.value
    emit('confirm', next)
  }
}

/** Password visible state — toggleable via the eye icon. */
const passwordVisible = ref(false)
const effectivePasswordType = computed(() =>
  props.type === 'password' && passwordVisible.value ? 'text' : props.type,
)
/** Eye-toggle icon — wraps `EyeOff` while password is visible, `Eye` otherwise.
 *  markRaw keeps Vue from proxying the icon component (silent warning). */
const passwordToggleIcon = computed(() => markRaw(passwordVisible.value ? EyeOffIcon : EyeIcon))
/** Default clear-button glyph (built-in X). markRaw'd so SnIcon doesn't
 *  proxy the icon component. */
const defaultClearIcon = markRaw(XIcon)

const classList = computed(() => [
  'sn-input',
  `sn-input--${props.size}`,
  `sn-input--${props.type}`,
  `sn-input--border-${borderMode.value}`,
  {
    'sn-input--disabled': props.disabled,
    'sn-input--readonly': props.readonly,
    'sn-input--clearable': props.clearable,
    [`sn-input--bg-${props.bg}`]: true,
    [`sn-input--radius-${props.radius}`]: true,
    [`sn-input--status-${props.status}`]: props.status !== 'default',
    'sn-input--with-prefix': !!(slots.prefix || props.prefixIcon),
    'sn-input--with-suffix': !!(slots.suffix || props.suffixIcon),
    'sn-input--with-count': showCounter.value,
    'sn-input--align-right': props.alignRight,
    'sn-input--compact': props.compact,
    'sn-input--with-clear': clearVisible.value,
  },
  props.customClass,
])

const wrapperStyle = computed(() => {
  if (typeof props.customStyle === 'string') return props.customStyle
  return Object.entries(props.customStyle ?? {}).map(([k, v]) => `${k}:${v}`).join(';')
})
</script>

<template>
  <div
    :class="classList"
    :style="wrapperStyle || undefined"
    :data-snui-component="isTextarea ? 'textarea' : 'input'"
    :data-size="size"
    :data-status="status"
    :data-border="borderMode"
    @click="onClickRoot"
  >
    <span v-if="slots.prefix || prefixIcon" class="sn-input__prefix" aria-hidden="true" @click.stop="onClickPrefixIcon">
      <slot name="prefix" />
      <span v-if="!slots.prefix && prefixIcon" :class="cssIcon ? prefixIcon : ''">
        <SnIcon v-if="!cssIcon" :name="prefixIcon" :size="14" />
      </span>
    </span>

    <textarea
      v-if="isTextarea"
      :id="inputId"
      :class="['sn-input__native', placeholderClass, customInputClass]"
      :value="nativeValue"
      :placeholder="placeholder"
      :style="placeholderStyle ? `::placeholder { ${placeholderStyle} }` : undefined"
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
      @focus="onFocus"
      @blur="onBlur"
      @keydown="onKeydown"
    />

    <input
      v-else
      :id="inputId"
      :class="['sn-input__native', placeholderClass, customInputClass]"
      :type="effectivePasswordType"
      :inputmode="inputmode"
      :value="nativeValue"
      :placeholder="placeholder"
      :style="placeholderStyle ? `::placeholder { ${placeholderStyle} }` : undefined"
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
      @focus="onFocus"
      @blur="onBlur"
      @keydown="onKeydown"
    />

    <span
      v-if="showPassword && isPassword"
      class="sn-input__password-toggle"
      aria-hidden="true"
    >
      <button
        type="button"
        class="sn-input__password-toggle-btn"
        :tabindex="isInteractive ? 0 : -1"
        :aria-label="passwordVisible ? 'Hide password' : 'Show password'"
        @click.stop="passwordVisible = !passwordVisible"
      >
        <SnIcon :icon="passwordToggleIcon" :size="11" />
      </button>
    </span>

    <span v-if="clearVisible" class="sn-input__clear" aria-hidden="true">
      <button
        type="button"
        class="sn-input__clear-btn"
        :tabindex="isInteractive ? 0 : -1"
        :aria-label="ariaLabel ? `Clear ${ariaLabel}` : 'Clear input'"
        @click.stop="onClear($event)"
      >
        <slot name="clear-icon"><SnIcon :icon="defaultClearIcon" :size="10" /></slot>
      </button>
    </span>

    <span v-else-if="slots.suffix || suffixIcon" class="sn-input__suffix" aria-hidden="true" @click.stop="onClickSuffixIcon">
      <slot name="suffix" />
      <span v-if="!slots.suffix && suffixIcon" :class="cssIcon ? suffixIcon : ''">
        <SnIcon v-if="!cssIcon" :name="suffixIcon" :size="14" />
      </span>
    </span>

    <span v-if="showCounter" class="sn-input__count" aria-live="polite">
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

/* Border variants — `border='all'` is the default; `border='bottom'` only
 * shows a bottom edge (typical for inline form rows that sit on a card);
 * `border='none'` drops the border entirely (used by the search-bar style
 * and FormItem's compact mode). */
.sn-input--border-all { border: 1px solid var(--sn-web-input-border-color, var(--sn-web-color-border-default)); }
.sn-input--border-bottom {
  border: none;
  border-bottom: 1px solid var(--sn-web-input-border-color, var(--sn-web-color-border-default));
  border-radius: 0;
  padding-left: 0;
  padding-right: 0;
}
.sn-input--border-none {
  border-color: transparent;
}
.sn-input--border-none:focus-within {
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

/* Focus state — border color + outer ring so users can see
 * exactly which field owns the focus without a heavy chrome change. */
.sn-input:focus-within {
  border-color: var(--sn-web-input-border-color-focus, var(--sn-web-color-action-primary));
  box-shadow: 0 0 0 3px var(--sn-web-focus-ring, rgba(22, 119, 255, 0.15));
}

/* Sizes — `mini` is the wot-ui-parity extra size added below `tiny`. */
.sn-input--mini { height: 22px; font-size: 11px; }
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

/* Right-aligned value (amount fields). */
.sn-input--align-right .sn-input__native {
  text-align: right;
}

/* Compact layout — strips padding and background so the field sits flush
 * inside a FormItem / Cell. */
.sn-input--compact {
  padding: 0 8px;
  background-color: transparent;
  border-color: transparent;
}
.sn-input--compact:focus-within {
  background-color: var(--sn-web-input-bg, var(--sn-web-color-background-surface));
  border-color: var(--sn-web-input-border-color, var(--sn-web-color-border-default));
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
  /* Distinguish placeholder from input value — deliberately lighter
   * than the regular text color so the user can tell empty from
   * filled state at a glance. */
  color: var(--sn-web-input-placeholder-color, var(--sn-web-color-text-tertiary));
  opacity: 1; /* Firefox lower the opacity by default; restore parity. */
}

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
  cursor: pointer;
}

/* Password show/hide toggle */
.sn-input__password-toggle {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
}
.sn-input__password-toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: none;
  background: var(--sn-web-color-background-elevated, rgba(0, 0, 0, 0.06));
  color: var(--sn-web-color-text-secondary);
  border-radius: 50%;
  font-size: 11px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
}
.sn-input__password-toggle-btn:hover {
  background: var(--sn-web-color-background-overlay, rgba(0, 0, 0, 0.12));
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

/* Textarea wrapper layout */
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