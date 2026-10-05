<script setup lang="ts">
/**
 * sn-input — uni-end text input component (AUI-MP-003).
 *
 * Phase 1 contract: 1:1 mirror of wot-ui's `wd-input`. Anything new added
 * here must also be added to the web `SnInput` (vue-web) and to the
 * wot-ui reference list documented in AGENTS.md §112.
 *
 * The uni-end layer adds a handful of mini-program-only props that the
 * web layer doesn't need:
 *
 *   - `confirm-type`     — Enter-key hint shown on the soft keyboard
 *   - `hold-keyboard`    — keep the keyboard up after the field blurs
 *   - `adjust-position`  — auto-scroll the page when keyboard covers the field
 *   - `always-embed`     — keep the input mounted even when detached
 *   - `cursor`           — initial caret position
 *   - `selection-start`  — initial selection range start
 *   - `selection-end`    — initial selection range end
 *
 * Per AGENTS.md §32 this component handles rendering + interaction +
 * DOM bridge only. Validation rules live on `sn-form-item`.
 */

import { computed, markRaw, nextTick, ref, useId, useSlots } from 'vue'
import SnIcon from '../sn-icon/sn-icon.vue'
import type { IconData } from '../sn-icon/sn-icon.vue'
import { Eye, EyeOff, X as XIcon } from '../sn-icon/sn-icon-set'

defineOptions({ name: 'SnInput' })

const props = withDefaults(
  defineProps<{
    /** Bound value. Coerced to `number` when type='number' / 'digit'. */
    modelValue?: string | number
    /**
     * Native input type. Mirrors the wd-input 16-type grid.
     *  - `text` | `number` | `digit` | `idcard` | `safe-password` | `nickname`
     *  - `tel` | `password` | `email` | `url` | `search` | `textarea`
     */
    type?: 'text' | 'number' | 'digit' | 'idcard' | 'safe-password' | 'nickname'
      | 'tel' | 'password' | 'email' | 'url' | 'search' | 'textarea'
    /** Mobile-first size preset. Drives rpx height + font-size. */
    size?: 'small' | 'medium' | 'large'
    /** Placeholder text. */
    placeholder?: string
    /** Inline style declarations for the placeholder pseudo-element. */
    placeholderStyle?: string
    /** Class applied to the placeholder pseudo-element (uni-app MP). */
    placeholderClass?: string
    /** Disables interaction. Native `disabled` attribute is set. */
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
    /**
     * Show the running `current / max` counter (right-aligned).
     * Aliased as `showWordLimit` for wot-ui parity.
     */
    showCount?: boolean
    /** wot-ui alias for `showCount`. */
    showWordLimit?: boolean
    /** Show × button to clear value. */
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
    /** Front-icon name. Resolved via the local sn-icon registry. */
    prefixIcon?: string
    /** Tail-icon name. Resolved via the local sn-icon registry. */
    suffixIcon?: string
    /** CSS class names for the prefix icon (when prefixIcon is treated as class). */
    iconPrefix?: string
    /** CSS class names for the suffix icon (when suffixIcon is treated as class). */
    iconSuffix?: string
    /**
     * CSS-icon mode. When `true`, `prefixIcon` / `suffixIcon` are
     * treated as class names applied directly to a span (rather than
     * resolved through the sn-icon registry).
     */
    cssIcon?: boolean | string
    /** Visual status. Driven by sn-form-item validation; manual override allowed. */
    status?: 'default' | 'error' | 'warning'
    /** Lower bound (numeric input only). */
    min?: number
    /** Upper bound (numeric input only). */
    max?: number
    /** Step (numeric input only). */
    step?: number
    /** Textarea row count (textarea only). */
    rows?: number
    /**
     * Border preset (wot-ui parity). 3-way supersedes the legacy boolean.
     *  - `all`    — full 1rpx border on all sides (default).
     *  - `bottom` — only the bottom edge gets a border (inline form rows).
     *  - `none`   — no border at all.
     *
     * The older boolean `bordered` prop is kept as a deprecated alias —
     * `bordered: true` === `border: 'all'`, `bordered: false` === `border: 'none'`.
     */
    border?: 'all' | 'bottom' | 'none'
    /** @deprecated Use `border="all" | "none"` instead. */
    bordered?: boolean
    /**
     * Background tone. `surface` (default) uses the elevated card
     * color; `transparent` removes the background for inputs that
     * sit directly on a colored banner; `soft` is a subtle secondary
     * fill.
     */
    bg?: 'surface' | 'transparent' | 'soft'
    /** Custom hex / rbg / named color overrides the bg tone. */
    customBg?: string
    /**
     * Border-radius preset. `default` matches the design system radius;
     * `pill` gives a fully rounded field; `square` is right-angled.
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

    /* ── uni-app MP-only props ───────────────────────────────────────────── */

    /**
     * Soft-keyboard confirm button label.
     * `send` | `search` | `next` | `go` | `done` (default `done`).
     */
    confirmType?: 'send' | 'search' | 'next' | 'go' | 'done'
    /** Keep the soft keyboard up after the field blurs. */
    holdKeyboard?: boolean
    /** Auto-scroll the page when keyboard covers the field. */
    adjustPosition?: boolean
    /** Keep the input mounted even when detached (uni-app MP opt-in). */
    alwaysEmbed?: boolean
    /** Initial caret position. */
    cursor?: number
    /** Initial selection range start. */
    selectionStart?: number
    /** Initial selection range end. */
    selectionEnd?: number
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
    iconPrefix: '',
    iconSuffix: '',
    cssIcon: false,
    status: 'default',
    rows: 3,
    border: 'all',
    bordered: true,
    bg: 'surface',
    customBg: '',
    radius: 'default',
    alignRight: false,
    compact: false,
    focus: false,
    inputmode: 'text',
    customInputClass: '',
    customClass: '',
    customStyle: '',
    confirmType: 'done',
    holdKeyboard: false,
    adjustPosition: true,
    alwaysEmbed: false,
    cursor: -1,
    selectionStart: -1,
    selectionEnd: -1,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'input', value: string | number, event: Event): void
  (e: 'change', value: string | number, event: Event): void
  (e: 'focus', event: Event): void
  (e: 'blur', event: Event): void
  (e: 'clear'): void
  (e: 'click', event: Event): void
  (e: 'clickPrefixIcon', event: Event): void
  (e: 'clickSuffixIcon', event: Event): void
  (e: 'confirm', value: string | number): void
}>()

