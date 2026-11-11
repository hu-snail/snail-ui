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
  type SnChoiceCheckedStyle,
  type SnChoiceIndicatorPlacement,
  type SnChoiceLabelPlacement,
  type SnChoiceMarkerShape,
  type SnChoiceVariant,
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
    /**
     * Layout variant (AUI additive): `default` inline marker + label,
     * `card` selectable card (`#card` slot for content), `icon` square
     * icon tile. Falls back to the group's variant.
     */
    variant?: SnChoiceVariant | undefined;
    /**
     * Where the marker sits (AUI additive). `leading` / `trailing` inline,
     * `top-right` / `bottom-right` corner tick, `none` hides it.
     * `card` / `icon` variants default to `top-right`.
     */
    indicatorPlacement?: SnChoiceIndicatorPlacement | undefined;
    /**
     * Which checked paint to apply (AUI additive): themed border, soft fill,
     * or both. `card` / `icon` variants default to `border-fill`.
     */
    checkedStyle?: SnChoiceCheckedStyle | undefined;
    /**
     * Which side the label sits on (AUI additive). `marker-first` is the
     * historical order; `label-first` renders the label first and pushes the
     * marker to the far end ("标题在前、选择在后").
     */
    labelPlacement?: SnChoiceLabelPlacement | undefined;
    /**
     * Inline marker shape (AUI additive). `ring` is the outlined circle;
     * `inverted` fills the circle with the theme colour and punches out a
     * surface-coloured inner dot (反转态).
     */
    markerShape?: SnChoiceMarkerShape | undefined;
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
  /** Fallback label content — renders when the `label` slot is absent. */
  default?(): unknown;
  /** Custom label content. Renders instead of the `label` prop text. */
  label?(props: { checked: boolean; disabled: boolean }): unknown;
  /**
   * Custom card body (AUI additive). Replaces the default marker + label
   * inside `variant="card"`; the corner tick still follows
   * `indicatorPlacement`.
   */
  card?(props: { checked: boolean; disabled: boolean }): unknown;
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

/* ── AUI additive: variant / indicator placement / checked paint ─────────── */

/** Effective variant — own prop wins, then the group, then `default`. */
const effectiveVariant = computed<SnChoiceVariant>(
  () => props.variant ?? groupInject?.variant.value ?? 'default',
);

/**
 * Effective indicator placement. Own prop wins, then the group, then a
 * variant-derived default: card / icon tiles put the tick in the corner,
 * everything else keeps the historical leading marker.
 */
const effectiveIndicatorPlacement = computed<SnChoiceIndicatorPlacement>(() => {
  const explicit = props.indicatorPlacement ?? groupInject?.indicatorPlacement.value;
  if (explicit !== undefined) return explicit;
  return effectiveVariant.value === 'default' ? 'leading' : 'top-right';
});

/** Effective checked paint — card / icon tiles default to border + fill. */
const effectiveCheckedStyle = computed<SnChoiceCheckedStyle>(() => {
  const explicit = props.checkedStyle ?? groupInject?.checkedStyle.value;
  if (explicit !== undefined) return explicit;
  return effectiveVariant.value === 'default' ? 'default' : 'border-fill';
});

/** Effective label side — label-first pushes the marker to the far end. */
const effectiveLabelPlacement = computed<SnChoiceLabelPlacement>(
  () => props.labelPlacement ?? groupInject?.labelPlacement.value ?? 'marker-first',
);

/** Effective inline marker shape (ring vs inverted fill). */
const effectiveMarkerShape = computed<SnChoiceMarkerShape>(
  () => props.markerShape ?? groupInject?.markerShape.value ?? 'base',
);

/** Corner tick (absolute) vs inline marker. */
const isCornerIndicator = computed(
  () =>
    effectiveIndicatorPlacement.value === 'top-right' ||
    effectiveIndicatorPlacement.value === 'bottom-right',
);

/** Whether the inline marker renders at all. */
const showInlineMarker = computed(
  () =>
    effectiveIndicatorPlacement.value === 'leading' ||
    effectiveIndicatorPlacement.value === 'trailing',
);

