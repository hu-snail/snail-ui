<script setup lang="ts">
/**
 * SnCheckbox — web-end checkbox component.
 *
 * Reference library: naive-ui `n-checkbox`
 *   (https://www.naiveui.com/zh-CN/light/components/checkbox)
 * Props + semantics mirror n-checkbox 1:1.
 *
 * 1:1 parity (this version): checked / defaultChecked / modelValue /
 *   label / value / disabled / readonly / indeterminate / size /
 *   checkedValue / uncheckedValue / status / focusable / ariaLabel.
 *
 * Implementation notes:
 *   - Built on a native `<input type="checkbox">` (visually hidden) so
 *     keyboard / screen-reader semantics come for free (AGENTS.md §52).
 *   - When nested in `SnCheckboxGroup`, the child's checked state is
 *     derived from group membership and toggles go through the group.
 *
 * Per AGENTS.md §30/31: props / events / slots / tokens / accessibility
 * declared below; CSS uses `--sn-web-*` token aliases only.
 */

import { computed, inject } from 'vue';
import { SN_CHECKBOX_GROUP_KEY, type SnCheckboxValue } from './sn-checkbox-types';

defineOptions({ name: 'SnCheckbox' });

const props = withDefaults(
  defineProps<{
    /**
     * Bound checked state (`v-model`). For a standalone checkbox this is
     * `checkedValue` / `uncheckedValue`; inside a group the parent group
     * owns the array and this prop is ignored on children.
     */
    modelValue?: SnCheckboxValue | SnCheckboxValue[];
    /** Uncontrolled initial checked state. */
    defaultChecked?: boolean;
    /** Label text rendered next to the box. Use the default slot for rich content. */
    label?: string;
    /**
     * Value this checkbox represents inside a group (`v-model:value` on
     * the group collects these). Mirrors n-checkbox `value`.
     */
    value?: SnCheckboxValue;
    /** Disables interaction. */
    disabled?: boolean;
    /** Read-only — visible but not toggleable. */
    readonly?: boolean;
    /** Half-checked state (parent-of-many pattern). Mirrors n-checkbox `indeterminate`. */
    indeterminate?: boolean;
    /** Visual size preset. Mirrors n-checkbox `size` (adds `mini` per AUI convention). */
    size?: 'mini' | 'tiny' | 'small' | 'medium' | 'large';
    /** Value emitted when checked. Defaults to `true`. Mirrors n-checkbox `checked-value`. */
    checkedValue?: SnCheckboxValue;
    /** Value emitted when unchecked. Defaults to `false`. Mirrors n-checkbox `unchecked-value`. */
    uncheckedValue?: SnCheckboxValue;
    /** Visual status. Drives box color + `aria-invalid`. */
    status?: 'default' | 'error' | 'warning';
    /** Whether the native input participates in tab order. Mirrors n-checkbox `focusable`. */
    focusable?: boolean;
    /** Accessible name when no `label` / slot content is present. */
    ariaLabel?: string;
    /** Class on the root wrapper. */
    customClass?: string;
    /** Inline style on the root wrapper. */
    customStyle?: string | Record<string, string>;
  }>(),
  {
    defaultChecked: false,
    label: '',
    disabled: false,
    readonly: false,
    indeterminate: false,
    size: 'medium',
    checkedValue: true,
    uncheckedValue: false,
    status: 'default',
    focusable: true,
    ariaLabel: '',
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  /** v-model sync (standalone usage). */
  (e: 'update:modelValue', value: SnCheckboxValue): void;
  /** Checked state committed (click / Space). Mirrors n-checkbox `onUpdate:checked`. */
  (e: 'update:checked', checked: boolean): void;
  /** Checked state committed — naive-ui's `checked-change` payload. */
  (e: 'checkedChange', checked: boolean): void;
}>();

defineSlots<{
  /** Rich label content. Wins over the `label` prop. Scope: checked state. */
  default?(props: { checked: boolean; disabled: boolean; indeterminate: boolean }): unknown;
  /** Custom checkmark glyph. Renders inside the box instead of the CSS tick. */
  icon?(props: { checked: boolean }): unknown;
  /**
   * Replace the entire box (indicator) with custom markup — the hook for
   * card-style / tag-style checkboxes. Receives the state so the consumer
   * can render its own selected visuals.
   */
  indicator?(props: { checked: boolean; indeterminate: boolean }): unknown;
}>();

// Injected group context (undefined when standalone).
const checkboxGroup = inject(SN_CHECKBOX_GROUP_KEY, undefined);

const isInGroup = computed(() => checkboxGroup !== undefined);

/** Effective disabled — group disabled ORs with own disabled. */
const isDisabled = computed(() => props.disabled || (checkboxGroup?.groupDisabled.value ?? false));

/** Effective size — group size wins over own size. */
const effectiveSize = computed(() => checkboxGroup?.groupSize.value ?? props.size);

/** Standalone checked state derived from the modelValue prop. */
const standaloneChecked = computed<boolean>(() => {
  if (Array.isArray(props.modelValue)) {
    return props.value !== undefined && props.modelValue.includes(props.value);
  }
  return props.modelValue === props.checkedValue;
});

/** Group checked state — membership in the group's selected values. */
const groupChecked = computed<boolean>(
  () =>
    props.value !== undefined &&
    (checkboxGroup?.selectedValues.value.includes(props.value) ?? false),
);

/** Final checked state. */
const isChecked = computed<boolean>(() =>
  isInGroup.value ? groupChecked.value : standaloneChecked.value,
);

/** Effective indeterminate state — never true while checked (checked wins). */
const isIndeterminate = computed<boolean>(() => Boolean(props.indeterminate) && !isChecked.value);

/** aria-checked tristate per WAI-ARIA 1.1. */
const ariaChecked = computed<'true' | 'false' | 'mixed'>(() => {
  if (props.indeterminate && !isChecked.value) return 'mixed';
  return isChecked.value ? 'true' : 'false';
});

/** Effective aria-disabled. */
const ariaDisabled = computed(() => (isDisabled.value ? 'true' : undefined));

/** aria-invalid mirrors error status. */
const ariaInvalid = computed(() => (props.status === 'error' ? 'true' : undefined));

const classList = computed(() => [
  'sn-checkbox',
  `sn-checkbox--${effectiveSize.value}`,
  {
    'sn-checkbox--checked': isChecked.value,
    'sn-checkbox--indeterminate': props.indeterminate && !isChecked.value,
    'sn-checkbox--disabled': isDisabled.value,
    'sn-checkbox--readonly': props.readonly,
    [`sn-checkbox--status-${props.status}`]: props.status !== 'default',
  },
  props.customClass,
]);

const wrapperStyle = computed(() => {
  if (typeof props.customStyle === 'string') return props.customStyle;
  return Object.entries(props.customStyle ?? {})
    .map(([k, v]) => `${k}:${v}`)
    .join(';');
});

/**
 * Toggle handler. The native checkbox `change` event fires on click AND
 * Space — one code path covers both keyboard and mouse (AGENTS.md §52).
 * The DOM element's checked state is overridden because Vue controls it
 * via :checked; we re-sync after emit so the visual never drifts.
 */
function onChange(event: Event): void {
  const target = event.target as HTMLInputElement;
  const nextChecked = target.checked;
  if (isDisabled.value || props.readonly) {
    // Rejected toggle — roll the DOM back so the visual never drifts
    // from the prop-derived state.
    target.checked = isChecked.value;
    return;
  }
  if (isInGroup.value && props.value !== undefined) {
    checkboxGroup?.toggleValue(props.value, nextChecked);
  } else {
    emit('update:modelValue', nextChecked ? props.checkedValue : props.uncheckedValue);
  }
  emit('update:checked', nextChecked);
  emit('checkedChange', nextChecked);
}
</script>

<template>
  <label
    :class="classList"
    :style="wrapperStyle || undefined"
    :data-snui-component="'checkbox'"
    :data-size="effectiveSize"
    :data-status="status"
    :data-checked="isChecked"
    :data-indeterminate="indeterminate && !isChecked"
  >
    <input
      type="checkbox"
      class="sn-checkbox__input"
      :checked="isChecked"
      :disabled="isDisabled"
      :indeterminate="props.indeterminate && !isChecked"
      :tabindex="focusable ? undefined : -1"
      :aria-label="ariaLabel"
      :aria-checked="ariaChecked"
      :aria-disabled="ariaDisabled"
      :aria-invalid="ariaInvalid"
      :readonly="readonly"
      @change="onChange"
    />
    <span v-if="$slots.indicator" class="sn-checkbox__box sn-checkbox__box--custom" aria-hidden="true">
      <slot
        name="indicator"
        :checked="isChecked"
        :indeterminate="props.indeterminate && !isChecked"
      />
    </span>
    <span v-else class="sn-checkbox__box" aria-hidden="true">
      <span v-if="$slots.icon" class="sn-checkbox__checkmark sn-checkbox__checkmark--custom">
        <slot name="icon" :checked="isChecked" />
      </span>
      <span v-else class="sn-checkbox__checkmark" />
    </span>
    <span v-if="label || $slots.default" class="sn-checkbox__label">
      <slot :checked="isChecked" :disabled="isDisabled" :indeterminate="isIndeterminate">{{
        label
      }}</slot>
    </span>
  </label>
</template>

<style scoped>
.sn-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  position: relative;
  cursor: pointer;
  user-select: none;
  font-family: inherit;
  line-height: 1.4;
  color: var(--sn-web-checkbox-text-color, var(--sn-web-color-text-primary));
}