defineSlots<{
  prefix?(): unknown
  'prefix-icon'?(): unknown
  suffix?(): unknown
  'suffix-icon'?(): unknown
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
const isPassword = computed(() => props.type === 'password')
const textareaRows = computed(() => props.rows ?? 3)

/**
 * Effective border mode after the `bordered` boolean alias is folded
 * into the canonical `border` string.
 */
const borderMode = computed<'all' | 'bottom' | 'none'>(() => {
  if (props.border !== 'all') return props.border
  return props.bordered === false ? 'none' : 'all'
})

/** Whether the clear button should be visible right now. */
const isFocused = ref(false)
const clearVisible = computed(() => {
  if (!props.clearable || props.disabled || props.readonly) return false
  if (nativeValue.value.length === 0) return false
  if (props.clearTrigger === 'focus') return isFocused.value
  return true
})

const currentLength = computed(() => nativeValue.value.length)
const ariaInvalid = computed(() => props.status === 'error' ? 'true' : undefined)
const showCounter = computed(() => props.showCount || props.showWordLimit)
const isInteractive = computed(() => !props.disabled && !props.readonly)

/** Password show/hide state. */
const passwordVisible = ref(false)
const effectivePasswordType = computed(() =>
  props.type === 'password' && passwordVisible.value ? 'text' : props.type,
)
/**
 * Eye-toggle icon — `EyeOff` while password is visible, `Eye` otherwise.
 * Per AGENTS.md §113, UI icons must come from SnIcon / SnIcon registry;
 * emoji 🙈 / 👁 is never rendered.
 */
const passwordToggleIcon = computed<IconData>(() =>
  markRaw(passwordVisible.value ? EyeOff : Eye),
)
/** Default clear-button glyph (sn-icon-set X). markRaw'd so SnIcon doesn't
 *  proxy the IconData record. */
const defaultClearIcon = markRaw(XIcon)

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

function onFocus(event: Event): void {
  isFocused.value = true
  emit('focus', event)
}

function onBlur(event: Event): void {
  isFocused.value = false
  emit('blur', event)
}

function onConfirm(event: Event): void {
  const next: number | string = (props.type === 'number' || props.type === 'digit') && nativeValue.value !== '' ? Number(nativeValue.value) : nativeValue.value
  emit('confirm', next)
  void event
}

function onClear(): void {
  emit('update:modelValue', '')
  emit('clear')
  if (!props.focusWhenClear) return
  nextTick(() => {
    /* Re-focus is intentionally a no-op on uni-end because the soft
     * keyboard is dismissed on blur in MP environments; consumers that
     * want to programmatically re-focus should listen for the `clear`
     * event and call .focus() on the input ref themselves. */
  })
}

function onClickRoot(event: Event): void {
  emit('click', event)
}

function onClickPrefixIcon(event: Event): void {
  emit('clickPrefixIcon', event)
}

function onClickSuffixIcon(event: Event): void {
  emit('clickSuffixIcon', event)
}

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
    'sn-input--with-prefix': !!(slots.prefix || props.prefixIcon || props.iconPrefix),
    'sn-input--with-suffix': !!(slots.suffix || props.suffixIcon || props.iconSuffix),
    'sn-input--with-count': showCounter.value,
    'sn-input--align-right': props.alignRight,
    'sn-input--compact': props.compact,
    'sn-input--with-clear': clearVisible.value,
  },
  props.customClass,
])

