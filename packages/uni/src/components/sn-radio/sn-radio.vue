<script setup lang="ts">
/**
 * sn-radio (uni-end) — radio option for mobile / miniprogram.
 *
 * Reference library: wot-ui `wd-radio`
 *   (https://wot-ui.cn/component/radio.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-radio 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycon convention:
 *   components/sn-radio/sn-radio.vue
 * → auto-registered as `<sn-radio>` in any .vue that uses it.
 *
 * `sn-radio` is only meaningful inside `sn-radio-group`: `value` is the
 * identity, and the group owns the single selected value. Every prop that
 * wd-radio documents as "继承自 wd-radio-group" is declared as
 * `| undefined` here so "not set" stays distinguishable from an explicit
 * `false` / default.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 组选中值 / allowUncheck 编排 — 用 sn-radio-group
 *   - 校验信息展示 — 用 sn-form-item
 */

import { computed, inject, markRaw } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import { Check as CheckIcon } from '../sn-icon/sn-icon-set';
import {
  SN_RADIO_GROUP_KEY,
  type SnChoiceCheckedStyle,
  type SnChoiceIndicatorPlacement,
  type SnChoiceLabelPlacement,
  type SnChoiceMarkerShape,
  type SnChoiceVariant,
  type SnRadioDirection,
  type SnRadioGroupContext,
  type SnRadioPlacement,
  type SnRadioType,
  type SnRadioValue,
} from './sn-radio-types';

