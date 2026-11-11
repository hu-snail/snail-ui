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
import {
  SN_CHECKBOX_GROUP_KEY,
  type SnCheckboxCheckedStyle,
  type SnCheckboxIndicatorPlacement,
  type SnCheckboxLabelPlacement,
  type SnCheckboxMarkerShape,
  type SnCheckboxValue,
  type SnCheckboxVariant,
} from './sn-checkbox-types';

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
    /**
     * Layout variant (AUI additive): `default` inline marker + label,
     * `card` selectable card (`#card` slot for content), `icon` square tile.
     */
    variant?: SnCheckboxVariant | undefined;
    /**
     * Where the marker sits (AUI additive). `leading` / `trailing` inline,
     * `top-right` / `bottom-right` corner tick, `none` hides it.
     */
    indicatorPlacement?: SnCheckboxIndicatorPlacement | undefined;
    /**
     * Which checked paint to apply (AUI additive): themed border, soft fill,
     * or both. `card` / `icon` variants default to `border-fill`.
     */
    checkedStyle?: SnCheckboxCheckedStyle | undefined;
    /**
     * Which side the label sits on (AUI additive). `marker-first` is the
     * historical order; `label-first` renders the label first and pushes the
     * box to the far end ("标题在前、选择在后").
     */
    labelPlacement?: SnCheckboxLabelPlacement | undefined;
    /**
     * Inline marker shape (AUI additive). `ring` is the outlined box;
     * `inverted` fills the box with the theme colour and punches the tick
     * out in the surface colour (反转态).
     */
    markerShape?: SnCheckboxMarkerShape | undefined;
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
    variant: undefined,
    indicatorPlacement: undefined,
    checkedStyle: undefined,
    labelPlacement: undefined,
    markerShape: undefined,
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
  /**
   * Custom card body (AUI additive). Replaces the default marker + label
   * inside `variant="card"`; the corner tick still follows
   * `indicatorPlacement`.
   */
  card?(props: { checked: boolean; disabled: boolean }): unknown;
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

/* ── AUI additive: variant / indicator placement / checked paint ─────────── */

/** Effective variant — own prop wins, then the group, then `default`. */
const effectiveVariant = computed<SnCheckboxVariant>(
  () => props.variant ?? checkboxGroup?.groupVariant.value ?? 'default',
);

/**
 * Effective indicator placement. Own prop wins, then the group, then a
 * variant-derived default: card / icon tiles put the tick in the corner,
 * everything else keeps the historical leading box.
 */
const effectiveIndicatorPlacement = computed<SnCheckboxIndicatorPlacement>(() => {
  const explicit = props.indicatorPlacement ?? checkboxGroup?.groupIndicatorPlacement.value;
  if (explicit !== undefined) return explicit;
  return effectiveVariant.value === 'default' ? 'leading' : 'top-right';
});

/** Effective checked paint — card / icon tiles default to border + fill. */
const effectiveCheckedStyle = computed<SnCheckboxCheckedStyle>(() => {
  const explicit = props.checkedStyle ?? checkboxGroup?.groupCheckedStyle.value;
  if (explicit !== undefined) return explicit;
  return effectiveVariant.value === 'default' ? 'default' : 'border-fill';
});

/** Effective label side — label-first pushes the box to the far end. */
const effectiveLabelPlacement = computed<SnCheckboxLabelPlacement>(
  () => props.labelPlacement ?? checkboxGroup?.groupLabelPlacement.value ?? 'marker-first',
);

/** Effective inline marker shape (ring vs inverted fill). */
const effectiveMarkerShape = computed<SnCheckboxMarkerShape>(
  () => props.markerShape ?? checkboxGroup?.groupMarkerShape.value ?? 'ring',
);

/** Corner tick (absolute) vs inline box. */
const isCornerIndicator = computed(
  () =>
    effectiveIndicatorPlacement.value === 'top-right' ||
    effectiveIndicatorPlacement.value === 'bottom-right',
);

