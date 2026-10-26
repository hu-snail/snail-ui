<script setup lang="ts">
/**
 * SnRadio — web-end radio component (AUI-WEB-RADIO-001).
 *
 * Naive-ui `n-radio` 1:1 surface: `checked-value` (naive's `value`) +
 * `label` + group-driven context. Uses a native `<input type="radio">`
 * so browser keyboard navigation (arrow keys) and ARIA semantics come
 * for free — matching the task's "native radio" mandate.
 *
 * Per AGENTS.md §30/31: props / events / slots / tokens declared via
 * `defineProps` + `defineEmits` + `defineSlots` + CSS variables.
 */
import { computed, inject } from 'vue';
import {
  snRadioGroupInjectionKey,
  type SnRadioSize,
  type SnRadioStatus,
  type SnRadioValue,
} from './sn-radio-types';

defineOptions({ name: 'SnRadio' });

const props = withDefaults(
  defineProps<{
    /**
     * The value this radio represents — when the group's (or own)
     * `modelValue` equals it, this radio is checked. naive-ui calls
     * this `value`.
     */
    checkedValue?: SnRadioValue | null;
    /**
     * Standalone bound value. Inside a group the group's modelValue wins.
     */
    modelValue?: SnRadioValue | null;
    /** Label text rendered next to the dot. Slot `label` overrides. */
    label?: string | undefined;
    /** Native radio group name — required for arrow-key nav. Provided by group. */
    name?: string | undefined;
    /** Disables this radio. Group-level disabled ORs in. */
    disabled?: boolean;
    /** Read-only — renders but ignores activation. */
    readonly?: boolean;
    /** Visual size preset. Falls back to group size then 'medium'. */
    size?: SnRadioSize;
    /** Visual status. Falls back to group status then 'default'. */
    status?: SnRadioStatus;
    /** Native ARIA label (overrides label for the accessible name). */
    ariaLabel?: string | undefined;
    /** Class on the root wrapper. */
    customClass?: string;
    /** Inline style on the root wrapper. */
    customStyle?: string | Record<string, string>;
  }>(),
  {
    checkedValue: null,
    modelValue: null,
    label: '',
    disabled: false,
    readonly: false,
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  /** v-model sync — emits this radio's `checkedValue` on activation. */
  (e: 'update:modelValue', value: SnRadioValue | null): void;
  /** Fired on user activation (native change). */
  (e: 'change', value: SnRadioValue, event: Event): void;
  /** Fires when the radio's checked state flips to true via user interaction. */
  (e: 'checked', value: SnRadioValue): void;
  /** Native update event — every state change. */
  (e: 'update', value: SnRadioValue | null, event: Event): void;
  /** Native focus. */
  (e: 'focus', event: FocusEvent): void;
  /** Native blur. */
  (e: 'blur', event: FocusEvent): void;
}>();

defineSlots<{
  /** Custom label content. Renders instead of the `label` prop text. */
  label?(props: { checked: boolean; disabled: boolean }): unknown;
}>();

/** Group context, if mounted inside SnRadioGroup. */
const groupInject = inject(snRadioGroupInjectionKey, null);

const isGrouped = computed(() => groupInject !== null);

/** Effective disabled = own || group. */
const isDisabled = computed(() => props.disabled || (groupInject?.disabled.value ?? false));

/** Effective interactive — readonly blocks activation without dimming semantics. */
const isReadonly = computed(() => props.readonly);

/** Checked = effective modelValue strictly equals checkedValue. */
const isChecked = computed(() => {
  const bound = isGrouped.value ? groupInject!.modelValue.value : props.modelValue;
  return bound !== null && bound === props.checkedValue;
});

/** Shared native name — group-provided name wins. */
const effectiveName = computed(
  () => (isGrouped.value ? groupInject!.name.value : undefined) ?? props.name ?? undefined,
);

const effectiveSize = computed<SnRadioSize>(
  () => props.size ?? groupInject?.size.value ?? 'medium',
);

const effectiveStatus = computed<SnRadioStatus>(
  () => props.status ?? groupInject?.status.value ?? 'default',
);

const ariaInvalid = computed(() => (effectiveStatus.value === 'error' ? 'true' : undefined));

const classList = computed(() => [
  'sn-radio',
  `sn-radio--${effectiveSize.value}`,
  {
    'sn-radio--checked': isChecked.value,
    'sn-radio--disabled': isDisabled.value,
    'sn-radio--readonly': isReadonly.value,
    'sn-radio--in-group': isGrouped.value,
    [`sn-radio--status-${effectiveStatus.value}`]: effectiveStatus.value !== 'default',
  },
  props.customClass,
]);

const wrapperStyle = computed(() => {
  if (typeof props.customStyle === 'string') return props.customStyle;
  return Object.entries(props.customStyle ?? {})
    .map(([k, v]) => `${k}:${v}`)
    .join(';');
});

function onChange(event: Event): void {
  const target = event.target as HTMLInputElement;
  const checked = props.checkedValue;
  if (target.checked && checked !== null) {
    emit('update:modelValue', checked);
    emit('update', checked, event);
    emit('checked', checked);
    emit('change', checked, event);
    if (isGrouped.value) groupInject!.onChange(checked);
  }
}

function onFocus(event: FocusEvent): void {
  emit('focus', event);
}

function onBlur(event: FocusEvent): void {
  emit('blur', event);
}
</script>

<template>
  <label
    :class="classList"
    :style="wrapperStyle || undefined"
    :data-snui-component="'radio'"
    :data-size="effectiveSize"
    :data-status="effectiveStatus"
    :data-checked="isChecked ? 'true' : 'false'"
  >
    <input
      type="radio"
      class="sn-radio__native"
      :checked="isChecked"
      :name="effectiveName"
      :value="String(checkedValue)"
      :disabled="isDisabled"
      :aria-label="ariaLabel ?? (label || undefined)"
      :aria-invalid="ariaInvalid"
      :aria-disabled="isDisabled ? 'true' : undefined"
      :aria-checked="isChecked ? 'true' : 'false'"
      @change="onChange"
      @focus="onFocus"
      @blur="onBlur"
    />
    <span class="sn-radio__dot" aria-hidden="true" />
    <span v-if="$slots.label || label" class="sn-radio__label">
      <slot name="label" :checked="isChecked" :disabled="isDisabled">{{ label }}</slot>
    </span>
  </label>
</template>

<style scoped>
.sn-radio {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  position: relative;
  cursor: pointer;
  font-family: inherit;
  line-height: 1.4;
  color: var(--sn-web-radio-text-color, var(--sn-web-color-text-primary));
  box-sizing: border-box;
  user-select: none;
}

.sn-radio--disabled {
  cursor: not-allowed;
  color: var(--sn-web-radio-text-color-disabled, var(--sn-web-color-text-disabled));
}

.sn-radio--readonly {
  cursor: default;
}

/* The native input is visually hidden but stays focusable — the custom
 * dot paints the state. */
.sn-radio__native {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  margin: 0;
  pointer-events: none;
}

/* Custom dot */
.sn-radio__dot {
  position: relative;
  box-sizing: border-box;
  border-radius: var(--sn-web-radio-radius, 999px);
  border: 1px solid var(--sn-web-radio-border-color, var(--sn-web-color-border-default));
  background-color: var(--sn-web-radio-bg, var(--sn-web-color-background-surface));
  transition:
    border-color 0.18s ease-out,
    box-shadow 0.18s ease-out,
    background-color 0.18s ease-out;
  flex-shrink: 0;
}

.sn-radio__dot::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background-color: var(--sn-web-radio-dot-color, var(--sn-web-color-action-primary));
  transform: scale(0);
  transition: transform 0.18s ease-out;
}

