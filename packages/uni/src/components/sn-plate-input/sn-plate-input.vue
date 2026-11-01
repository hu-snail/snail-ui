<script setup lang="ts">
/**
 * sn-plate-input (uni-end) — license-plate entry field with a popup car keyboard.
 *
 * No reference-library counterpart: wot-ui ships the car key layout
 * (`wd-keyboard` mode="car") but no field that hosts it. Per AGENTS.md
 * §112.3a this is an AUI-additive component (Human 指令 2026-11-01).
 *
 * ## Structure
 *
 * One box per plate position; tapping the field opens the shared
 * `sn-keyboard` in `car` mode — province → letter/digit layouts,
 * hold-to-repeat delete, the popup chrome and the safe-area padding are all
 * owned by the keyboard, this file only wires value + visibility. The `tap`
 * trigger sits on the box row, not the root, so taps inside the keyboard
 * popup (scrim included) never bubble back into `open()`.
 *
 * The keyboard car language (`v-model:car-lang`) lives here because
 * `autoSwitchLang` is a controlled prop: without a bound state the auto
 * province→letter switch would never land. The language resets to 省份
 * (`zh`) whenever the value is cleared, so a fresh plate starts over.
 *
 * The caret is the same static CSS bar as sn-password-input — no timers, so
 * nothing to dispose (AGENTS.md §41).
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 车牌业务校验（新能源 / 燃油、字母 I/O 排除等）— 由宿主处理
 *   - 键盘本体 — sn-keyboard（mode: 'car'）
 */

import { computed, ref, watch } from 'vue';
import SnKeyboard from '../sn-keyboard/sn-keyboard.vue';
import type { CarKeyboardLang } from '../sn-keyboard/sn-keyboard-types';

defineOptions({ name: 'SnPlateInput' });