const wrapperStyle = computed(() => {
  let style = ''
  if (props.customBg) style += `background-color: ${props.customBg};`
  if (typeof props.customStyle === 'string') style += props.customStyle
  else if (props.customStyle) {
    style += Object.entries(props.customStyle).map(([k, v]) => `${k}:${v}`).join(';')
  }
  return style || undefined
})

/**
 * Uni-app MP-only native input attributes grouped into a single computed
 * so vue-tsc doesn't choke on `<input>` not declaring them on its
 * intrinsic HTMLInputElement interface. They're all standard MP runtime
 * hints — uni-app compiles them through to the underlying MP renderer.
 */
const mpNativeAttrs = computed(() => {
  const attrs: Record<string, string | number | boolean | undefined> = {}
  attrs['confirm-type'] = props.confirmType
  attrs['hold-keyboard'] = props.holdKeyboard
  attrs['adjust-position'] = props.adjustPosition
  attrs['always-embed'] = props.alwaysEmbed
  if (props.cursor >= 0) attrs['cursor'] = props.cursor
  if (props.selectionStart >= 0) attrs['selection-start'] = props.selectionStart
  if (props.selectionEnd >= 0) attrs['selection-end'] = props.selectionEnd
  return attrs
})

/** Placeholder is a separate native input attribute in uni-app. */
const placeholderStyleAttr = computed(() => props.placeholderStyle || undefined)
const placeholderClassAttr = computed(() => props.placeholderClass || undefined)
</script>

<template>
  <view
    :class="classList"
    :style="wrapperStyle"
    :data-snui-component="isTextarea ? 'textarea' : 'input'"
    :data-size="size"
    :data-status="status"
    :data-border="borderMode"
    @click="onClickRoot"
  >
    <view
      v-if="slots.prefix || prefixIcon || iconPrefix"
      class="sn-input__prefix"
      aria-hidden="true"
      @tap.stop="onClickPrefixIcon"
    >
      <slot name="prefix" />
      <view
        v-if="!slots.prefix && (prefixIcon || iconPrefix)"
        :class="cssIcon ? (prefixIcon || iconPrefix) : 'sn-input__icon-glyph'"
      >
        <slot name="prefix-icon" />
      </view>
    </view>

    <textarea
      v-if="isTextarea"
      :id="inputId"
      :class="['sn-input__native', placeholderClass, customInputClass]"
      :value="nativeValue"
      :placeholder="placeholder"
      :placeholder-style="placeholderStyleAttr"
      :placeholder-class="placeholderClassAttr"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :rows="textareaRows"
      :aria-label="ariaLabel"
      :aria-invalid="ariaInvalid"
      :aria-required="required ? 'true' : undefined"
      v-bind="mpNativeAttrs"
      @input="onInput"
      @change="onChange"
      @focus="onFocus"
      @blur="onBlur"
      @confirm="onConfirm"
    />

    <input
      v-else
      :id="inputId"
      :class="['sn-input__native', placeholderClass, customInputClass]"
      :type="effectivePasswordType"
      :inputmode="inputmode"
      :value="nativeValue"
      :placeholder="placeholder"
      :placeholder-style="placeholderStyleAttr"
      :placeholder-class="placeholderClassAttr"
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
      v-bind="mpNativeAttrs"
      @input="onInput"
      @change="onChange"
      @focus="onFocus"
      @blur="onBlur"
      @confirm="onConfirm"
    />

    <view
      v-if="showPassword && isPassword"
      class="sn-input__password-toggle"
      aria-hidden="true"
    >
      <view
        class="sn-input__password-toggle-btn"
        :aria-label="passwordVisible ? 'Hide password' : 'Show password'"
        :tabindex="isInteractive ? 0 : -1"
        @tap.stop="passwordVisible = !passwordVisible"
      ><SnIcon :icon="passwordToggleIcon" :size="20" /></view>
    </view>

    <view v-if="clearVisible" class="sn-input__clear" aria-hidden="true">
      <view
        class="sn-input__clear-btn"
        :aria-label="ariaLabel ? `Clear ${ariaLabel}` : 'Clear input'"
        :tabindex="isInteractive ? 0 : -1"
        @tap.stop="onClear"
      >
        <slot name="clear-icon"><SnIcon :icon="defaultClearIcon" :size="20" /></slot>
      </view>
    </view>

    <view
      v-else-if="slots.suffix || suffixIcon || iconSuffix"
      class="sn-input__suffix"
      aria-hidden="true"
      @tap.stop="onClickSuffixIcon"
    >
      <slot name="suffix" />
      <view
        v-if="!slots.suffix && (suffixIcon || iconSuffix)"
        :class="cssIcon ? (suffixIcon || iconSuffix) : 'sn-input__icon-glyph'"
      >
        <slot name="suffix-icon" />
      </view>
    </view>

    <view v-if="showCounter" class="sn-input__count" aria-live="polite">
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
  transition: border-color 0.18s ease-out, background-color 0.18s ease-out;
}

