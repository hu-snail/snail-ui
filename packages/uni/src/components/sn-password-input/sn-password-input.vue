<script setup lang="ts">
/**
 * sn-password-input (uni-end) — boxed password / PIN field.
 *
 * Reference library: wot-ui `wd-password-input`
 *   (https://wot-ui.cn/component/password-input.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-password-input 1:1
 * except for the registered deviations (AGENTS.md §112.3a):
 *   - `shape: 'box' | 'underline'` — additive（Human 指令 2026-11-01）；方框 /
 *     下划线两种格子形状，参考库无对应 prop。
 *   - `background` — additive（Human 指令 2026-11-01）；格子背景色，重指
 *     `--sn-password-input-box-bg`，参考库只有 CSS var 没有 prop。
 *   - `gutter` 默认值 0 → 8（16rpx）：参考库默认 0 时格子贴死，错误态视觉
 *     尤其差（Human 指令 2026-11-01「密码不正确格子没有间距」）。显式传 0
 *     仍可回到贴合布局。
 * Anything else added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-password-input/sn-password-input.vue
 * → auto-registered as `<sn-password-input>` in any .vue that uses it.
 *
 * ## Structure
 *
 * One invisible `<input>` (native keyboard source) sits behind a row of
 * `<view>` boxes that only render the dots / characters. This keeps the
 * mini-program soft keyboard working while the visuals stay fully
 * token-driven — the native input is never visible.
 *
 * The caret is CSS-only (a blinking pseudo element is not available in every
 * MP renderer, so it is a static 2rpx bar that only shows while `focused`).
 * No `setInterval` is used, so there is nothing to dispose (AGENTS.md §41).
 *
 * ## Input plumbing (MP compat)
 *
 * - The typed value is read from `event.detail.value` first (the uni-app
 *   normalized input event carries it on BOTH ends — H5 `trigger('input', …,
 *   detail)`, MP native) with `event.target.value` as the plain-DOM fallback;
 *   reading `target.value` alone crashes on MP (`undefined.slice()`).
 * - Tapping the box row re-arms the hidden input (the reference `focus`
 *   contract: "点击密码输入框时触发"). Once the field is not actually
 *   focused — never focused (mobile H5 blocks gesture-less autofocus) or
 *   blurred for real — the `:focus` attribute is pulsed false → true across
 *   a tick: the H5 runtime (`useAutoFocus` watches the `focus` prop) and MP
 *   both re-arm on that transition. A static `:focus="focused"` can never be
 *   re-entered because the attribute never *changes* after mount.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 校验 / 错误文案 — 用 `errorInfo` 传入，或由 sn-form-item 驱动
 *   - 键盘本体 — 用 sn-keyboard（`focused` 与它的 visible 联动）
 */

import { computed, nextTick, ref } from 'vue';