const props = withDefaults(
  defineProps<{
    /** Current value (`v-model`), e.g. `京A12345`. */
    modelValue?: string;
    /** Plate length in boxes — 7 for standard plates, 8 for new-energy. */
    maxlength?: number;
    /** Keyboard title. */
    title?: string;
    /** Freeze the field (tapping no longer opens the keyboard). */
    disabled?: boolean;
    /**
     * Keyboard visibility (`v-model:visible`). Uncontrolled when omitted —
     * the field opens on tap; one-way bindings keep full control.
     */
    visible?: boolean | undefined;
    /** Class on the root node. */
    customClass?: string;
    /** Inline style on the root node. */
    customStyle?: string;
  }>(),
  {
    modelValue: '',
    maxlength: 7,
    title: '请输入车牌号',
    disabled: false,
    visible: undefined,
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
  (e: 'update:visible', value: boolean): void;
  (e: 'open'): void;
  (e: 'close'): void;
}>();

/** Box count clamps to at least one so a bad maxlength still renders. */
const boxCount = computed(() => Math.max(Math.floor(props.maxlength), 1));

/** Characters to render, clamped to the box count. */
const chars = computed<string[]>(() => props.modelValue.slice(0, boxCount.value).split(''));

/** Index of the box the caret sits in (the first empty box). */
const caretIndex = computed(() => (chars.value.length >= boxCount.value ? -1 : chars.value.length));

/* ── Visibility: uncontrolled fallback + controlled sync ─────────────────── */

const innerVisible = ref(props.visible ?? false);
watch(
  () => props.visible,
  (next) => {
    if (next !== undefined) innerVisible.value = next;
  },
);

/** A bound `visible` prop wins; otherwise the internal state drives. */
const isOpen = computed(() => props.visible ?? innerVisible.value);

function setVisible(next: boolean): void {
  innerVisible.value = next;
  emit('update:visible', next);
  if (next) emit('open');
  else emit('close');
}

function open(): void {
  if (props.disabled || isOpen.value) return;
  setVisible(true);
}

/* ── Car language: held here so the keyboard's auto-switch can land ──────── */

const carLang = ref<CarKeyboardLang>('zh');

/** An emptied field starts the next plate back on the province layout. */
watch(
  () => props.modelValue,
  (value) => {
    if (value === '') carLang.value = 'zh';
  },
);

function onKeyboardValue(value: string): void {
  const next = value.slice(0, boxCount.value);
  if (next === props.modelValue) return;
  emit('update:modelValue', next);
  emit('change', next);
}

function onKeyboardVisible(value: boolean): void {
  if (value === isOpen.value) return;
  setVisible(value);
}

const rootClass = computed(() => [
  'sn-plate-input',
  {
    'sn-plate-input--open': isOpen.value,
    'sn-plate-input--disabled': props.disabled,
  },
  props.customClass,
]);

const rootStyle = computed(() => props.customStyle);
</script>

<template>
  <view
    :class="rootClass"
    :style="rootStyle"
    :data-snui-component="'plate-input'"
    :aria-disabled="props.disabled ? 'true' : undefined"
  >
    <view
      class="sn-plate-input__boxes"
      role="group"
      :aria-label="'plate number, ' + chars.length + ' of ' + boxCount"
      @tap="open"
    >
      <view
        v-for="index in boxCount"
        :key="index"
        :class="[
          'sn-plate-input__box',
          {
            'sn-plate-input__box--filled': index - 1 < chars.length,
            'sn-plate-input__box--active': isOpen && caretIndex === index - 1,
          },
        ]"
        :aria-label="'position ' + index"
      >
        <text v-if="index - 1 < chars.length" class="sn-plate-input__char">{{
          chars[index - 1]
        }}</text>
        <view
          v-else-if="isOpen && caretIndex === index - 1"
          class="sn-plate-input__caret"
          aria-hidden="true"
        />
      </view>
    </view>

    <SnKeyboard
      :visible="isOpen"
      :model-value="modelValue ?? ''"
      :title="title ?? ''"
      mode="car"
      auto-switch-lang
      :maxlength="boxCount"
      v-model:car-lang="carLang"
      @update:model-value="onKeyboardValue"
      @update:visible="onKeyboardVisible"
    />
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Geometry hooks
 * (`--sn-plate-input-*`) may be re-pointed by the host from `custom-class`. */

.sn-plate-input {
  display: block;
  width: 100%;
  font-family: inherit;
}

.sn-plate-input__boxes {
  display: flex;
  align-items: center;
  gap: var(--sn-plate-input-gap, 16rpx);
  width: 100%;
}

.sn-plate-input__box {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 0;
  min-width: 0;
  height: 88rpx;
  box-sizing: border-box;
  border: 2rpx solid var(--sn-mp-color-input-border);
  border-radius: var(--sn-plate-input-radius, var(--sn-mp-radius-md));
  background-color: var(--sn-plate-input-box-bg, var(--sn-mp-color-input-bg));
  color: var(--sn-mp-color-input-text);
}

.sn-plate-input__box--active {
  border-color: var(--sn-mp-color-input-border-focus);
}

.sn-plate-input--disabled .sn-plate-input__box {
  border-color: var(--sn-mp-color-border-subtle);
  background-color: var(--sn-mp-color-background-subtle);
  color: var(--sn-mp-color-text-disabled);
}

.sn-plate-input__char {
  font-size: var(--sn-mp-font-size-xl);
  line-height: 1;
}

/* Static caret — no animation timer, so nothing to dispose. */
.sn-plate-input__caret {
  width: 2rpx;
  height: 40rpx;
  background-color: var(--sn-mp-color-action-primary);
}

/* Doodle skin — heavier box outline, same read as sn-password-input. */
.snui-skin-doodle .sn-plate-input__box {
  border-width: 4rpx;
  border-color: var(--sn-mp-color-text-primary);
  border-radius: var(--sn-mp-radius-xs);
}
</style>