/** Whether the inline box renders at all. */
const showInlineIndicator = computed(
  () =>
    effectiveIndicatorPlacement.value === 'leading' ||
    effectiveIndicatorPlacement.value === 'trailing',
);

const classList = computed(() => [
  'sn-checkbox',
  `sn-checkbox--${effectiveSize.value}`,
  `sn-checkbox--variant-${effectiveVariant.value}`,
  `sn-checkbox--indicator-${effectiveIndicatorPlacement.value}`,
  `sn-checkbox--label-${effectiveLabelPlacement.value}`,
  `sn-checkbox--marker-${effectiveMarkerShape.value}`,
  {
    'sn-checkbox--checked': isChecked.value,
    'sn-checkbox--indeterminate': props.indeterminate && !isChecked.value,
    'sn-checkbox--disabled': isDisabled.value,
    'sn-checkbox--readonly': props.readonly,
    [`sn-checkbox--status-${props.status}`]: props.status !== 'default',
    'sn-checkbox--checked-border':
      isChecked.value &&
      (effectiveCheckedStyle.value === 'border' || effectiveCheckedStyle.value === 'border-fill'),
    'sn-checkbox--checked-fill':
      isChecked.value &&
      (effectiveCheckedStyle.value === 'fill' || effectiveCheckedStyle.value === 'border-fill'),
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
    <!-- Inline box: leading / trailing only. -->
    <template v-if="showInlineIndicator">
      <span
        v-if="$slots.indicator"
        class="sn-checkbox__box sn-checkbox__box--custom"
        aria-hidden="true"
      >
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
    </template>

    <!-- Card body: custom content wins; icon tile renders the glyph only. -->
    <span v-if="effectiveVariant === 'card' && $slots.card" class="sn-checkbox__card">
      <slot name="card" :checked="isChecked" :disabled="isDisabled" />
    </span>
    <span v-else-if="effectiveVariant === 'icon'" class="sn-checkbox__tile">
      <slot name="icon" :checked="isChecked">
        <span class="sn-checkbox__tile-glyph" aria-hidden="true" />
      </slot>
    </span>
    <span
      v-if="effectiveVariant !== 'icon' && (label || $slots.default)"
      class="sn-checkbox__label"
    >
      <slot :checked="isChecked" :disabled="isDisabled" :indeterminate="isIndeterminate">{{
        label
      }}</slot>
    </span>

    <!-- Corner tick: top-right / bottom-right, only while checked. -->
    <span
      v-if="isCornerIndicator && isChecked"
      class="sn-checkbox__tick"
      :class="`sn-checkbox__tick--${effectiveIndicatorPlacement}`"
      aria-hidden="true"
    />
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

/* ── AUI additive: card / icon variants + checked paint + corner tick ────── */

/* Card: the whole row becomes a selectable surface. */
.sn-checkbox--variant-card {
  display: flex;
  align-items: stretch;
  gap: 0;
  padding: var(--sn-web-spacing-sm, 12px) var(--sn-web-spacing-md, 16px);
  border: 1px solid var(--sn-web-color-border-subtle);
  border-radius: var(--sn-web-radius-md, 8px);
  background-color: var(--sn-web-color-background-surface);
  transition:
    border-color 0.18s ease-out,
    background-color 0.18s ease-out;
}

/* Reserve the corner the tick occupies so it never overlaps the card copy. */
.sn-checkbox--variant-card.sn-checkbox--indicator-top-right,
.sn-checkbox--variant-icon.sn-checkbox--indicator-top-right {
  padding-top: calc(var(--sn-web-spacing-sm, 12px) + 14px);
  padding-right: calc(var(--sn-web-spacing-md, 16px) + 14px);
}
.sn-checkbox--variant-card.sn-checkbox--indicator-bottom-right,
.sn-checkbox--variant-icon.sn-checkbox--indicator-bottom-right {
  padding-right: calc(var(--sn-web-spacing-md, 16px) + 14px);
  padding-bottom: calc(var(--sn-web-spacing-sm, 12px) + 14px);
}

.sn-checkbox--variant-card .sn-checkbox__card {
  display: flex;
  flex: 1 1 auto;
  min-width: 0;
  flex-direction: column;
}

/* Icon tile: square, centred glyph, no label row. */
.sn-checkbox--variant-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  padding: 0;
  border: 1px solid var(--sn-web-color-border-subtle);
  border-radius: var(--sn-web-radius-md, 8px);
  background-color: var(--sn-web-color-background-surface);
  transition:
    border-color 0.18s ease-out,
    background-color 0.18s ease-out;
}

.sn-checkbox--variant-icon .sn-checkbox__tile {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--sn-web-color-text-secondary);
}

.sn-checkbox--variant-icon.sn-checkbox--checked .sn-checkbox__tile {
  color: var(--sn-web-color-action-primary);
}

.sn-checkbox__tile-glyph {
  width: 20px;
  height: 20px;
  border-radius: var(--sn-web-radius-sm, 4px);
  background-color: currentColor;
  opacity: 0.55;
}

/* Checked paint switches (only applied while checked — see classList). */
.sn-checkbox--checked-border.sn-checkbox--variant-card,
.sn-checkbox--checked-border.sn-checkbox--variant-icon {
  border-color: var(--sn-web-color-action-primary);
}

.sn-checkbox--checked-fill.sn-checkbox--variant-card,
.sn-checkbox--checked-fill.sn-checkbox--variant-icon {
  background-color: var(--sn-web-color-action-primary-soft);
}

/* Corner tick — a themed circle with a white check, absolutely placed. */
.sn-checkbox__tick {
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background-color: var(--sn-web-color-action-primary);
  box-shadow: 0 0 0 2px var(--sn-web-color-background-surface);
  pointer-events: none;
}

.sn-checkbox__tick::after {
  content: '';
  width: 7px;
  height: 4px;
  margin-top: -2px;
  border-bottom: 2px solid var(--sn-web-color-text-on-primary, #fff);
  border-left: 2px solid var(--sn-web-color-text-on-primary, #fff);
  transform: rotate(-45deg);
}

.sn-checkbox__tick--top-right {
  top: 6px;
  right: 6px;
}

.sn-checkbox__tick--bottom-right {
  right: 6px;
  bottom: 6px;
}

.sn-checkbox--disabled.sn-checkbox--variant-card,
.sn-checkbox--disabled.sn-checkbox--variant-icon {
  cursor: not-allowed;
  opacity: 0.6;
}

/* Label-first: keep DOM order (native input + a11y unchanged) and only
 * re-order the flex children — the label leads, the box trails. */
.sn-checkbox--label-first .sn-checkbox__label {
  order: 0;
  flex: 1 1 auto;
  min-width: 0;
}
.sn-checkbox--label-first .sn-checkbox__box {
  order: 1;
  margin-left: auto;
}
.sn-checkbox--label-first .sn-checkbox__card {
  order: 0;
  flex: 1 1 auto;
}

/* Inverted marker — the mirror image of the default: the box keeps the
 * surface fill while the tick and border carry the theme colour (反转态). */
.sn-checkbox--marker-inverted.sn-checkbox--checked .sn-checkbox__box {
  border-color: var(--sn-web-color-action-primary);
  background-color: var(--sn-web-color-background-surface);
  box-shadow: none;
}
.sn-checkbox--marker-inverted.sn-checkbox--checked .sn-checkbox__checkmark {
  border-color: var(--sn-web-color-action-primary);
}
.sn-checkbox--marker-inverted.sn-checkbox--checked .sn-checkbox__label {
  color: var(--sn-web-color-action-primary);
}
</style>