defineOptions({ name: 'SnRadio' });

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-radio` 1:1 surface ───────────────────────────────────── */

    /** This option's value — matched against the group's `v-model`. */
    value?: SnRadioValue;
    /** Shape preset. Inherits from the group when not set. */
    type?: SnRadioType | undefined;
    /** Checked color. Inherits from the group when not set. */
    checkedColor?: string | undefined;
    /** Unchecked color. Inherits from the group when not set. */
    uncheckedColor?: string | undefined;
    /** Disables this option. Inherits from the group when not set. */
    disabled?: boolean | undefined;
    /** Read-only. Inherits from the group when not set. */
    readonly?: boolean | undefined;
    /** Marker position. Inherits from the group when not set. */
    placement?: SnRadioPlacement | undefined;
    /** Layout direction (only meaningful inside a group). */
    direction?: SnRadioDirection | undefined;
    /* ── AUI additive surface (not part of wd-radio) ─────────────────────── */

    /**
     * Layout variant: `default` inline marker + label, `card` selectable card
     * (custom content via the `card` slot), `icon` square icon tile.
     * Inherits from the group when not set.
     */
    variant?: SnChoiceVariant | undefined;
    /**
     * Where the marker sits. `leading` / `trailing` inline, `top-right` /
     * `bottom-right` corner tick, `none` hides it. Falls back to the legacy
     * `placement` prop, then to a variant-derived default.
     */
    indicatorPlacement?: SnChoiceIndicatorPlacement | undefined;
    /** Which checked paint to apply: themed border, soft fill, or both. */
    checkedStyle?: SnChoiceCheckedStyle | undefined;
    /** Label side (AUI additive): label-first pushes the marker to the far end. */
    labelPlacement?: SnChoiceLabelPlacement | undefined;
    /** Inline marker shape (AUI additive): ring vs inverted fill. */
    markerShape?: SnChoiceMarkerShape | undefined;
    /** Class on the label text node. */
    customLabelClass?: string;
    /** Class on the root node. */
    customClass?: string;
    /** Inline style on the root node. */
    customStyle?: string;
  }>(),
  {
    value: '',
    type: undefined,
    checkedColor: undefined,
    uncheckedColor: undefined,
    disabled: undefined,
    readonly: undefined,
    placement: undefined,
    direction: undefined,
    variant: undefined,
    indicatorPlacement: undefined,
    checkedStyle: undefined,
    labelPlacement: undefined,
    markerShape: undefined,
    customLabelClass: '',
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  /** Selection changed — payload is this option's `value`. */
  (e: 'change', value: SnRadioValue): void;
}>();

const group = inject<SnRadioGroupContext | null>(SN_RADIO_GROUP_KEY, null);

/** Whether this option is the group's current selection. */
const isChecked = computed<boolean>(() => group?.isChecked(props.value) ?? false);

/** Effective prop resolution — own value wins, then the group, then default. */
function resolve<T>(own: T | undefined, fromGroup: T | undefined, fallback: T): T {
  return own !== undefined ? own : fromGroup !== undefined ? fromGroup : fallback;
}

const effectiveType = computed<SnRadioType>(() =>
  resolve(props.type, group?.groupType.value, 'circle'),
);
const effectivePlacement = computed<SnRadioPlacement>(() =>
  resolve(props.placement, group?.groupPlacement.value, 'left'),
);
const effectiveDirection = computed<SnRadioDirection>(() =>
  resolve(props.direction, group?.groupDirection.value, 'vertical'),
);
const effectiveCheckedColor = computed<string>(() =>
  resolve(props.checkedColor, group?.groupCheckedColor.value, ''),
);
const effectiveUncheckedColor = computed<string>(() =>
  resolve(props.uncheckedColor, group?.groupUncheckedColor.value, ''),
);
const isDisabled = computed<boolean>(() =>
  resolve(props.disabled, group?.groupDisabled.value, false),
);
const isReadonly = computed<boolean>(() =>
  resolve(props.readonly, group?.groupReadonly.value, false),
);
const isBlocked = computed(() => isDisabled.value || isReadonly.value);

/* ── AUI additive: variant / indicator placement / checked paint ─────────── */

/** Effective variant — own prop wins, then the group, then `default`. */
const effectiveVariant = computed<SnChoiceVariant>(() =>
  resolve(props.variant, group?.groupVariant.value, 'default'),
);

/**
 * Effective indicator placement. Own prop wins, then the group, then the
 * legacy `placement` (`left`/`right` → leading/trailing) for the default
 * variant, and a corner tick for card / icon tiles.
 */
const effectiveIndicatorPlacement = computed<SnChoiceIndicatorPlacement>(() => {
  const explicit = props.indicatorPlacement ?? group?.groupIndicatorPlacement.value;
  if (explicit !== undefined) return explicit;
  if (effectiveVariant.value === 'default') {
    return effectivePlacement.value === 'right' ? 'trailing' : 'leading';
  }
  return 'top-right';
});

/** Effective checked paint — card / icon tiles default to border + fill. */
const effectiveCheckedStyle = computed<SnChoiceCheckedStyle>(() => {
  const explicit = props.checkedStyle ?? group?.groupCheckedStyle.value;
  if (explicit !== undefined) return explicit;
  return effectiveVariant.value === 'default' ? 'default' : 'border-fill';
});

/** Corner tick (absolute) vs inline marker. */
const isCornerIndicator = computed(
  () =>
    effectiveIndicatorPlacement.value === 'top-right' ||
    effectiveIndicatorPlacement.value === 'bottom-right',
);

/** Effective label side — label-first pushes the marker to the far end. */
const effectiveLabelPlacement = computed<SnChoiceLabelPlacement>(() =>
  resolve(props.labelPlacement, group?.groupLabelPlacement.value, 'marker-first'),
);

/** Effective inline marker shape (ring vs inverted fill). */
const effectiveMarkerShape = computed<SnChoiceMarkerShape>(() =>
  resolve(props.markerShape, group?.groupMarkerShape.value, 'base'),
);

/** Whether the inline marker renders at all. */
const showInlineMarker = computed(
  () =>
    effectiveIndicatorPlacement.value === 'leading' ||
    effectiveIndicatorPlacement.value === 'trailing',
);

/** Tick glyph for the `button` shape (never emoji, §113). */
const checkIcon = markRaw(CheckIcon);

/**
 * Colour overrides arrive as user-supplied CSS colors (like wot-ui's
 * `checked-color`), applied inline on top of the token defaults.
 */
const markerStyle = computed(() => {
  if (isChecked.value) {
    return effectiveCheckedColor.value
      ? { borderColor: effectiveCheckedColor.value, backgroundColor: effectiveCheckedColor.value }
      : undefined;
  }
  return effectiveUncheckedColor.value ? { borderColor: effectiveUncheckedColor.value } : undefined;
});

function onSelect(): void {
  if (isBlocked.value) return;
  group?.select(props.value);
  emit('change', props.value);
}

const classList = computed(() => [
  'sn-radio',
  `sn-radio--${effectiveType.value}`,
  `sn-radio--placement-${effectivePlacement.value}`,
  `sn-radio--variant-${effectiveVariant.value}`,
  `sn-radio--indicator-${effectiveIndicatorPlacement.value}`,
  `sn-radio--label-${effectiveLabelPlacement.value}`,
  `sn-radio--marker-${effectiveMarkerShape.value}`,
  {
    'sn-radio--checked': isChecked.value,
    'sn-radio--disabled': isDisabled.value,
    'sn-radio--readonly': isReadonly.value,
    'sn-radio--horizontal': effectiveDirection.value === 'horizontal',
    'sn-radio--checked-border':
      isChecked.value &&
      (effectiveCheckedStyle.value === 'border' || effectiveCheckedStyle.value === 'border-fill'),
    'sn-radio--checked-fill':
      isChecked.value &&
      (effectiveCheckedStyle.value === 'fill' || effectiveCheckedStyle.value === 'border-fill'),
  },
  props.customClass,
]);

const wrapperStyle = computed(() => props.customStyle || undefined);
</script>

<template>
  <view
    :class="classList"
    :style="wrapperStyle"
    :data-snui-component="'radio'"
    :data-type="effectiveType"
    role="radio"
    :aria-checked="isChecked ? 'true' : 'false'"
    :aria-disabled="isDisabled ? 'true' : undefined"
    :aria-readonly="isReadonly ? 'true' : undefined"
    :tabindex="isBlocked ? -1 : 0"
    @tap="onSelect"
  >
    <view class="sn-radio__main">
      <view
        v-if="showInlineMarker && effectiveIndicatorPlacement === 'leading'"
        class="sn-radio__marker"
        :class="{
          /* Filled-plate marker — lets the doodle skin override the checked
           * colors with a 2-level rule (§116.2: a 3-level
           * `.skin .radio--checked .marker` selector is unrepresentable on
           * App). */
          'sn-radio__marker--checked': isChecked,
        }"
        :style="markerStyle"
        aria-hidden="true"
      >
        <view v-if="isChecked" class="sn-radio__dot">
          <SnIcon v-if="effectiveType === 'button'" :icon="checkIcon" :size="20" />
        </view>
      </view>

      <!-- Card body: custom content wins; otherwise the historical label row. -->
      <view v-if="effectiveVariant === 'card'" class="sn-radio__card">
        <slot name="card" :checked="isChecked" :disabled="isDisabled">
          <text :class="['sn-radio__label', customLabelClass]"><slot /></text>
        </slot>
      </view>
      <text v-else :class="['sn-radio__label', customLabelClass]"><slot /></text>

      <view
        v-if="showInlineMarker && effectiveIndicatorPlacement === 'trailing'"
        class="sn-radio__marker"
        :class="{ 'sn-radio__marker--checked': isChecked }"
        :style="markerStyle"
        aria-hidden="true"
      >
        <view v-if="isChecked" class="sn-radio__dot">
          <SnIcon v-if="effectiveType === 'button'" :icon="checkIcon" :size="20" />
        </view>
      </view>

      <!-- Corner tick: top-right / bottom-right, only while checked. -->
      <view
        v-if="isCornerIndicator && isChecked"
        class="sn-radio__tick"
        :class="`sn-radio__tick--${effectiveIndicatorPlacement}`"
        aria-hidden="true"
      >
        <SnIcon :icon="checkIcon" :size="16" />
      </view>
    </view>
  </view>
</template>

<style scoped>
/**
 * Geometry in rpx. Colors come exclusively from `--sn-mp-*` tokens; the
 * `checked-color` / `unchecked-color` props are inline overrides applied by
 * `markerStyle` (the escape hatch wd-radio documents).
 */
.sn-radio {
  display: inline-flex;
  flex-direction: row;
  align-items: flex-start;
  font-family: inherit;
  color: var(--sn-mp-color-text-primary);
  cursor: pointer;
  box-sizing: border-box;
}

.sn-radio__main {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--sn-mp-spacing-2);
  min-width: 0;
}

/* Marker ring — shared box for every `type`. */
.sn-radio__marker {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid var(--sn-mp-color-control-unchecked);
  border-radius: 50%;
  background-color: transparent;
  box-sizing: border-box;
  transition:
    border-color 0.18s ease-out,
    background-color 0.18s ease-out;
}

/* Inner dot — the "filled" half of a checked circle. */
.sn-radio__dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background-color: var(--sn-mp-color-control-knob);
  color: var(--sn-mp-color-action-primary);
  line-height: 1;
}

/* Checked plate — lives on the marker's own modifier class so the doodle
 * skin override below stays a 2-level rule (§116.2 — App cannot express a
 * 3-level descendant selector). */
.sn-radio__marker--checked {
  border-color: var(--sn-mp-color-action-primary);
  background-color: var(--sn-mp-color-action-primary);
}

/* `dot` — same ring, smaller box. */
.sn-radio--dot .sn-radio__marker {
  width: 32rpx;
  height: 32rpx;
}
.sn-radio--dot .sn-radio__dot {
  width: 16rpx;
  height: 16rpx;
}
/* `square` — right-angled ring with a square dot. */
.sn-radio--square .sn-radio__marker {
  border-radius: var(--sn-mp-radius-xs);
}
.sn-radio--square .sn-radio__dot {
  border-radius: var(--sn-mp-radius-xs);
}
/* `button` — the whole row becomes a chip and the tick is a real check glyph. */
.sn-radio--button {
  padding: var(--sn-mp-spacing-1) var(--sn-mp-spacing-4);
  border: 2rpx solid var(--sn-mp-color-control-unchecked);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-soft);
}
.sn-radio--button .sn-radio__marker {
  width: 32rpx;
  height: 32rpx;
}
.sn-radio--button .sn-radio__dot {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: transparent;
}
.sn-radio--button.sn-radio--checked {
  border-color: var(--sn-mp-color-action-primary);
  background-color: var(--sn-mp-color-action-primary-soft);
}

.sn-radio__label {
  font-size: var(--sn-mp-font-size-md);
  line-height: var(--sn-mp-font-line-height-normal);
  color: var(--sn-mp-color-text-primary);
  overflow-wrap: break-word;
}

/* ── AUI additive: card / icon variants + checked paint + corner tick ────── */

/* Card: the whole option becomes a selectable surface. */
.sn-radio--variant-card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: var(--sn-mp-spacing-3) var(--sn-mp-spacing-4);
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-surface);
  transition:
    border-color 0.18s ease-out,
    background-color 0.18s ease-out;
}

.sn-radio--variant-card .sn-radio__main {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--sn-mp-spacing-1);
}

.sn-radio--variant-card .sn-radio__card {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* Icon tile: square, centred glyph, no label row. */
/* Checked paint switches (only applied while checked). */
.sn-radio--checked-border.sn-radio--variant-card,
.sn-radio--checked-border.sn-radio--checked-fill.sn-radio--variant-card,
.sn-radio--checked-fill/* Corner tick — themed circle with a white check glyph. */
.sn-radio__tick {
  position: absolute;
  width: 48rpx;
  height: 48rpx;
  background-color: var(--sn-mp-color-action-primary);
  pointer-events: none;
}

.sn-radio__tick--top-right {
  top: -2rpx;
  right: -2rpx;
  border-top-right-radius: inherit;
  clip-path: polygon(100% 0, 100% 100%, 0 0);
}

.sn-radio__tick--bottom-right {
  right: -2rpx;
  bottom: -2rpx;
  border-bottom-right-radius: inherit;
  clip-path: polygon(100% 100%, 100% 0, 0 100%);
}

.sn-radio--disabled.sn-radio--variant-card,
.sn-radio--disabled.sn-radio--disabled,
.sn-radio--readonly {
  cursor: not-allowed;
}
.sn-radio--disabled {
  opacity: 0.6;
}

/* Doodle skin — hand-drawn ring. */
.snui-skin-doodle .sn-radio__marker {
  border-width: 4rpx;
  border-color: var(--sn-mp-color-text-primary);
  box-shadow: 2rpx 2rpx 0 var(--sn-mp-color-text-primary);
}
.snui-skin-doodle .sn-radio__marker--checked {
  background-color: var(--sn-mp-color-text-primary);
  border-color: var(--sn-mp-color-text-primary);
}
.snui-skin-doodle .sn-radio__label {
  font-weight: 600;
}

/* ── AUI additive: label-first + inverted marker ─────────────────────────── */

/* label-first: keep DOM order (a11y unchanged), only re-order flex children. */
.sn-radio--label-first .sn-radio__main {
  flex-direction: row-reverse;
  justify-content: space-between;
  width: 100%;
}
.sn-radio--label-first .sn-radio__label,
.sn-radio--label-first .sn-radio__card {
  flex: 1 1 auto;
  text-align: left;
}

/* inverted: whole plate in theme colour, inner dot punched in surface colour.
 * uni circle marker already fills on check, so inverted only needs to keep
 * the label in theme colour and guarantee the inner dot contrast. */
.sn-radio--marker-inverted.sn-radio--checked .sn-radio__label {
  color: var(--sn-mp-color-action-primary);
}
.sn-radio--marker-inverted.sn-radio--checked .sn-radio__dot {
  background-color: var(--sn-mp-color-background-surface);
}
.sn-radio--marker-inverted.sn-radio--checked .sn-radio__marker {
  border-color: var(--sn-mp-color-action-primary);
  background-color: var(--sn-mp-color-action-primary);
}
</style>