/* The native input is visually hidden but stays focusable / clickable
 * so keyboard + SR semantics are native. */
.sn-checkbox__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  margin: 0;
  cursor: inherit;
}

/* Box — sized per size preset via tokens. */
.sn-checkbox__box {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: var(--sn-web-checkbox-size, 14px);
  height: var(--sn-web-checkbox-size, 14px);
  border: 1px solid var(--sn-web-checkbox-border-color, var(--sn-web-color-border-default));
  border-radius: var(--sn-web-checkbox-radius, 3px);
  background-color: var(--sn-web-checkbox-bg, var(--sn-web-color-background-surface));
  box-sizing: border-box;
  transition:
    background-color 0.18s ease-out,
    border-color 0.18s ease-out,
    box-shadow 0.18s ease-out;
}

/* Disabled / readonly keep the state colour but drop the halo — the glow
 * signals "live selection", which a locked control cannot offer. */
.sn-checkbox--disabled .sn-checkbox__box,
.sn-checkbox--readonly .sn-checkbox__box {
  box-shadow: none;
}

@media (prefers-reduced-motion: reduce) {
  .sn-checkbox__box,
  .sn-checkbox__checkmark {
    transition: none;
  }
}

/* Sizes */
.sn-checkbox--mini {
  font-size: 11px;
  --sn-web-checkbox-size: 12px;
}
.sn-checkbox--tiny {
  font-size: 12px;
  --sn-web-checkbox-size: 13px;
}
.sn-checkbox--small {
  font-size: 13px;
  --sn-web-checkbox-size: 14px;
}
.sn-checkbox--medium {
  font-size: 14px;
  --sn-web-checkbox-size: 14px;
}
.sn-checkbox--large {
  font-size: 15px;
  --sn-web-checkbox-size: 16px;
}

