<script setup lang="ts">
/**
 * sn-input-number (uni-end) — numeric stepper with an editable field.
 *
 * Reference library: wot-ui `wd-input-number` (v2)
 *   (https://wot-ui.cn/component/input-number.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-input-number 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-input-number/sn-input-number.vue
 * → auto-registered as `<sn-input-number>` in any .vue that uses it.
 *
 * ## Visual contract (wd-input-number v2)
 *
 * Three segments joined edge to edge — minus / field / plus — each carrying
 * its own fill and corner radius; the root is transparent and layout-only, so
 * a stretched flex parent can never turn the control into a full-width track.
 * Segment fills live on the segments (not the root) for the same reason.
 *
 *   - `default`       soft fill, 1px reverse-fill dividers between segments
 *   - `outline`       soft fill, outer hairline border, no dividers
 *   - `outline-split` soft fill, short hairline dividers, no outer border
 *   - `primary`       minus = primary hairline outline, plus = primary fill
 *
 * Glyphs are `SnIcon` (not `::before` / `::after`): the uni-app x CSS
 * transform drops pseudo-elements, so drawing the +/- bars in CSS would leave
 * the uvue build with blank buttons.
 *
 * ## Timers (AGENTS.md §41)
 *
 * `longPress` runs one `setInterval` while a button is held. It is cleared on
 * `touchend` / `touchcancel`, on unmount and before every new press, so a
 * half-pressed button can never outlive the component.
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

/** Current value as a number. `''` / `null` (the `allowNull` unset state) → `NaN`. */
const numericValue = computed<number>(() => {
  // `Number('') === 0` would masquerade the unset state as a real 0 and make
  // `updateOnInit` overwrite a deliberate empty with `min` — guard it out.
  if (props.modelValue === '' || props.modelValue === null) return Number.NaN;
  const parsed = Number(props.modelValue);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
});

function round(value: number): number {
  const factor = 10 ** precisionValue.value;
  return Math.round(value * factor) / factor;
}

/** Decimal places of a positive step (`0.1` → 1), used for float-safe maths. */
function stepPrecisionOf(step: number): number {
  const text = String(step);
  const dot = text.indexOf('.');
  return dot === -1 ? 0 : text.length - dot - 1;
}

/**
 * Snap onto the `step` grid anchored at zero — the wd-input-number contract
 * (`step: 2` → …, 4, 6, 8, …), NOT `min + k * step`. Anchoring at `min` would
 * emit values that are not multiples of `step` (min 3 / step 2 → 5).
 */
function snapToStep(value: number, step: number): number {
  const factor = 10 ** stepPrecisionOf(step);
  return (Math.round(value / step) * factor * step) / factor;
}

/** Smallest / largest step multiple that still sits inside `[min, max]`. */
function strictBound(value: number, step: number): number {
  const factor = 10 ** stepPrecisionOf(step);
  if (value < props.min) {
    const minSteps = Math.ceil((props.min * factor) / (step * factor));
    const candidate = (minSteps * step * factor) / factor;
    if (candidate <= props.max) return candidate;
  }
  const maxSteps = Math.floor((props.max * factor) / (step * factor));
  return (maxSteps * step * factor) / factor;
}

/** Clamp + snap + round. Pure — used by `commit`, `canStep` and `updateOnInit`. */
function normalize(raw: number): number {
  if (!props.stepStrictly || props.step <= 0) {
    return round(Math.min(Math.max(raw, props.min), props.max));
  }
  const snapped = snapToStep(raw, props.step);
  const inRange = snapped >= props.min && snapped <= props.max;
  return round(inRange ? snapped : strictBound(snapped, props.step));
}

/** Can the value move by `direction`? Strict mode compares normalized targets. */
function canStep(direction: 1 | -1): boolean {
  if (props.disabled) return false;
  if (direction === 1 && props.disablePlus) return false;
  if (direction === -1 && props.disableMinus) return false;
  const current = numericValue.value;
  if (!Number.isFinite(current)) return true;
  const candidate = normalize(current + direction * props.step);
  return direction === 1 ? candidate > current : candidate < current;
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
  if (consumePressTap()) return;
  void stepBy(-1);
}

