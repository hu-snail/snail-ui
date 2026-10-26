<script setup lang="ts">
/**
 * sn-password-input (uni-end) — boxed password / PIN field.
 *
 * Reference library: wot-ui `wd-password-input`
 *   (https://wot-ui.cn/component/password-input.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-password-input 1:1.
 * Anything new added here MUST also be added to the reference list in
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
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 校验 / 错误文案 — 用 `errorInfo` 传入，或由 sn-form-item 驱动
 *   - 键盘本体 — 用 sn-keyboard（`focused` 与它的 visible 联动）
 */

import { computed } from 'vue'

defineOptions({ name: 'SnPasswordInput' })

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-password-input` 1:1 surface ──────────────────────────── */

    /** Current value (`v-model`). */
    modelValue?: string
    /** Mask the characters as dots. */
    mask?: boolean
    /** Helper text below the boxes. */
    info?: string
    /** Error text below the boxes (takes precedence over `info`). */
    errorInfo?: string
    /** Gap between boxes. A number is treated as an rpx design value. */
    gutter?: number | string
    /** Number of boxes. */
    length?: number
    /** Whether the field is focused (shows the caret). */
    focused?: boolean
    /** Class on the root node. */
    customClass?: string
    /** Inline style on the root node. */
    customStyle?: string
  }>(),
  {
    modelValue: '',
    mask: true,
    info: '',
    errorInfo: '',
    gutter: 0,
    length: 6,
    focused: true,
    customClass: '',
    customStyle: '',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
  (e: 'focus', event: Event): void
  (e: 'blur', event: Event): void
}>()

const boxCount = computed(() => Math.max(Math.floor(props.length), 1))

/** Characters to render, clamped to `length`. */
const chars = computed<string[]>(() => {
  const raw = props.modelValue.slice(0, boxCount.value)
  return raw.split('')
})

/** What a filled box shows. */
function displayAt(index: number): string {
  const char = chars.value[index]
  if (char === undefined) return ''
  return props.mask ? '•' : char
}

/** Index of the box the caret sits in (the first empty box). */
const caretIndex = computed(() => (chars.value.length >= boxCount.value ? -1 : chars.value.length))

function onInput(event: Event): void {
  const raw = (event.target as HTMLInputElement).value
  const next = raw.slice(0, boxCount.value)
  emit('update:modelValue', next)
  emit('change', next)
}

function onFocus(event: Event): void {
  emit('focus', event)
}

function onBlur(event: Event): void {
  emit('blur', event)
}

const rootClass = computed(() => [
  'sn-password-input',
  {
    'sn-password-input--mask': props.mask,
    'sn-password-input--focused': props.focused,
    'sn-password-input--error': props.errorInfo !== '',
  },
  props.customClass,
])

const rootStyle = computed(() => {
  const vars: string[] = []
  if (props.gutter !== 0 && props.gutter !== '') {
    const gap = typeof props.gutter === 'number' ? `${props.gutter * 2}rpx` : props.gutter
    vars.push(`--sn-password-input-gap: ${gap}`)
  }
  const base = vars.join('; ')
  if (!props.customStyle) return base
  return base ? `${base}; ${props.customStyle}` : props.customStyle
})

const message = computed(() => (props.errorInfo !== '' ? props.errorInfo : props.info))
</script>

<template>
  <view
    :class="rootClass"
    :style="rootStyle"
    :data-snui-component="'password-input'"
  >
    <view class="sn-password-input__boxes" role="group" :aria-label="'password, ' + chars.length + ' of ' + boxCount">
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
        <text v-if="index - 1 < chars.length" class="sn-password-input__char">{{ displayAt(index - 1) }}</text>
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
      :focus="focused"
      aria-label="password"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
    >

    <text v-if="message" :class="['sn-password-input__message', { 'sn-password-input__message--error': errorInfo !== '' }]">
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
  gap: var(--sn-password-input-gap, 0);
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
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-input-bg);
  color: var(--sn-mp-color-input-text);
}

.sn-password-input__box--error {
  border-color: var(--sn-mp-color-feedback-danger);
}

.sn-password-input__box--active {
  border-color: var(--sn-mp-color-input-border-focus);
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
</style>
