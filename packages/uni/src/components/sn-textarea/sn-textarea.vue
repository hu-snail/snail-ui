<script setup lang="ts">
/**
 * sn-textarea (uni-end) — multi-line text entry for mobile / miniprogram.
 *
 * Reference library: wot-ui `wd-textarea`
 *   (https://wot-ui.cn/component/textarea.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-textarea 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-textarea/sn-textarea.vue
 * → auto-registered as `<sn-textarea>` in any .vue that uses it.
 *
 * Per AGENTS.md §32, this component handles rendering + interaction + DOM
 * bridge only. No schema validation; no business logic.
 *
 * Not responsible for:
 *   - 单行输入 — 用 sn-input（`type="textarea"` 只是它的兼容入口）
 *   - 校验信息展示 — 用 sn-form-item
 */

import { computed, markRaw, ref, useSlots } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import type { IconData } from '../sn-icon/sn-icon.vue';
import { X as XIcon } from '../sn-icon/sn-icon-set';
import { resolveIconByName } from '../sn-icon/sn-icon-registry';

defineOptions({ name: 'SnTextarea' });

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-textarea` 1:1 surface ───────────────────────────────── */

    /** Bound value (v-model). Numbers are rendered as their string form. */
    modelValue?: string | number;
    /** Placeholder text. wd-textarea defaults to `请输入...`. */
    placeholder?: string;
    /** Inline style declarations for the placeholder pseudo-element. */
    placeholderStyle?: string;
    /** Class applied to the placeholder pseudo-element (uni-app MP). */
    placeholderClass?: string;
    /** Disables interaction. Native `disabled` attribute is set. */
    disabled?: boolean;
    /** Read-only — value is visible but not editable. */
    readonly?: boolean;
    /** Max character length. `-1` means unlimited (wd-textarea default). */
    maxlength?: number;
    /** Show the × clear button. */
    clearable?: boolean;
    /** Front icon name, resolved through the sn-icon registry. */
    prefixIcon?: string;
    /** Front icon CSS class (bypasses the sn-icon registry). */
    iconPrefix?: string;
    /** When `true`, `prefixIcon` is treated as a CSS class name. */
    cssIcon?: boolean | string;
    /** Show the running `current / max` counter. Requires `maxlength`. */
    showWordLimit?: boolean;
    /** When the clear button is shown: `always` or only while focused. */
    clearTrigger?: 'always' | 'focus';
    /** Refocus the field after the clear button is tapped. */
    focusWhenClear?: boolean;
    /** Error state — red border + `aria-invalid`. */
    error?: boolean;
    /** Focus the field on mount. */
    focus?: boolean;
    /** Auto-focus + raise the soft keyboard on mount. */
    autoFocus?: boolean;
    /** Grow the field height with its content. */
    autoHeight?: boolean;
    /** Fixed-position mode — prevents the field from being pushed by the keyboard. */
    fixed?: boolean;
    /** Distance kept between the caret and the soft keyboard (px). */
    cursorSpacing?: number;
    /** Initial caret position. `-1` means "unset". */
    cursor?: number;
    /** Soft-keyboard confirm button label. */
    confirmType?: 'send' | 'search' | 'next' | 'go' | 'done' | undefined;
    /** Keep the keyboard up when the confirm button is tapped. */
    confirmHold?: boolean;
    /** Show the "完成" toolbar above the soft keyboard. */
    showConfirmBar?: boolean;
    /** Initial selection range start. Pairs with `selectionEnd`. */
    selectionStart?: number;
    /** Initial selection range end. Pairs with `selectionStart`. */
    selectionEnd?: number;
    /** Auto-scroll the page when the keyboard covers the field. */
    adjustPosition?: boolean;
    /** Drop the iOS default inner padding. */
    disableDefaultPadding?: boolean;
    /** Keep the keyboard up when the page is tapped while focused. */
    holdKeyboard?: boolean;
    /** Ignore composition events; `false` emits `input` mid-composition. */
    ignoreCompositionEvent?: boolean;
    /** Soft-keyboard type hint. */
    inputmode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
    /** Alipay MP: use the native textarea (avoids the keyboard push-up jump). */
    enableNative?: boolean;
    /**
     * Compact layout — strips the default padding / background so the field
     * nests inside a form row. `undefined` lets `sn-form-item` decide.
     */
    compact?: boolean | undefined;
    /** Class on the inner native `<textarea>`. */
    customTextareaClass?: string;
    /** Class on the root wrapper. */
    customClass?: string;
    /** Inline style on the root wrapper. */
    customStyle?: string;
  }>(),
  {
    modelValue: '',
    placeholder: '请输入...',
    placeholderStyle: '',
    placeholderClass: '',
    disabled: false,
    readonly: false,
    maxlength: -1,
    clearable: false,
    prefixIcon: '',
    iconPrefix: '',
    cssIcon: false,
    showWordLimit: false,
    clearTrigger: 'always',
    focusWhenClear: true,
    error: false,
    focus: false,
    autoFocus: false,
    autoHeight: false,
    fixed: false,
    cursorSpacing: 0,
    cursor: -1,
    confirmType: undefined,
    confirmHold: false,
    showConfirmBar: true,
    selectionStart: -1,
    selectionEnd: -1,
    adjustPosition: true,
    disableDefaultPadding: false,
    holdKeyboard: false,
    ignoreCompositionEvent: true,
    inputmode: 'text',
    enableNative: true,
    compact: undefined,
    customTextareaClass: '',
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  /** v-model sync — fired on every keystroke. */
  (e: 'update:modelValue', value: string): void;
  /** Native input event. */
  (e: 'input', value: string, event: Event): void;
  /** Value committed (native change / blur). */
  (e: 'change', value: string, event: Event): void;
  /** Focused. */
  (e: 'focus', event: Event): void;
  /** Blurred. */
  (e: 'blur', event: Event): void;
  /** The × clear button was tapped. */
  (e: 'clear'): void;
  /** Line count changed (native `linechange`). */
  (e: 'linechange', event: Event): void;
  /** Soft-keyboard confirm button tapped. */
  (e: 'confirm', value: string): void;
  /** Soft-keyboard height changed. */
  (e: 'keyboardheightchange', event: Event): void;
  /** Root node tapped. */
  (e: 'click', event: Event): void;
}>();

const slots = useSlots();

/** DOM-bound value — always a string. */
const nativeValue = computed<string>(() =>
  props.modelValue === null || props.modelValue === undefined ? '' : String(props.modelValue),
);

const isFocused = ref(false);

/** Whether the clear button is visible right now. */
const clearVisible = computed(() => {
  if (!props.clearable || props.disabled || props.readonly) return false;
  if (nativeValue.value.length === 0) return false;
  if (props.clearTrigger === 'focus') return isFocused.value;
  return true;
});

const currentLength = computed(() => nativeValue.value.length);
/** `-1` is wd-textarea's "unlimited" sentinel — never render it as a bound. */
const hasLimit = computed(() => props.maxlength > 0);
const counterVisible = computed(() => props.showWordLimit && hasLimit.value);
const isInteractive = computed(() => !props.disabled && !props.readonly);

/** Front icon — `prefixIcon` (registry) wins over `iconPrefix` (CSS class). */
const prefixIconData = computed<IconData | null>(() => {
  if (!props.prefixIcon || props.cssIcon) return null;
  const icon = resolveIconByName(props.prefixIcon);
  return icon ? markRaw(icon) : null;
});
/** Default × glyph for the clear button. */
const defaultClearIcon = markRaw(XIcon);

function onInput(event: Event): void {
  if (!isInteractive.value) return;
  const target = event.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value);
  emit('input', target.value, event);
}

function onChange(event: Event): void {
  if (!isInteractive.value) return;
  const target = event.target as HTMLTextAreaElement;
  emit('change', target.value, event);
}

function onFocus(event: Event): void {
  isFocused.value = true;
  emit('focus', event);
}

function onBlur(event: Event): void {
  isFocused.value = false;
  emit('blur', event);
}

function onConfirm(event: Event): void {
  if (!isInteractive.value) return;
  emit('confirm', nativeValue.value);
  void event;
}

function onLineChange(event: Event): void {
  emit('linechange', event);
}

function onKeyboardHeightChange(event: Event): void {
  emit('keyboardheightchange', event);
}

function onClear(): void {
  if (!isInteractive.value) return;
  emit('update:modelValue', '');
  emit('clear');
  /* `focusWhenClear` is declared for wd-textarea parity, but re-focusing is a
   * no-op on uni-end: the soft keyboard is dismissed on blur in MP
   * environments. Consumers that need it call .focus() from their own ref in
   * the `clear` listener (same contract as sn-input). */
}

function onClickRoot(event: Event): void {
  emit('click', event);
}

const classList = computed(() => [
  'sn-textarea',
  `sn-textarea--${props.error ? 'error' : 'default'}`,
  {
    'sn-textarea--disabled': props.disabled,
    'sn-textarea--readonly': props.readonly,
    /* Focus chrome rides this class instead of `:focus-within` (§116.2 —
     * App has no pseudo-classes); the flag is set from the native
     * textarea's focus / blur events, the same signal the browser used. */
    'sn-textarea--focused': isFocused.value,
    'sn-textarea--compact': props.compact === true,
    'sn-textarea--auto-height': props.autoHeight,
    'sn-textarea--with-prefix': !!(slots.prefix || props.prefixIcon || props.iconPrefix),
    'sn-textarea--with-counter': counterVisible.value,
    'sn-textarea--with-clear': clearVisible.value,
  },
  props.customClass,
]);

const wrapperStyle = computed(() => props.customStyle || undefined);

/** Placeholder styling is a native attribute — App has no `::placeholder`
 * (§116.2). The default keeps the token color the CSS rule used to provide. */
const DEFAULT_PLACEHOLDER_STYLE = 'color: var(--sn-mp-color-input-placeholder); opacity: 1';
const placeholderStyleAttr = computed(() => props.placeholderStyle || DEFAULT_PLACEHOLDER_STYLE);

/**
 * uni-app MP-only native textarea attributes.（MP 端模板不支持 v-bind="obj"
 * 展开，这些属性已在模板中显式逐条绑定。）
 */
</script>

<template>
  <view
    :class="classList"
    :style="wrapperStyle"
    :data-snui-component="'textarea'"
    :data-status="error ? 'error' : 'default'"
    @click="onClickRoot"
  >
    <view
      v-if="slots.prefix || prefixIcon || iconPrefix"
      class="sn-textarea__prefix"
      aria-hidden="true"
    >
      <slot name="prefix" />
      <SnIcon v-if="prefixIconData" :icon="prefixIconData" :size="32" />
      <view
        v-else-if="!slots.prefix && (prefixIcon || iconPrefix)"
        :class="cssIcon || iconPrefix ? iconPrefix || prefixIcon : 'sn-textarea__icon-glyph'"
      />
    </view>

    <textarea
      class="sn-textarea__native"
      :class="[placeholderClass, customTextareaClass]"
      :value="nativeValue"
      :placeholder="placeholder"
      :placeholder-style="placeholderStyleAttr"
      :placeholder-class="placeholderClass || undefined"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :focus="focus"
      :inputmode="inputmode"
      :aria-label="placeholder"
      :aria-invalid="error ? 'true' : undefined"
      :aria-disabled="disabled ? 'true' : undefined"
      :aria-readonly="readonly ? 'true' : undefined"
      :auto-focus="autoFocus"
      :auto-height="autoHeight"
      :fixed="fixed"
      :cursor-spacing="cursorSpacing"
      :confirm-hold="confirmHold"
      :show-confirm-bar="showConfirmBar"
      :adjust-position="adjustPosition"
      :disable-default-padding="disableDefaultPadding"
      :hold-keyboard="holdKeyboard"
      :ignore-composition-event="ignoreCompositionEvent"
      :enable-native="enableNative"
      :confirm-type="confirmType"
      :cursor="cursor !== undefined && cursor >= 0 ? cursor : undefined"
      :selection-start="
        selectionStart !== undefined && selectionStart >= 0 ? selectionStart : undefined
      "
      :selection-end="selectionEnd !== undefined && selectionEnd >= 0 ? selectionEnd : undefined"
      @input="onInput"
      @change="onChange"
      @focus="onFocus"
      @blur="onBlur"
      @confirm="onConfirm"
      @linechange="onLineChange"
      @keyboardheightchange="onKeyboardHeightChange"
    />

    <view v-if="clearVisible || counterVisible" class="sn-textarea__footer">
      <view v-if="counterVisible" class="sn-textarea__count" aria-live="polite">
        <slot name="count" :current="currentLength" :max="maxlength">
          {{ currentLength }} / {{ maxlength }}
        </slot>
      </view>
      <view v-if="clearVisible" class="sn-textarea__clear" aria-hidden="true">
        <view
          class="sn-textarea__clear-btn"
          aria-label="Clear textarea"
          :tabindex="isInteractive ? 0 : -1"
          @tap.stop="onClear"
        >
          <slot name="clear-icon"><SnIcon :icon="defaultClearIcon" :size="32" /></slot>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
/**
 * Geometry in rpx (750 design canvas, 1px = 2rpx). Every color resolves
 * through a real `--sn-mp-*` token — no literal hex, no light-only `var()`
 * fallback, so the `.sn-theme-dark` block flips the whole surface.
 */
.sn-textarea {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  position: relative;
  padding: var(--sn-mp-spacing-3) var(--sn-mp-input-padding-x);
  border: 2rpx solid var(--sn-mp-color-input-border);
  border-radius: var(--sn-mp-input-radius);
  background-color: var(--sn-mp-color-input-bg);
  color: var(--sn-mp-color-input-text);
  font-family: inherit;
  box-sizing: border-box;
  transition:
    border-color 0.18s ease-out,
    background-color 0.18s ease-out;
}

/* Compound classes keep the two-class specificity the `:focus-within` rule
 * had, so the `--error` rule below still loses to a focused field (§116.2 —
 * App has no pseudo-classes). */
.sn-textarea.sn-textarea--focused {
  border-color: var(--sn-mp-color-input-border-focus);
}

.sn-textarea--error {
  border-color: var(--sn-mp-color-feedback-danger);
}

.sn-textarea--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.sn-textarea--readonly .sn-textarea__native {
  cursor: default;
}

/* Compact — strips padding / background / border so the field sits flush
 * inside a form row (wd-textarea auto-enables this inside wd-form-item). */
.sn-textarea--compact {
  padding: 0;
  border-color: transparent;
  background-color: transparent;
}

.sn-textarea__native {
  width: 100%;
  min-height: 120rpx;
  border: none;
  outline: none;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: var(--sn-mp-font-size-md);
  line-height: var(--sn-mp-font-line-height-normal);
  padding: 0;
  resize: none;
}

.sn-textarea--auto-height .sn-textarea__native {
  min-height: 0;
  height: auto;
}

/* Placeholder styling rides `placeholder-style` (native attribute): App has no
 * `::placeholder` pseudo-element (§116.2). */

/* Prefix (icon / slot) sits above the field so the textarea keeps full width. */
.sn-textarea__prefix {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-md);
  flex: 0 0 auto;
}

.sn-textarea__icon-glyph {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32rpx;
  height: 32rpx;
}

/* Footer — counter left, clear button right (mirrors wd-textarea layout). */
.sn-textarea__footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
}

.sn-textarea__count {
  font-size: var(--sn-mp-font-size-xs);
  color: var(--sn-mp-color-text-tertiary);
  line-height: 1;
  margin-left: auto;
}

.sn-textarea__clear {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
}

.sn-textarea__clear-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  background-color: var(--sn-mp-color-background-soft);
  color: var(--sn-mp-color-text-secondary);
  line-height: 1;
  cursor: pointer;
}

/* Doodle skin — hand-drawn outline + offset shadow. */
.snui-skin-doodle .sn-textarea {
  border-width: 5rpx;
  border-style: solid;
  border-color: var(--sn-mp-color-text-primary);
  font-weight: 600;
}
.snui-skin-doodle .sn-textarea--focused {
  transform: translate(-2rpx, -2rpx);
  box-shadow: 4rpx 4rpx 0 var(--sn-mp-color-text-primary);
}
.snui-skin-doodle .sn-textarea__clear-btn {
  border: 4rpx solid var(--sn-mp-color-text-primary);
  box-shadow: 2rpx 2rpx 0 var(--sn-mp-color-text-primary);
}
</style>