/* Border variants — `border='all'` is the default; `border='bottom'` only
 * shows a bottom edge (typical for inline form rows that sit on a card);
 * `border='none'` drops the border entirely. */
.sn-input--border-all { border: 2rpx solid var(--sn-mp-input-border-color, var(--sn-mp-color-border-default)); }
.sn-input--border-bottom {
  border: none;
  border-bottom: 2rpx solid var(--sn-mp-input-border-color, var(--sn-mp-color-border-default));
  border-radius: 0;
  padding-left: 0;
  padding-right: 0;
}
.sn-input--border-none { border-color: transparent; }
.sn-input--border-none:focus-within { border-color: transparent; }

/* Background tones */
.sn-input--bg-surface {
  background-color: var(--sn-mp-input-bg, var(--sn-mp-color-background-surface));
}
.sn-input--bg-transparent { background-color: transparent; }
.sn-input--bg-soft {
  background-color: var(--sn-mp-color-background-soft, rgba(0, 0, 0, 0.04));
}

/* Radius presets */
.sn-input--radius-default { border-radius: var(--sn-mp-input-radius, 12rpx); }
.sn-input--radius-pill { border-radius: 999rpx; }
.sn-input--radius-square { border-radius: 0; }

/* Focus state — border color soft outer ring so users can see
 * exactly which field owns the focus without a heavy chrome change. */
.sn-input:focus-within {
  border-color: var(--sn-mp-input-border-color-focus, var(--sn-mp-color-action-primary));
}

/* Sizes */
.sn-input--small { height: 56rpx; font-size: 24rpx; }
.sn-input--medium { height: 72rpx; font-size: 28rpx; }
.sn-input--large { height: 88rpx; font-size: 32rpx; }

/* Status — applied after the focus border so error/warning wins. */
.sn-input--status-error { border-color: var(--sn-mp-color-feedback-danger); }
.sn-input--status-warning { border-color: var(--sn-mp-color-feedback-warning); }

/* States */
.sn-input--disabled,
.sn-input--disabled .sn-input__native { cursor: not-allowed; opacity: 0.5; }
.sn-input--readonly .sn-input__native { cursor: default; }

/* Right-aligned value (amount fields). */
.sn-input--align-right .sn-input__native { text-align: right; }

/* Compact layout — strips padding and background so the field sits flush
 * inside a FormItem / Cell. */
.sn-input--compact {
  padding: 0 16rpx;
  background-color: transparent;
  border-color: transparent;
}
.sn-input--compact:focus-within {
  background-color: var(--sn-mp-input-bg, var(--sn-mp-color-background-surface));
  border-color: var(--sn-mp-input-border-color, var(--sn-mp-color-border-default));
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
  color: var(--sn-mp-input-placeholder-color, var(--sn-mp-color-text-tertiary));
  opacity: 1;
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
  cursor: pointer;
}

/* Icon glyph slot — host project can `<view slot="prefix-icon">` here. */
.sn-input__icon-glyph {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32rpx;
  height: 32rpx;
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
  width: 32rpx;
  height: 32rpx;
  background: var(--sn-mp-color-background-elevated, rgba(0, 0, 0, 0.06));
  color: var(--sn-mp-color-text-secondary);
  border-radius: 50%;
  font-size: 24rpx;
  line-height: 1;
  cursor: pointer;
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

/* Doodle skin. */
.snui-skin-doodle .sn-input {
  border-width: 5rpx;
  border-style: solid;
  border-color: #1a1a1a;
  background-color: var(--sn-mp-color-background-elevated, #fff);
  font-weight: 600;
}
.snui-skin-doodle .sn-input:hover:not(.sn-input--disabled):not(.sn-input--readonly) {
  transform: translate(-2rpx, -2rpx);
  box-shadow: 4rpx 4rpx 0 #1a1a1a;
}
.snui-skin-doodle .sn-input:focus-within {
  transform: translate(-2rpx, -2rpx);
  box-shadow: 4rpx 4rpx 0 #1a1a1a;
}
.snui-skin-doodle .sn-input__password-toggle-btn,
.snui-skin-doodle .sn-input__clear-btn {
  border: 4rpx solid #1a1a1a;
  box-shadow: 2rpx 2rpx 0 #1a1a1a;
}
</style>