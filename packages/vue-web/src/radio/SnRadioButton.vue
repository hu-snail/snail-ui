<script setup lang="ts">
/**
 * SnRadioButton — button-style radio (AUI-WEB-RADIO-001).
 *
 * Naive-ui `n-radio-button` 1:1 surface. Same props / context contract as
 * SnRadio (drops the dot + renders as a pill/segmented button). Works
 * standalone or inside SnRadioGroup.
 */
import { computed, inject } from 'vue';
import {
  snRadioGroupInjectionKey,
  type SnRadioSize,
  type SnRadioStatus,
  type SnRadioValue,
} from './sn-radio-types';

defineOptions({ name: 'SnRadioButton' });

const props = withDefaults(
  defineProps<{
    /**
     * The value this radio-button represents — checked when the group's
     * (or own) `modelValue` equals it. naive-ui calls this `value`.
     */
    checkedValue?: SnRadioValue | null;
    /** Standalone bound value. Inside a group the group's modelValue wins. */
    modelValue?: SnRadioValue | null;
    /** Label text rendered inside the button. Slot `label` overrides. */
    label?: string | undefined;
    /** Native radio group name — required for arrow-key nav. Provided by group. */
    name?: string | undefined;
    /** Disables this radio-button. Group-level disabled ORs in. */
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
  /** Fires when this radio's checked state flips to true via user interaction. */
  (e: 'checked', value: SnRadioValue): void;
  /** Native update event. */
  (e: 'update', value: SnRadioValue | null, event: Event): void;
  /** Native focus. */
  (e: 'focus', event: FocusEvent): void;
  /** Native blur. */
  (e: 'blur', event: FocusEvent): void;
}>();

defineSlots<{
  /** Fallback label content — renders when the `label` slot is absent. */
  default?(): unknown;
  /** Custom label content. Renders instead of the `label` prop text. */
  label?(props: { checked: boolean; disabled: boolean }): unknown;
}>();

/** Group context, if mounted inside SnRadioGroup. */
const groupInject = inject(snRadioGroupInjectionKey, null);

const isGrouped = computed(() => groupInject !== null);

/** Effective disabled = own || group. */
const isDisabled = computed(() => props.disabled || (groupInject?.disabled.value ?? false));

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
  'sn-radio-button',
  `sn-radio-button--${effectiveSize.value}`,
  {
    'sn-radio-button--checked': isChecked.value,
    'sn-radio-button--disabled': isDisabled.value,
    'sn-radio-button--readonly': props.readonly,
    'sn-radio-button--in-group': isGrouped.value,
    [`sn-radio-button--status-${effectiveStatus.value}`]: effectiveStatus.value !== 'default',
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
    :data-snui-component="'radio-button'"
    :data-size="effectiveSize"
    :data-status="effectiveStatus"
    :data-checked="isChecked ? 'true' : 'false'"
  >
    <input
      type="radio"
      class="sn-radio-button__native"
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
    <span class="sn-radio-button__label">
      <slot name="label" :checked="isChecked" :disabled="isDisabled"> <slot />{{ label }} </slot>
    </span>
  </label>
</template>

<style scoped>
.sn-radio-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  font-family: inherit;
  line-height: 1;
  padding: 0 var(--sn-web-radio-button-padding-x, 14px);
  box-sizing: border-box;
  user-select: none;
  background-color: var(--sn-web-radio-button-bg, var(--sn-web-color-background-surface));
  color: var(--sn-web-radio-button-text-color, var(--sn-web-color-text-primary));
  border: 1px solid var(--sn-web-radio-button-border-color, var(--sn-web-color-border-default));
  border-radius: var(--sn-web-radio-button-radius, var(--sn-web-radius-md, 6px));
  transition:
    background-color 0.18s ease-out,
    border-color 0.18s ease-out,
    color 0.18s ease-out,
    box-shadow 0.18s ease-out;
}

.sn-radio-button:not(.sn-radio-button--in-group)
  + .sn-radio-button:not(.sn-radio-button--in-group) {
  margin-left: var(--sn-web-radio-button-gap, 8px);
}

/*
 * Inside a button group the segments form one pill: adjacent 1px borders
 * collapse onto a single line via the negative margin, and only the two
 * outer ends keep the radius. The previous rule removed the right radius
 * from the FIRST segment only, so every interior segment kept a rounded
 * right corner — that produced the notched, "un-merged" look plus a
 * doubled divider where two rounded borders met.
 */
.sn-radio-button--in-group + .sn-radio-button--in-group {
  margin-left: -1px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

/* Every segment except the last is interior on its right edge. */
.sn-radio-button--in-group:not(:last-child) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

/* The checked segment must paint above its neighbours, otherwise the
 * neighbour's 1px border (which shares the same pixel column thanks to the
 * -1px overlap) draws a second, grey line over the active divider. */
.sn-radio-button--in-group.sn-radio-button--checked {
  z-index: 1;
}

.sn-radio-button--checked {
  background-color: var(--sn-web-radio-button-bg-active, var(--sn-web-color-action-primary));
  color: var(--sn-web-radio-button-text-color-active, var(--sn-web-color-text-inverse, #ffffff));
  border-color: var(--sn-web-radio-button-border-color-active, var(--sn-web-color-action-primary));
}

.sn-radio-button--disabled {
  cursor: not-allowed;
  color: var(--sn-web-radio-button-text-color-disabled, var(--sn-web-color-text-disabled));
  background-color: var(--sn-web-radio-button-bg-disabled, var(--sn-web-color-background-soft));
  border-color: var(
    --sn-web-radio-button-border-color-disabled,
    var(--sn-web-color-border-default)
  );
}

.sn-radio-button--readonly {
  cursor: default;
}

.sn-radio-button__native:focus-visible ~ .sn-radio-button__label {
  outline: 2px solid var(--sn-web-radio-button-focus-outline, var(--sn-web-color-action-primary));
  outline-offset: 2px;
}

/* The native input is visually hidden but stays focusable. */
.sn-radio-button__native {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  margin: 0;
  pointer-events: none;
}

.sn-radio-button__label {
  display: inline-flex;
  align-items: center;
}

/* Sizes */
.sn-radio-button--mini {
  height: 22px;
  font-size: 11px;
}
.sn-radio-button--tiny {
  height: 24px;
  font-size: 12px;
}
.sn-radio-button--small {
  height: 28px;
  font-size: 13px;
}
.sn-radio-button--medium {
  height: 32px;
  font-size: 14px;
}
.sn-radio-button--large {
  height: 40px;
  font-size: 15px;
}

/* Status */
.sn-radio-button--status-error {
  border-color: var(--sn-web-color-feedback-danger);
}
.sn-radio-button--status-warning {
  border-color: var(--sn-web-color-feedback-warning);
}
</style>
