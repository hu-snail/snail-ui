<script setup lang="ts">
/**
 * sn-input-number (uni-end) — numeric stepper with an editable field.
 *
 * Reference library: wot-ui `wd-input-number`
 *   (https://wot-ui.cn/component/input-number.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-input-number 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-input-number/sn-input-number.vue
 * → auto-registered as `<sn-input-number>` in any .vue that uses it.
 *
 * ## Value model
 *
 * `v-model` accepts `number | string` (wot-ui parity). Every commit path
 * (minus / plus / typing / blur) funnels through `commit()`, which:
 *   1. clamps into `[min, max]`,
 *   2. snaps to `step` when `stepStrictly` is on,
 *   3. rounds to `precision` decimals,
 *   4. asks `beforeChange` for permission (sync or async),
 *   5. emits `update:modelValue` + `change`.
 *
 * `allowNull` lets the field hold `''` (an explicit "empty" state) — the
 * numeric bounds are skipped in that case, which is exactly wd-input-number's
 * `allow-null` contract.
 *
 * ## Timers (AGENTS.md §41)
 *
 * `longPress` runs one `setInterval` while a button is held. It is cleared on
 * `touchend` / `touchcancel`, on unmount and before every new press, so a
 * half-pressed button can never outlive the component.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 表单校验 / 错误文案 — 用 sn-form-item
 *   - 金额格式化 / 千分位 — 由宿主格式化后传入
 */

import { computed, onBeforeUnmount, ref } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import { Minus as MinusIcon, Plus as PlusIcon } from '../sn-icon/sn-icon-set';

defineOptions({ name: 'SnInputNumber' });

