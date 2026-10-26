<script setup lang="ts">
/**
 * sn-radio-group (uni-end) — radio group container for mobile / miniprogram.
 *
 * Reference library: wot-ui `wd-radio-group`
 *   (https://wot-ui.cn/component/radio.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-radio-group 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-radio/sn-radio-group.vue
 * → auto-registered as `<sn-radio-group>` in any .vue that uses it.
 * (Same directory as sn-radio so the provide/inject contract types stay next
 * to both halves of the pair.)
 *
 * The group owns the single-value `v-model`; children (`sn-radio`) read the
 * selection through `provide`/`inject` (`sn-radio-types.ts`) and inherit every
 * `undefined` prop from here — wd-radio's "继承自 wd-radio-group" contract.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 单个选项的渲染 — 用 sn-radio
 *   - 校验信息展示 — 用 sn-form-item
 */

import { computed, provide, toRef } from 'vue';
import {
  SN_RADIO_GROUP_KEY,
  type SnRadioDirection,
  type SnRadioModelValue,
  type SnRadioPlacement,
  type SnRadioType,
  type SnRadioValue,
} from './sn-radio-types';

defineOptions({ name: 'SnRadioGroup' });

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-radio-group` 1:1 surface ────────────────────────────── */

    /** Currently selected value; matched against each child's `value`. */
    modelValue?: SnRadioModelValue;
    /** Shape preset inherited by every child. */
    type?: SnRadioType;
    /** Checked color inherited by every child (empty = token default). */
    checkedColor?: string;
    /** Unchecked color inherited by every child (empty = token default). */
    uncheckedColor?: string;
    /** Disables every child. */
    disabled?: boolean;
    /** Makes every child read-only. */
    readonly?: boolean;
    /** Marker position inherited by every child. */
    placement?: SnRadioPlacement;
    /** Layout direction of the children. */
    direction?: SnRadioDirection;
    /** Allow tapping the selected radio again to clear the selection. */
    allowUncheck?: boolean;
    /** Class on the root wrapper. */
    customClass?: string;
    /** Inline style on the root wrapper. */
    customStyle?: string;
  }>(),
  {
    modelValue: undefined,
    type: 'circle',
    checkedColor: '',
    uncheckedColor: '',
    disabled: false,
    readonly: false,
    placement: 'left',
    direction: 'vertical',
    allowUncheck: false,
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  /** v-model sync — fires with the newly selected value. */
  (e: 'update:modelValue', value: SnRadioModelValue): void;
  /** Selection changed (alias of `update:modelValue`, wd-radio-group parity). */
  (e: 'change', value: SnRadioModelValue): void;
}>();

/** Whether `value` is the current selection. */
function isChecked(value: SnRadioValue): boolean {
  return props.modelValue === value;
}

/**
 * Select `value` — or clear the selection when `allowUncheck` is on and the
 * tapped radio is already selected (wd-radio-group's documented behaviour).
 */
function select(value: SnRadioValue): void {
  if (props.disabled || props.readonly) return;
  if (isChecked(value)) {
    if (!props.allowUncheck) return;
    commit(undefined);
    return;
  }
  commit(value);
}

function commit(value: SnRadioModelValue): void {
  emit('update:modelValue', value);
  emit('change', value);
}

provide(SN_RADIO_GROUP_KEY, {
  isChecked,
  select,
  groupDisabled: toRef(props, 'disabled'),
  groupReadonly: toRef(props, 'readonly'),
  groupType: toRef(props, 'type'),
  groupCheckedColor: toRef(props, 'checkedColor'),
  groupUncheckedColor: toRef(props, 'uncheckedColor'),
  groupPlacement: toRef(props, 'placement'),
  groupDirection: toRef(props, 'direction'),
});

/** Public imperative API — host pages can drive the group from code (§14). */
defineExpose({ select, isChecked });

const classList = computed(() => [
  'sn-radio-group',
  `sn-radio-group--${props.direction}`,
  {
    'sn-radio-group--disabled': props.disabled,
    'sn-radio-group--readonly': props.readonly,
  },
  props.customClass,
]);

const wrapperStyle = computed(() => props.customStyle || undefined);
</script>

<template>
  <view
    :class="classList"
    :style="wrapperStyle"
    :data-snui-component="'radio-group'"
    role="radiogroup"
  >
    <slot />
  </view>
</template>

<style scoped>
.sn-radio-group {
  display: flex;
  gap: var(--sn-mp-spacing-3);
  font-family: inherit;
  color: var(--sn-mp-color-text-primary);
}

.sn-radio-group--vertical {
  flex-direction: column;
  align-items: flex-start;
}

.sn-radio-group--horizontal {
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}

.sn-radio-group--disabled {
  opacity: 0.6;
}

/* Doodle skin — wider gap so the hand-drawn rings do not collide. */
.snui-skin-doodle .sn-radio-group {
  gap: var(--sn-mp-spacing-4);
}
</style>
