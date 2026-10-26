<script setup lang="ts">
/**
 * sn-checkbox (uni-end) — checkbox option for mobile / miniprogram.
 *
 * Reference library: wot-ui `wd-checkbox`
 *   (https://wot-ui.cn/component/checkbox.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-checkbox 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-checkbox/sn-checkbox.vue
 * → auto-registered as `<sn-checkbox>` in any .vue that uses it.
 *
 * Two modes, exactly like wd-checkbox:
 *   1. Standalone — `v-model` holds a `string | number | boolean`, compared
 *      against `trueValue` / `falseValue`.
 *   2. Inside `sn-checkbox-group` — `name` is the identity; the selection
 *      array lives on the group and every `undefined` prop inherits from it
 *      ("继承自 CheckboxGroup" in the wd-checkbox table).
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 多选集合的编排 / min·max 约束 — 用 sn-checkbox-group
 *   - 校验信息展示 — 用 sn-form-item
 */

import { computed, inject, markRaw, onBeforeUnmount, onMounted } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import { Check as CheckIcon, Minus as MinusIcon } from '../sn-icon/sn-icon-set';
import {
  SN_CHECKBOX_GROUP_KEY,
  type SnCheckboxDirection,
  type SnCheckboxGroupContext,
  type SnCheckboxPlacement,
  type SnCheckboxSize,
  type SnCheckboxType,
  type SnCheckboxValue,
} from './sn-checkbox-types';