function onPlus(): void {
  if (consumePressTap()) return;
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
/**
 * Set once the repeat interval has stepped — the `@tap` that always follows
 * a long-press release must not add one extra step (same trap as the
 * `consumeTap` flag in sn-keyboard-keys).
 */
let pressTicked = false;

/** Consume the trailing tap after a long-press repeat; true = swallow it. */
function consumePressTap(): boolean {
  if (!pressTicked) return false;
  pressTicked = false;
  return true;
}

function clearPressTimer(): void {
  if (pressTimer !== null) {
    clearInterval(pressTimer);
    pressTimer = null;
  }
}

function onPressStart(direction: 1 | -1): void {
  if (!props.longPress) return;
  clearPressTimer();
  pressTicked = false;
  pressTimer = setInterval(() => {
    if (!canStep(direction)) {
      clearPressTimer();
      return;
    }
    pressTicked = true;
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
      <view class="sn-input-number__action-divider" aria-hidden="true" />
      <SnIcon :icon="MinusIcon" size="24rpx" />
    </view>

    <view v-if="!withoutInput" class="sn-input-number__inner">
      <input
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
    </view>

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
      <view class="sn-input-number__action-divider" aria-hidden="true" />
      <SnIcon :icon="PlusIcon" size="24rpx" />
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units).
 *
 * Layout mirrors wot-ui v2 `wd-input-number`: 28px action / 36px field /
 * 28px action at the 750rpx design width → 56 / 72 / 56rpx. The root is
 * transparent and carries no padding; fills and hairline radii live on the
 * three segments, so the control keeps its intrinsic width inside a flex
 * parent that stretches its children. */

.sn-input-number {
  display: inline-flex;
  align-items: center;
  font-family: inherit;
  line-height: 1;
  user-select: none;
}

.sn-input-number__action {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56rpx;
  height: 56rpx;
  flex: 0 0 auto;
  box-sizing: border-box;
  background-color: var(--sn-mp-color-background-soft);
  color: var(--sn-mp-color-text-secondary);
  -webkit-tap-highlight-color: transparent;
}

.sn-input-number__minus {
  border-top-left-radius: var(--sn-mp-radius-sm);
  border-bottom-left-radius: var(--sn-mp-radius-sm);
}

.sn-input-number__plus {
  border-top-right-radius: var(--sn-mp-radius-sm);
  border-bottom-right-radius: var(--sn-mp-radius-sm);
}

/* Inner divider: the 1px reverse-fill gap (default) / short hairline
 * (outline-split) between segments. Rendered as a real node — uvue drops
 * pseudo-elements. */
.sn-input-number__action-divider {
  position: absolute;
  top: 50%;
  width: 2rpx;
  height: 100%;
  transform: translateY(-50%);
  background-color: var(--sn-mp-color-background-elevated);
}

.sn-input-number__minus .sn-input-number__action-divider {
  right: 0;
}

.sn-input-number__plus .sn-input-number__action-divider {
  left: 0;
}

.sn-input-number__inner {
  position: relative;
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  box-sizing: border-box;
  height: 56rpx;
  padding: 0 var(--sn-mp-spacing-3);
  background-color: var(--sn-mp-color-background-soft);
}

.sn-input-number__field {
  width: 72rpx;
  height: 56rpx;
  box-sizing: border-box;
  border: none;
  background: transparent;
  color: var(--sn-mp-color-text-primary);
  font: inherit;
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-medium);
  text-align: center;
  line-height: 56rpx;
}

/* ── Themes ─────────────────────────────────────────────────────────────── */

/* outline: one continuous hairline box around the three segments. */
.sn-input-number--outline .sn-input-number__action {
  border: 2rpx solid var(--sn-mp-color-border-default);
}

.sn-input-number--outline .sn-input-number__inner {
  border-top: 2rpx solid var(--sn-mp-color-border-default);
  border-bottom: 2rpx solid var(--sn-mp-color-border-default);
}

.sn-input-number--outline .sn-input-number__action-divider {
  display: none;
}

/* without-input: adjacent actions share one hairline instead of doubled. */
.sn-input-number--without-input.sn-input-number--outline .sn-input-number__plus {
  border-left: none;
}

/* outline-split: short hairline dividers, no outer box. */
.sn-input-number--outline-split .sn-input-number__action-divider {
  height: 36rpx;
  background-color: var(--sn-mp-color-border-default);
}

/* primary: outlined minus + filled plus. */
.sn-input-number--primary .sn-input-number__action-divider {
  display: none;
}

.sn-input-number--primary .sn-input-number__minus {
  background-color: transparent;
  border: 2rpx solid currentColor;
  color: var(--sn-mp-color-action-primary);
}

.sn-input-number--primary .sn-input-number__plus {
  background-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
}

/* ── Disabled ───────────────────────────────────────────────────────────── */

.sn-input-number__action--disabled {
  color: var(--sn-mp-color-text-disabled);
}

/* Primary keeps its hue and dims instead (wot-ui `disabled-opacity`). */
.sn-input-number--primary .sn-input-number__action--disabled {
  opacity: 0.4;
}

/* ── Round ──────────────────────────────────────────────────────────────── */

.sn-input-number--round .sn-input-number__minus {
  border-top-left-radius: var(--sn-mp-radius-full);
  border-bottom-left-radius: var(--sn-mp-radius-full);
}

.sn-input-number--round .sn-input-number__plus {
  border-top-right-radius: var(--sn-mp-radius-full);
  border-bottom-right-radius: var(--sn-mp-radius-full);
}

/* ── Doodle skin ────────────────────────────────────────────────────────── */

/* Hand-drawn outline instead of the flat fill. */
.snui-skin-doodle .sn-input-number__action,
.snui-skin-doodle .sn-input-number__inner {
  border-top: 4rpx solid var(--sn-mp-color-text-primary);
  border-bottom: 4rpx solid var(--sn-mp-color-text-primary);
  background-color: var(--sn-mp-color-background-elevated);
}

.snui-skin-doodle .sn-input-number__minus {
  border-left: 4rpx solid var(--sn-mp-color-text-primary);
}

.snui-skin-doodle .sn-input-number__plus {
  border-right: 4rpx solid var(--sn-mp-color-text-primary);
}

.snui-skin-doodle .sn-input-number__action-divider {
  background-color: var(--sn-mp-color-text-primary);
}
</style>