/* Custom indicator: the slot owns the visuals, so drop the built-in box
 * chrome (border / fill) and let the markup size itself. */
.sn-checkbox__box--custom {
  border: none;
  background: none;
  box-shadow: none;
  width: auto;
  height: auto;
  min-width: var(--sn-web-checkbox-size, 14px);
  min-height: var(--sn-web-checkbox-size, 14px);
}

/* Custom glyph replaces the CSS tick — keep the centring, drop the border
 * trick and let the slotted content scale in on selection. */
.sn-checkbox__checkmark--custom {
  width: auto;
  height: auto;
  border: none;
  margin-top: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform: none;
  opacity: 1;
}

/*
 * Checkmark — drawn with borders (no colour literals). It scales from 0
 * while rotating into place, so ticking reads as a deliberate pop rather
 * than an instant swap. `transform-origin` is centred so the tick grows
 * out of the box centre.
 */
.sn-checkbox__checkmark {
  width: 7px;
  height: 4px;
  border-left: 2px solid var(--sn-web-checkbox-check-color, var(--sn-web-color-text-on-primary));
  border-bottom: 2px solid var(--sn-web-checkbox-check-color, var(--sn-web-color-text-on-primary));
  transform: rotate(-45deg) scale(0);
  transform-origin: center;
  opacity: 0;
  transition:
    transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.12s ease-out;
  margin-top: -2px;
}