.sn-radio--checked .sn-radio__dot {
  border-color: var(--sn-web-radio-border-color-active, var(--sn-web-color-action-primary));
}

.sn-radio--checked .sn-radio__dot::after {
  transform: scale(0.45);
}

.sn-radio--disabled .sn-radio__dot {
  border-color: var(--sn-web-radio-border-color-disabled, var(--sn-web-color-border-default));
  background-color: var(--sn-web-radio-bg-disabled, var(--sn-web-color-background-soft));
}

.sn-radio--disabled.sn-radio--checked .sn-radio__dot::after {
  background-color: var(--sn-web-radio-dot-color-disabled, var(--sn-web-color-text-disabled));
}

.sn-radio__native:focus-visible ~ .sn-radio__dot {
  box-shadow: 0 0 0 3px var(--sn-web-focus-ring, rgba(22, 119, 255, 0.15));
  border-color: var(--sn-web-radio-border-color-focus, var(--sn-web-color-action-primary));
}

/* Sizes */
.sn-radio--mini {
  font-size: 11px;
}
.sn-radio--mini .sn-radio__dot {
  width: 12px;
  height: 12px;
}

.sn-radio--tiny {
  font-size: 12px;
}
.sn-radio--tiny .sn-radio__dot {
  width: 14px;
  height: 14px;
}

.sn-radio--small {
  font-size: 13px;
}
.sn-radio--small .sn-radio__dot {
  width: 14px;
  height: 14px;
}

.sn-radio--medium {
  font-size: 14px;
}
.sn-radio--medium .sn-radio__dot {
  width: 16px;
  height: 16px;
}

.sn-radio--large {
  font-size: 15px;
}
.sn-radio--large .sn-radio__dot {
  width: 18px;
  height: 18px;
}

/* Status */
.sn-radio--status-error .sn-radio__dot {
  border-color: var(--sn-web-color-feedback-danger);
}
.sn-radio--status-warning .sn-radio__dot {
  border-color: var(--sn-web-color-feedback-warning);
}

.sn-radio__label {
  display: inline-flex;
  align-items: center;
}
</style>