const classList = computed(() => [
  'sn-radio',
  `sn-radio--${effectiveSize.value}`,
  `sn-radio--variant-${effectiveVariant.value}`,
  `sn-radio--indicator-${effectiveIndicatorPlacement.value}`,
  `sn-radio--label-${effectiveLabelPlacement.value}`,
  `sn-radio--marker-${effectiveMarkerShape.value}`,
  {
    'sn-radio--checked': isChecked.value,
    'sn-radio--disabled': isDisabled.value,
    'sn-radio--readonly': isReadonly.value,
    'sn-radio--in-group': isGrouped.value,
    [`sn-radio--status-${effectiveStatus.value}`]: effectiveStatus.value !== 'default',
    // Checked paint only applies while checked — keeps unselected cards clean.
    'sn-radio--checked-border':
      isChecked.value &&
      (effectiveCheckedStyle.value === 'border' || effectiveCheckedStyle.value === 'border-fill'),
    'sn-radio--checked-fill':
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
    <!-- Inline marker: leading / trailing only. -->
    <span
      v-if="showInlineMarker && effectiveIndicatorPlacement === 'leading'"
      class="sn-radio__dot"
      aria-hidden="true"
    />

    <!-- Card body: custom content wins; otherwise the historical label row. -->
    <span v-if="effectiveVariant === 'card' && $slots.card" class="sn-radio__card">
      <slot name="card" :checked="isChecked" :disabled="isDisabled" />
    </span>
    <span v-if="$slots.label || $slots.default || label" class="sn-radio__label">
      <slot name="label" :checked="isChecked" :disabled="isDisabled"> <slot />{{ label }} </slot>
    </span>

    <span
      v-if="showInlineMarker && effectiveIndicatorPlacement === 'trailing'"
      class="sn-radio__dot"
      aria-hidden="true"
    />

    <!-- Corner tick: top-right / bottom-right, only while checked. -->
    <span
      v-if="isCornerIndicator && isChecked"
      class="sn-radio__tick"
      :class="`sn-radio__tick--${effectiveIndicatorPlacement}`"
      aria-hidden="true"
    />
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
  box-shadow: 0 0 0 3px
    var(
      --sn-web-focus-ring,
      color-mix(in srgb, var(--sn-web-color-action-primary) 15%, transparent)
    );
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

/* ── AUI additive: card / icon variants + checked paint + corner tick ────── */

/* Card: the whole row becomes a selectable surface. */
.sn-radio--variant-card {
  display: flex;
  /* `stretch` collapsed the card to its text height and let the absolutely
   * positioned tick escape the padding box; `position: relative` is the tick's
   * containing block, and `flex-start` keeps the body top-aligned. */
  position: relative;
  align-items: flex-start;
  gap: 0;
  padding: var(--sn-web-spacing-sm, 12px) var(--sn-web-spacing-md, 16px);
  border: 1px solid var(--sn-web-color-border-subtle);
  border-radius: var(--sn-web-radius-md, 8px);
  background-color: var(--sn-web-color-background-surface);
  /* Cards are block-level surfaces: without an explicit width the inline-flex
   * default made them shrink to content and overflow their own padding. */
  box-sizing: border-box;
  min-width: 0;
  transition:
    border-color 0.18s ease-out,
    background-color 0.18s ease-out;
}

/* Reserve the corner the tick occupies so it never overlaps the card copy
 * (24px fold + 8px breathing room). */
.sn-radio--variant-card.sn-radio--indicator-top-right {
  padding-top: calc(var(--sn-web-spacing-sm, 12px) + 16px);
  padding-right: calc(var(--sn-web-spacing-md, 16px) + 16px);
}
.sn-radio--variant-card.sn-radio--indicator-bottom-right {
  padding-right: calc(var(--sn-web-spacing-md, 16px) + 16px);
  padding-bottom: calc(var(--sn-web-spacing-sm, 12px) + 16px);
}

.sn-radio--variant-card .sn-radio__card {
  display: flex;
  flex: 1 1 auto;
  min-width: 0;
  flex-direction: column;
  /* The slot renders block content (title / price / description); the base
   * label rule is inline-flex + centre, which collapsed multi-line card copy
   * onto one line. Card bodies stack and wrap instead. */
  gap: 2px;
  white-space: normal;
  word-break: break-word;
}

/* Inside a card the label participates in the column flow, not as an inline
 * chip — otherwise `align-items: center` squeezes every child to one row. */
.sn-radio--variant-card .sn-radio__label {
  display: block;
  align-items: initial;
  flex: 1 1 auto;
  min-width: 0;
  white-space: normal;
}

/* Checked paint switches (only applied while checked — see classList). */
.sn-radio--checked-border.sn-radio--variant-card {
  border-color: var(--sn-web-color-action-primary);
}

.sn-radio--checked-fill.sn-radio--variant-card {
  background-color: var(--sn-web-color-action-primary-soft);
}

/* Label-first: keep DOM order (native input + a11y unchanged) and only
 * re-order the flex children — the label leads, the marker trails. */
/* label-first needs the row to span its container — an inline-flex box
 * shrink-to-fits, so `margin-left: auto` had nothing to push against and the
 * marker stayed glued to the label. Widen the row and let the label absorb
 * the free space. */
.sn-radio--label-label-first {
  display: flex;
  width: 100%;
}
.sn-radio--label-label-first .sn-radio__label {
  order: 0;
  display: block;
  flex: 1 1 auto;
  min-width: 0;
  white-space: normal;
}
.sn-radio--label-label-first .sn-radio__dot {
  order: 1;
  margin-left: auto;
  flex-shrink: 0;
}
.sn-radio--label-label-first .sn-radio__card {
  order: 0;
  flex: 1 1 auto;
}

/* Inverted marker: the whole circle is a theme-coloured plate and the inner
 * dot is punched out in the surface colour (the "反转" look). The card tick
 * keeps its own white glyph, so this only touches the inline ring. */
.sn-radio--marker-inverted.sn-radio--checked .sn-radio__dot {
  border-color: var(--sn-web-color-action-primary);
  background-color: var(--sn-web-color-action-primary);
}
.sn-radio--marker-inverted.sn-radio--checked .sn-radio__dot::after {
  background-color: var(--sn-web-color-background-surface);
  transform: scale(0.42);
}
.sn-radio--marker-inverted.sn-radio--checked .sn-radio__label {
  color: var(--sn-web-color-action-primary);
}
.sn-radio--marker-inverted.sn-radio--disabled .sn-radio__dot::after {
  background-color: var(--sn-web-color-background-surface);
}

/* Corner tick — a triangular fold that hugs the card corner (like a ribbon
 * notch). It is flush with the border, not a floating badge, so it never
 * overlaps the card copy and reads as part of the card silhouette. */
.sn-radio__tick {
  position: absolute;
  width: 24px;
  height: 24px;
  background-color: var(--sn-web-color-action-primary);
  pointer-events: none;
}

.sn-radio__tick::after {
  content: '';
  position: absolute;
  width: 7px;
  height: 4px;
  border-bottom: 2px solid var(--sn-web-color-text-on-primary, #fff);
  border-left: 2px solid var(--sn-web-color-text-on-primary, #fff);
  transform: rotate(-45deg);
}

/* Top-right: the fold's right angle sits exactly in the card's top-right
 * corner. `clip-path` cuts the triangle; the card's own `overflow: hidden`
 * (below) trims the outer radius, so no separate radius is needed here —
 * `border-radius` + `clip-path` on the same box does not compose. */
.sn-radio--variant-card {
  overflow: hidden;
}

.sn-radio__tick--top-right {
  top: 0;
  right: 0;
  clip-path: polygon(100% 0, 100% 100%, 0 0);
}

.sn-radio__tick--top-right::after {
  top: 5px;
  right: 5px;
}

.sn-radio__tick--bottom-right {
  right: 0;
  bottom: 0;
  clip-path: polygon(100% 100%, 100% 0, 0 100%);
}

.sn-radio__tick--bottom-right::after {
  right: 5px;
  bottom: 5px;
}

.sn-radio--disabled.sn-radio--variant-card {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