/* Indeterminate — a horizontal dash. */
.sn-checkbox--indeterminate .sn-checkbox__checkmark {
  width: 8px;
  height: 0;
  border-left: none;
  border-bottom: 2px solid var(--sn-web-checkbox-check-color, var(--sn-web-color-text-on-primary));
  transform: scale(1);
  opacity: 1;
  margin-top: 0;
}

/*
 * Checked state. The halo is a soft ring drawn from the box shadow: it
 * spreads outwards and fades in with the fill, which is the "light glow"
 * border around a selected checkbox. It is deliberately a shadow (not a
 * border) so it never changes the box's layout size.
 */
.sn-checkbox--checked .sn-checkbox__box {
  background-color: var(--sn-web-checkbox-bg-checked, var(--sn-web-color-action-primary));
  border-color: var(--sn-web-checkbox-border-color-checked, var(--sn-web-color-action-primary));
  box-shadow: 0 0 0 var(--sn-web-checkbox-halo-width, 3px)
    var(--sn-web-checkbox-halo-color, var(--sn-web-color-action-primary-soft));
}

.sn-checkbox--checked .sn-checkbox__checkmark {
  transform: rotate(-45deg) scale(1);
  opacity: 1;
}

.sn-checkbox--indeterminate .sn-checkbox__box {
  background-color: var(--sn-web-checkbox-bg-checked, var(--sn-web-color-action-primary));
  border-color: var(--sn-web-checkbox-border-color-checked, var(--sn-web-color-action-primary));
  box-shadow: 0 0 0 var(--sn-web-checkbox-halo-width, 3px)
    var(--sn-web-checkbox-halo-color, var(--sn-web-color-action-primary-soft));
}
/* Focus ring via :focus-visible on the native input (+ sibling box) */
.sn-checkbox__input:focus-visible + .sn-checkbox__box {
  box-shadow: 0 0 0 3px var(--sn-web-focus-ring, var(--sn-web-color-action-primary-soft));
}

/* Hover */
.sn-checkbox:hover .sn-checkbox__box {
  border-color: var(--sn-web-checkbox-border-color-hover, var(--sn-web-color-action-primary));
}

/* Disabled */
.sn-checkbox--disabled {
  cursor: not-allowed;
}
.sn-checkbox--disabled .sn-checkbox__label {
  color: var(--sn-web-checkbox-text-color-disabled, var(--sn-web-color-text-tertiary));
}
.sn-checkbox--disabled .sn-checkbox__box {
  background-color: var(--sn-web-checkbox-bg-disabled, var(--sn-web-color-background-soft));
  border-color: var(--sn-web-checkbox-border-color-disabled, var(--sn-web-color-border-subtle));
}
.sn-checkbox--disabled.sn-checkbox--checked .sn-checkbox__box,
.sn-checkbox--disabled.sn-checkbox--indeterminate .sn-checkbox__box {
  background-color: var(--sn-web-checkbox-bg-checked-disabled, var(--sn-web-color-border-default));
  border-color: var(--sn-web-checkbox-border-color-disabled, var(--sn-web-color-border-subtle));
}

/* Readonly — looks normal but refuses toggles */
.sn-checkbox--readonly {
  cursor: default;
}

/* Status */
.sn-checkbox--status-error .sn-checkbox__box {
  border-color: var(--sn-web-color-feedback-danger);
}
.sn-checkbox--status-warning .sn-checkbox__box {
  border-color: var(--sn-web-color-feedback-warning);
}

.sn-checkbox__label {
  font-size: inherit;
  color: inherit;
}
</style>