defineOptions({ name: 'SnPasswordInput' });

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-password-input` 1:1 surface ──────────────────────────── */

    /** Current value (`v-model`). */
    modelValue?: string;
    /** Mask the characters as dots. */
    mask?: boolean;
    /** Helper text below the boxes. */
    info?: string;
    /** Error text below the boxes (takes precedence over `info`). */
    errorInfo?: string;
    /** Gap between boxes. A number is treated as an rpx design value. */
    gutter?: number | string;
    /** Box shape: framed `box` cells or borderless `underline` cells (additive). */
    shape?: 'box' | 'underline';
    /** Cell background color (any CSS color or `var(--sn-mp-color-*)`, additive). */
    background?: string;
    /** Number of boxes. */
    length?: number;
    /** Whether the field is focused (shows the caret). */
    focused?: boolean;
    /** Class on the root node. */
    customClass?: string;
    /** Inline style on the root node. */
    customStyle?: string;
  }>(),
  {
    modelValue: '',
    mask: true,
    info: '',
    errorInfo: '',
    gutter: 8,
    shape: 'box',
    background: '',
    length: 6,
    focused: true,
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
  (e: 'focus', event: Event): void;
  (e: 'blur', event: Event): void;
}>();

const boxCount = computed(() => Math.max(Math.floor(props.length), 1));

/** Characters to render, clamped to `length`. */
const chars = computed<string[]>(() => {
  const raw = props.modelValue.slice(0, boxCount.value);
  return raw.split('');
});

/** What a filled box shows. */
function displayAt(index: number): string {
  const char = chars.value[index];
  if (char === undefined) return '';
  return props.mask ? '•' : char;
}

/** Index of the box the caret sits in (the first empty box). */
const caretIndex = computed(() => (chars.value.length >= boxCount.value ? -1 : chars.value.length));

/**
 * uni-app normalizes the input event with the typed value on `event.detail`
 * (H5 runtime `trigger('input', …, detail)`, MP native alike);
 * `event.target.value` is only the plain-DOM fallback.
 */
function readInputValue(event: Event): string {
  const detail = (event as { detail?: { value?: unknown } }).detail;
  if (detail && typeof detail.value === 'string') return detail.value;
  const target = event.target as HTMLInputElement | null;
  return typeof target?.value === 'string' ? target.value : '';
}

function onInput(event: Event): void {
  const next = readInputValue(event).slice(0, boxCount.value);
  emit('update:modelValue', next);
  emit('change', next);
}

/**
 * Real focus state as reported by the native input's own events. Defaults to
 * `false` so the very first tap always pulses — mobile H5 blocks gesture-less
 * autofocus, so "mounted but never focused" is the common state there.
 */
const isNativeFocused = ref(false);

function onFocus(event: Event): void {
  isNativeFocused.value = true;
  emit('focus', event);
}

function onBlur(event: Event): void {
  isNativeFocused.value = false;
  emit('blur', event);
}

/**
 * Tap-to-focus (the reference contract: focus fires on tapping the field).
 * While the field is genuinely focused a tap must NOT pulse — the false →
 * true transition would bounce the soft keyboard. Fail-open by design: if
 * the native focus/blur events never arrive, every tap pulses and the field
 * can never get stuck dead.
 */
const focusPulse = ref(props.focused);

function onTap(): void {
  if (!props.focused || isNativeFocused.value) return;
  focusPulse.value = false;
  nextTick(() => {
    focusPulse.value = true;
  });
}

const rootClass = computed(() => [
  'sn-password-input',
  {
    'sn-password-input--mask': props.mask,
    'sn-password-input--underline': props.shape === 'underline',
    'sn-password-input--focused': props.focused,
    'sn-password-input--error': props.errorInfo !== '',
  },
  props.customClass,
]);

const rootStyle = computed(() => {
  const vars: string[] = [];
  if (props.gutter !== 0 && props.gutter !== '') {
    const gap = typeof props.gutter === 'number' ? `${props.gutter * 2}rpx` : props.gutter;
    vars.push(`--sn-password-input-gap: ${gap}`);
  }
  if (props.background !== '') {
    vars.push(`--sn-password-input-box-bg: ${props.background}`);
  }
  const base = vars.join('; ');
  if (!props.customStyle) return base;
  return base ? `${base}; ${props.customStyle}` : props.customStyle;
});

const message = computed(() => (props.errorInfo !== '' ? props.errorInfo : props.info));
</script>

<template>
  <view :class="rootClass" :style="rootStyle" :data-snui-component="'password-input'">
    <view
      class="sn-password-input__boxes"
      role="group"
      :aria-label="'password, ' + chars.length + ' of ' + boxCount"
      @tap="onTap"
    >
      <view
        v-for="index in boxCount"
        :key="index"
        :class="[
          'sn-password-input__box',
          {
            'sn-password-input__box--filled': index - 1 < chars.length,
            'sn-password-input__box--active': focused && caretIndex === index - 1,
            'sn-password-input__box--error': errorInfo !== '',
          },
        ]"
        :aria-label="`digit ${index}`"
      >
        <text v-if="index - 1 < chars.length" class="sn-password-input__char">{{
          displayAt(index - 1)
        }}</text>
        <view
          v-else-if="focused && caretIndex === index - 1"
          class="sn-password-input__caret"
          aria-hidden="true"
        />
      </view>
    </view>

    <input
      class="sn-password-input__native"
      type="text"
      inputmode="numeric"
      :value="modelValue"
      :maxlength="boxCount"
      :focus="focused && focusPulse"
      aria-label="password"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
    />

    <text
      v-if="message"
      :class="[
        'sn-password-input__message',
        { 'sn-password-input__message--error': errorInfo !== '' },
      ]"
    >
      {{ message }}
    </text>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). */

.sn-password-input {
  display: block;
  width: 100%;
  font-family: inherit;
}

.sn-password-input__boxes {
  display: flex;
  align-items: center;
  gap: var(--sn-password-input-gap, 16rpx);
  width: 100%;
}

.sn-password-input__box {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 0;
  min-width: 0;
  height: 88rpx;
  box-sizing: border-box;
  border: 2rpx solid var(--sn-mp-color-input-border);
  border-radius: var(--sn-password-input-radius, var(--sn-mp-radius-md));
  background-color: var(--sn-password-input-box-bg, var(--sn-mp-color-input-bg));
  color: var(--sn-mp-color-input-text);
}

.sn-password-input__box--error {
  border-color: var(--sn-mp-color-feedback-danger);
}

.sn-password-input__box--active {
  border-color: var(--sn-mp-color-input-border-focus);
}

/* Underline shape — borderless cells over a bottom rule (additive). The
 * three-class state rules re-assert the bottom border color because the
 * base underline rule would otherwise out-cascade `--active` / `--error`. */
.sn-password-input--underline .sn-password-input__box {
  border: none;
  border-bottom: 4rpx solid var(--sn-mp-color-input-border);
  border-radius: 0;
  background-color: var(--sn-password-input-box-bg, transparent);
}

.sn-password-input--underline .sn-password-input__box--active {
  border-bottom-color: var(--sn-mp-color-input-border-focus);
}

.sn-password-input--underline .sn-password-input__box--error {
  border-bottom-color: var(--sn-mp-color-feedback-danger);
}

.sn-password-input__char {
  font-size: var(--sn-mp-font-size-xl);
  line-height: 1;
}

/* Static caret — no animation timer, so nothing to dispose. */
.sn-password-input__caret {
  width: 2rpx;
  height: 40rpx;
  background-color: var(--sn-mp-color-action-primary);
}

/* The native input is the keyboard source only; it must never be visible. */
.sn-password-input__native {
  position: absolute;
  width: 2rpx;
  height: 2rpx;
  opacity: 0;
  pointer-events: none;
}

.sn-password-input__message {
  display: block;
  margin-top: var(--sn-mp-spacing-2);
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-tertiary);
}

.sn-password-input__message--error {
  color: var(--sn-mp-color-feedback-danger);
}

/* Doodle skin — heavier box outline. */
.snui-skin-doodle .sn-password-input__box {
  border-width: 4rpx;
  border-color: var(--sn-mp-color-text-primary);
  border-radius: var(--sn-mp-radius-xs);
}

/* Doodle underline — the hand-drawn look keeps the bottom rule only. */
.snui-skin-doodle .sn-password-input--underline .sn-password-input__box {
  border: none;
  border-bottom: 4rpx solid var(--sn-mp-color-text-primary);
  border-radius: 0;
}
</style>