defineOptions({ name: 'SnCheckbox' });

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-checkbox` 1:1 surface ───────────────────────────────── */

    /** Bound value when used standalone. Ignored inside a group. */
    modelValue?: SnCheckboxValue;
    /** Identity inside `sn-checkbox-group` (also the standalone value). */
    name?: SnCheckboxValue;
    /** Shape preset. Inherits from the group when not set. */
    type?: SnCheckboxType | undefined;
    /** Checked color. Inherits from the group when not set. */
    checkedColor?: string | undefined;
    /** Unchecked color. Inherits from the group when not set. */
    uncheckedColor?: string | undefined;
    /** Disables this option. Inherits from the group when not set. */
    disabled?: boolean | undefined;
    /** Read-only. Inherits from the group when not set. */
    readonly?: boolean | undefined;
    /** Half-checked state (highest visual priority, wd-checkbox parity). */
    indeterminate?: boolean;
    /** Value emitted when checked (standalone mode). */
    trueValue?: SnCheckboxValue;
    /** Value emitted when unchecked (standalone mode). */
    falseValue?: SnCheckboxValue;
    /** Size preset. Inherits from the group when not set. */
    size?: SnCheckboxSize;
    /** Tick position. Inherits from the group when not set. */
    placement?: SnCheckboxPlacement | undefined;
    /** Layout direction (only meaningful inside a group). */
    direction?: SnCheckboxDirection | undefined;
    /** Max width of the label text (CSS length). */
    maxWidth?: string;
    /** Class on the label text node. */
    customLabelClass?: string;
    /** Class on the root node. */
    customClass?: string;
    /** Inline style on the root node. */
    customStyle?: string;
  }>(),
  {
    modelValue: false,
    name: '',
    type: undefined,
    checkedColor: undefined,
    uncheckedColor: undefined,
    disabled: undefined,
    readonly: undefined,
    indeterminate: false,
    trueValue: true,
    falseValue: false,
    size: undefined,
    placement: undefined,
    direction: undefined,
    maxWidth: '',
    customLabelClass: '',
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  /** Standalone: the bound value changed. */
  (e: 'update:modelValue', value: SnCheckboxValue): void;
  /** Value changed — payload carries the new value either way. */
  (e: 'change', value: SnCheckboxValue): void;
}>();

const group = inject<SnCheckboxGroupContext | null>(SN_CHECKBOX_GROUP_KEY, null);

/** Inside a group the group owns the selection; standalone compares v-model. */
const isChecked = computed<boolean>(() => {
  if (group) return group.isChecked(props.name);
  return props.modelValue === props.trueValue;
});

/** Effective prop resolution — own value wins, then the group, then default. */
function resolve<T>(own: T | undefined, fromGroup: T | undefined, fallback: T): T {
  return own !== undefined ? own : fromGroup !== undefined ? fromGroup : fallback;
}

const effectiveType = computed<SnCheckboxType>(() =>
  resolve(props.type, group?.groupType.value, 'circle'),
);
const effectivePlacement = computed<SnCheckboxPlacement>(() =>
  resolve(props.placement, group?.groupPlacement.value, 'left'),
);
const effectiveSize = computed<SnCheckboxSize>(() =>
  resolve(props.size, group?.groupSize.value, undefined),
);
const effectiveDirection = computed<SnCheckboxDirection>(() =>
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
/** Every blocking state in one place — the tap handler and aria read this. */
const isBlocked = computed(() => isDisabled.value || isReadonly.value);

/** Tick glyphs (never emoji, §113). `markRaw` keeps SnIcon from proxying. */
const checkIcon = markRaw(CheckIcon);
const indeterminateIcon = markRaw(MinusIcon);

/**
 * Colour overrides arrive as user-supplied CSS colors (like wot-ui's
 * `checked-color`), so they are applied inline on top of the token defaults.
 */
const iconStyle = computed(() => {
  const checked = props.indeterminate || isChecked.value;
  if (checked) {
    return effectiveCheckedColor.value
      ? { backgroundColor: effectiveCheckedColor.value, borderColor: effectiveCheckedColor.value }
      : undefined;
  }
  return effectiveUncheckedColor.value ? { borderColor: effectiveUncheckedColor.value } : undefined;
});

function onToggle(): void {
  if (isBlocked.value) return;
  if (group) {
    group.toggle(props.name, !isChecked.value);
    emit('change', props.name);
    return;
  }
  const next = isChecked.value ? props.falseValue : props.trueValue;
  emit('update:modelValue', next);
  emit('change', next);
}

/**
 * Child registry so `sn-checkbox-group.toggleAll()` can enumerate the real
 * options. Registration is symmetric: every mount pairs with an unmount
 * cleanup (§41 — no leaked entries after a list re-render).
 */
onMounted(() => {
  group?.registerChild({ name: props.name, isDisabled: () => isDisabled.value });
});

onBeforeUnmount(() => {
  group?.unregisterChild(props.name);
});

const classList = computed(() => [
  'sn-checkbox',
  `sn-checkbox--${effectiveType.value}`,
  `sn-checkbox--placement-${effectivePlacement.value}`,
  {
    'sn-checkbox--checked': isChecked.value,
    'sn-checkbox--indeterminate': props.indeterminate,
    'sn-checkbox--disabled': isDisabled.value,
    'sn-checkbox--readonly': isReadonly.value,
    'sn-checkbox--large': effectiveSize.value === 'large',
    'sn-checkbox--horizontal': effectiveDirection.value === 'horizontal',
  },
  props.customClass,
]);

const wrapperStyle = computed(() => props.customStyle || undefined);
const labelStyle = computed(() => (props.maxWidth ? { maxWidth: props.maxWidth } : undefined));
</script>

<template>
  <view
    :class="classList"
    :style="wrapperStyle"
    :data-snui-component="'checkbox'"
    :data-type="effectiveType"
    role="checkbox"
    :aria-checked="indeterminate ? 'mixed' : isChecked ? 'true' : 'false'"
    :aria-disabled="isDisabled ? 'true' : undefined"
    :aria-readonly="isReadonly ? 'true' : undefined"
    :tabindex="isBlocked ? -1 : 0"
    @tap="onToggle"
  >
    <view class="sn-checkbox__main">
      <view
        v-if="effectivePlacement === 'left'"
        class="sn-checkbox__icon"
        :style="iconStyle"
        aria-hidden="true"
      >
        <SnIcon v-if="indeterminate" :icon="indeterminateIcon" :size="24" />
        <SnIcon v-else-if="isChecked" :icon="checkIcon" :size="24" />
      </view>

      <view class="sn-checkbox__label-wrap">
        <text :class="['sn-checkbox__label', customLabelClass]" :style="labelStyle">
          <slot />
        </text>
        <slot name="icon" :is-checked="isChecked" />
      </view>

      <view
        v-if="effectivePlacement === 'right'"
        class="sn-checkbox__icon"
        :style="iconStyle"
        aria-hidden="true"
      >
        <SnIcon v-if="indeterminate" :icon="indeterminateIcon" :size="24" />
        <SnIcon v-else-if="isChecked" :icon="checkIcon" :size="24" />
      </view>
    </view>
  </view>
</template>

<style scoped>
/**
 * Geometry in rpx. Colors come exclusively from `--sn-mp-*` tokens; the
 * `checked-color` / `unchecked-color` props are inline overrides applied by
 * `iconStyle` (the same escape hatch wd-checkbox documents).
 */
.sn-checkbox {
  display: inline-flex;
  flex-direction: row;
  align-items: flex-start;
  font-family: inherit;
  color: var(--sn-mp-color-text-primary);
  cursor: pointer;
  box-sizing: border-box;
}

.sn-checkbox__main {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--sn-mp-spacing-2);
  min-width: 0;
}

/* Tick plate — shared box for every `type`. */
.sn-checkbox__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid var(--sn-mp-color-control-unchecked);
  color: var(--sn-mp-color-text-on-primary);
  background-color: transparent;
  box-sizing: border-box;
  transition:
    background-color 0.18s ease-out,
    border-color 0.18s ease-out;
}

.sn-checkbox--large .sn-checkbox__icon {
  width: 48rpx;
  height: 48rpx;
}

/* `circle` is the wd-checkbox default. */
.sn-checkbox--circle .sn-checkbox__icon {
  border-radius: 50%;
}
/* `square` — rounded rect. */
.sn-checkbox--square .sn-checkbox__icon {
  border-radius: var(--sn-mp-radius-sm);
}
/* `dot` — smaller plate; the label carries the meaning. */
.sn-checkbox--dot .sn-checkbox__icon {
  border-radius: 50%;
  width: 32rpx;
  height: 32rpx;
}
/* `button` — the whole row becomes a chip. */
.sn-checkbox--button {
  padding: var(--sn-mp-spacing-1) var(--sn-mp-spacing-4);
  border: 2rpx solid var(--sn-mp-color-control-unchecked);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-soft);
}
.sn-checkbox--button .sn-checkbox__icon {
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
}

/* Checked / indeterminate plate. */
.sn-checkbox--checked .sn-checkbox__icon,
.sn-checkbox--indeterminate .sn-checkbox__icon {
  background-color: var(--sn-mp-color-action-primary);
  border-color: var(--sn-mp-color-action-primary);
}

/* Button chip when checked. */
.sn-checkbox--button.sn-checkbox--checked {
  border-color: var(--sn-mp-color-action-primary);
  background-color: var(--sn-mp-color-action-primary-soft);
}

.sn-checkbox__label-wrap {
  display: inline-flex;
  align-items: center;
  gap: var(--sn-mp-spacing-1);
  min-width: 0;
}

.sn-checkbox__label {
  font-size: var(--sn-mp-font-size-md);
  line-height: var(--sn-mp-font-line-height-normal);
  color: var(--sn-mp-color-text-primary);
  overflow-wrap: break-word;
}

.sn-checkbox--large .sn-checkbox__label {
  font-size: var(--sn-mp-font-size-lg);
}

.sn-checkbox--disabled,
.sn-checkbox--readonly {
  cursor: not-allowed;
}
.sn-checkbox--disabled {
  opacity: 0.6;
}

/* Doodle skin — hand-drawn box + offset shadow. */
.snui-skin-doodle .sn-checkbox__icon {
  border-width: 4rpx;
  border-color: var(--sn-mp-color-text-primary);
  border-radius: var(--sn-mp-radius-xs);
  box-shadow: 2rpx 2rpx 0 var(--sn-mp-color-text-primary);
}
.snui-skin-doodle .sn-checkbox--checked .sn-checkbox__icon {
  background-color: var(--sn-mp-color-text-primary);
  border-color: var(--sn-mp-color-text-primary);
}
.snui-skin-doodle .sn-checkbox__label {
  font-weight: 600;
}
</style>