/** wot-ui `InputNumberTheme`. */
type InputNumberTheme = 'default' | 'outline' | 'outline-split' | 'primary';

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-input-number` 1:1 surface ───────────────────────────── */

    /** Bound value (`v-model`). */
    modelValue?: number | string;
    /** Lower bound. */
    min?: number;
    /** Upper bound. */
    max?: number;
    /** Increment / decrement step. */
    step?: number;
    /** Snap every committed value onto the `step` grid. */
    stepStrictly?: boolean;
    /** Decimal places kept after every commit. */
    precision?: number | string;
    /** Disables the whole stepper. */
    disabled?: boolean;
    /** Disables the editable field only (buttons stay live). */
    disableInput?: boolean;
    /** Disables the minus button only. */
    disableMinus?: boolean;
    /** Disables the plus button only. */
    disablePlus?: boolean;
    /** Hide the field — buttons only. */
    withoutInput?: boolean;
    /** Field width. A number is treated as an rpx design value. */
    inputWidth?: number | string | undefined;
    /** Allow the field to hold an empty string. */
    allowNull?: boolean;
    /** Placeholder shown while the field is empty. */
    placeholder?: string;
    /** Auto-scroll the page when the soft keyboard covers the field. */
    adjustPosition?: boolean;
    /**
     * Veto hook for every value change. Returning `false` (or resolving
     * `false`) keeps the current value.
     */
    beforeChange?: ((value: number | string) => boolean | Promise<boolean>) | undefined;
    /** Repeat the step while the button is held down. */
    longPress?: boolean;
    /** Emit while typing; `false` commits on blur / button only. */
    immediateChange?: boolean;
    /** Emit a corrected value on mount (clamped / snapped / rounded). */
    updateOnInit?: boolean;
    /** Native keyboard type for the field. */
    inputType?: 'number' | 'digit';
    /** Visual theme. */
    theme?: InputNumberTheme;
    /** Fully rounded action buttons. */
    round?: boolean;
    /** Class on the root node. */
    customClass?: string;
    /** Inline style on the root node. */
    customStyle?: string;
  }>(),
  {
    modelValue: 0,
    min: 1,
    max: Number.MAX_SAFE_INTEGER,
    step: 1,
    stepStrictly: false,
    precision: 0,
    disabled: false,
    disableInput: false,
    disableMinus: false,
    disablePlus: false,
    withoutInput: false,
    inputWidth: undefined,
    allowNull: false,
    placeholder: '',
    adjustPosition: true,
    beforeChange: undefined,
    longPress: false,
    immediateChange: true,
    updateOnInit: true,
    inputType: 'digit',
    theme: 'default',
    round: false,
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | string): void;
  (e: 'change', payload: { value: number | string }): void;
  (e: 'focus', payload: { value: number | string; height: number }): void;
  (e: 'blur', payload: { value: number | string }): void;
}>();

/* ── Value maths ───────────────────────────────────────────────────────── */

const precisionValue = computed(() => {
  const parsed = Number(props.precision);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0;
});

/** Current value as a number (`''` → `NaN` when `allowNull`). */
const numericValue = computed<number>(() => {
  const parsed = Number(props.modelValue);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
});

function round(value: number): number {
  const factor = 10 ** precisionValue.value;
  return Math.round(value * factor) / factor;
}

/** Clamp + snap + round. Pure — used by `commit` and `updateOnInit`. */
function normalize(raw: number): number {
  let next = raw;
  if (next < props.min) next = props.min;
  if (next > props.max) next = props.max;
  if (props.stepStrictly && props.step > 0) {
    const steps = Math.round((next - props.min) / props.step);
    next = props.min + steps * props.step;
    if (next > props.max) next -= props.step;
    if (next < props.min) next = props.min;
  }
  return round(next);
}

function currentOrMin(): number {
  const current = numericValue.value;
  if (Number.isFinite(current)) return current;
  return props.allowNull ? props.min : props.min;
}

/** Can the value move by `direction`? */
function canStep(direction: 1 | -1): boolean {
  if (props.disabled) return false;
  if (direction === 1 && props.disablePlus) return false;
  if (direction === -1 && props.disableMinus) return false;
  const current = numericValue.value;
  if (!Number.isFinite(current)) return true;
  if (direction === 1) return current < props.max;
  return current > props.min;
}

async function commit(next: number | string): Promise<boolean> {
  if (props.disabled) return false;
  let resolved: number | string = next;
  if (next === '' || next === null) {
    if (!props.allowNull) return false;
    resolved = '';
  } else {
    const numeric = Number(next);
    if (!Number.isFinite(numeric)) return false;
    resolved = normalize(numeric);
  }
  if (props.beforeChange) {
    const verdict = await props.beforeChange(resolved);
    if (verdict === false) return false;
  }
  if (resolved === props.modelValue) return false;
  emit('update:modelValue', resolved);
  emit('change', { value: resolved });
  return true;
}

async function stepBy(direction: 1 | -1): Promise<void> {
  if (!canStep(direction)) return;
  const base = Number.isFinite(numericValue.value) ? numericValue.value : props.min;
  await commit(base + direction * props.step);
}

function onMinus(): void {
  void stepBy(-1);
}

function onPlus(): void {
  void stepBy(1);
}

/* ── Field ─────────────────────────────────────────────────────────────── */

const draft = ref<string | null>(null);

/** Text shown in the field — the draft while typing, else the model value. */
const displayValue = computed<string>(() => {
  if (draft.value !== null) return draft.value;
  const current = props.modelValue;
  if (current === '' || current === null || current === undefined) return '';
  return String(current);
});

function onInput(event: Event): void {
  if (props.disabled || props.disableInput) return;
  const target = event.target as HTMLInputElement;
  const raw = target.value;
  draft.value = raw;
  if (!props.immediateChange) return;
  if (raw === '') {
    void commit('');
    return;
  }
  const numeric = Number(raw);
  if (!Number.isFinite(numeric)) return;
  // While typing, keep the in-range value only — a half-typed "12" of "120"
  // must not be clamped up to `min` on the first keystroke.
  if (numeric < props.min || numeric > props.max) return;
  void commit(numeric);
}

function onFieldBlur(event: Event): void {
  const raw = draft.value;
  draft.value = null;
  if (raw !== null) {
    if (raw === '') void commit('');
    else void commit(raw);
  }
  void event;
  emit('blur', { value: props.modelValue });
}

function onFieldFocus(): void {
  emit('focus', { value: props.modelValue, height: 0 });
}

/* ── Long press (AGENTS.md §41 — one timer, always cleared) ────────────── */

let pressTimer: ReturnType<typeof setInterval> | null = null;

function clearPressTimer(): void {
  if (pressTimer !== null) {
    clearInterval(pressTimer);
    pressTimer = null;
  }
}

function onPressStart(direction: 1 | -1): void {
  if (!props.longPress) return;
  clearPressTimer();
  pressTimer = setInterval(() => {
    if (!canStep(direction)) {
      clearPressTimer();
      return;
    }
    void stepBy(direction);
  }, 120);
}

function onPressEnd(): void {
  clearPressTimer();
}

onBeforeUnmount(clearPressTimer);

/* ── Presentation ──────────────────────────────────────────────────────── */

const rootClass = computed(() => [
  'sn-input-number',
  `sn-input-number--${props.theme}`,
  {
    'sn-input-number--disabled': props.disabled,
    'sn-input-number--round': props.round,
    'sn-input-number--without-input': props.withoutInput,
  },
  props.customClass,
]);

const rootStyle = computed(() => props.customStyle || undefined);

const fieldWidthStyle = computed(() => {
  if (props.inputWidth === undefined || props.inputWidth === '') return undefined;
  const width =
    typeof props.inputWidth === 'number' ? `${props.inputWidth * 2}rpx` : props.inputWidth;
  return `width: ${width}`;
});

const minusDisabled = computed(() => !canStep(-1));
const plusDisabled = computed(() => !canStep(1));
const fieldDisabled = computed(() => props.disabled || props.disableInput);

/* Emit the corrected value once on mount (wd-input-number `update-on-init`). */
if (props.updateOnInit) {
  const current = numericValue.value;
  if (Number.isFinite(current)) {
    const fixed = normalize(current);
    if (fixed !== props.modelValue) {
      emit('update:modelValue', fixed);
      emit('change', { value: fixed });
    }
  }
}
</script>

<template>
  <view
    :class="rootClass"
    :style="rootStyle"
    :data-snui-component="'input-number'"
    role="group"
    :aria-disabled="disabled ? 'true' : undefined"
  >
    <view
      :class="[
        'sn-input-number__action',
        'sn-input-number__minus',
        { 'sn-input-number__action--disabled': minusDisabled },
      ]"
      role="button"
      aria-label="decrease"
      :aria-disabled="minusDisabled ? 'true' : undefined"
      :tabindex="minusDisabled ? -1 : 0"
      @tap="onMinus"
      @touchstart="onPressStart(-1)"
      @touchend="onPressEnd"
      @touchcancel="onPressEnd"
    >
      <SnIcon :icon="MinusIcon" :size="24" />
    </view>

    <input
      v-if="!withoutInput"
      class="sn-input-number__field"
      :style="fieldWidthStyle"
      :type="inputType"
      :value="displayValue"
      :placeholder="placeholder"
      :disabled="fieldDisabled"
      :aria-label="placeholder || 'number input'"
      :adjust-position="adjustPosition"
      @input="onInput"
      @focus="onFieldFocus"
      @blur="onFieldBlur"
    />
    <view v-else class="sn-input-number__divider" aria-hidden="true" />

    <view
      :class="[
        'sn-input-number__action',
        'sn-input-number__plus',
        { 'sn-input-number__action--disabled': plusDisabled },
      ]"
      role="button"
      aria-label="increase"
      :aria-disabled="plusDisabled ? 'true' : undefined"
      :tabindex="plusDisabled ? -1 : 0"
      @tap="onPlus"
      @touchstart="onPressStart(1)"
      @touchend="onPressEnd"
      @touchcancel="onPressEnd"
    >
      <SnIcon :icon="PlusIcon" :size="24" />
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). */

.sn-input-number {
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  padding: var(--sn-mp-spacing-1);
  border: 2rpx solid transparent;
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-soft);
  color: var(--sn-mp-color-text-primary);
  font-family: inherit;
}

.sn-input-number__action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56rpx;
  height: 56rpx;
  flex: 0 0 auto;
  border-radius: var(--sn-mp-radius-sm);
  background-color: var(--sn-mp-color-background-elevated);
  color: var(--sn-mp-color-text-secondary);
}

.sn-input-number__action--disabled {
  color: var(--sn-mp-color-text-disabled);
}

.sn-input-number__field {
  width: 72rpx;
  height: 56rpx;
  flex: 0 0 auto;
  box-sizing: border-box;
  border: none;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: var(--sn-mp-font-size-md);
  text-align: center;
  line-height: 56rpx;
}

.sn-input-number__divider {
  width: 2rpx;
  height: 32rpx;
  margin: 0 var(--sn-mp-spacing-2);
  background-color: var(--sn-mp-color-border-subtle);
}

/* ── Themes ─────────────────────────────────────────────────────────────── */

.sn-input-number--outline {
  background-color: transparent;
  border-color: var(--sn-mp-color-border-default);
}

.sn-input-number--outline .sn-input-number__action {
  background-color: transparent;
}

.sn-input-number--outline-split .sn-input-number__action {
  background-color: transparent;
  border: 2rpx solid var(--sn-mp-color-border-default);
}

.sn-input-number--primary {
  background-color: transparent;
}

.sn-input-number--primary .sn-input-number__plus {
  background-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
}

.sn-input-number--primary .sn-input-number__minus {
  background-color: var(--sn-mp-color-action-primary-soft);
  color: var(--sn-mp-color-action-primary);
}

.sn-input-number--round {
  border-radius: var(--sn-mp-radius-full);
}

.sn-input-number--round .sn-input-number__action {
  border-radius: var(--sn-mp-radius-full);
}

.sn-input-number--disabled {
  opacity: 0.6;
}

/* Doodle skin — hand-drawn outline instead of the flat fill. */
.snui-skin-doodle .sn-input-number {
  border-width: 4rpx;
  border-color: var(--sn-mp-color-text-primary);
  border-radius: var(--sn-mp-radius-sm);
  background-color: var(--sn-mp-color-background-elevated);
}

.snui-skin-doodle .sn-input-number__action {
  border-radius: var(--sn-mp-radius-xs);
}
</style>
