<script setup lang="ts">
/**
 * sn-segmented (uni-end) — two-to-five option segmented control.
 *
 * Reference library: wot-ui `wd-segmented`
 *   (https://wot-ui.cn/component/segmented.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-segmented 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-segmented/sn-segmented.vue
 * → auto-registered as `<sn-segmented>` in any .vue that uses it.
 *
 * ## Options are normalised, not required to be uniform
 *
 * wd-segmented accepts `string[] | number[] | SegmentedOption[]` in one prop.
 * Normalising here keeps the template a single loop and lets a caller mix
 * shapes without casting; the emitted payload is always the normalised
 * `SegmentedOption`, which is the documented `change` / `click` parameter.
 *
 * ## Vibrate
 *
 * `vibrateShort` calls `uni.vibrateShort` when the runtime exposes it. It is
 * guarded twice (the global exists, and the call is wrapped) because the H5
 * preview has no vibration motor and some miniprogram hosts reject the API.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 多选项的页签式导航 — 用 sn-tabs
 *   - 单选语义的列表 — 用 sn-radio-group
 */

import { computed, ref, watch } from 'vue';

defineOptions({ name: 'SnSegmented' });

/** One normalised option. */
export interface SegmentedOption {
  /** Option value — compared against the bound value. */
  value: string | number;
  /** Option label; falls back to `String(value)` when omitted. */
  label?: string;
  /** Disables just this option. */
  disabled?: boolean;
  /** Free-form payload handed back through the slots and events. */
  payload?: unknown;
}

type SegmentedRawOption = string | number | SegmentedOption;

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-segmented` 1:1 surface ──────────────────────────────── */

    /** 当前选中的值。 */
    modelValue?: string | number | undefined;
    /**
     * wot-ui `value` 别名 —— `wd-segmented` 把选中值叫 `value`，本组件叫
     * `modelValue`。两者同时存在时 `value` 优先，便于从 wot-ui 直接迁移。
     */
    value?: string | number | undefined;
    /** 是否禁用分段器。 */
    disabled?: boolean;
    /** 数据集合：string[] / number[] / SegmentedOption[]。 */
    options?: SegmentedRawOption[];
    /** 分段器主题：card / outline。 */
    theme?: 'card' | 'outline';
    /** 切换选项时是否触发短振动。 */
    vibrateShort?: boolean;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: string;
  }>(),
  {
    modelValue: undefined,
    value: undefined,
    disabled: false,
    options: () => [],
    theme: 'card',
    vibrateShort: false,
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  /** v-model 同步。 */
  (e: 'update:modelValue', value: string | number): void;
  /**
   * wot-ui spelling of the same event (`wd-segmented` names the model
   * `value`). Emitted alongside `update:modelValue` so a caller written
   * against wot-ui's docs works without renaming anything.
   */
  (e: 'update:value', value: string | number): void;
  /** 选项切换时触发。 */
  (e: 'change', option: SegmentedOption): void;
  /** 选项点击时触发（含重复点击当前项）。 */
  (e: 'click', option: SegmentedOption): void;
}>();

defineSlots<{
  /** 自定义选项标签内容，作用域 `{ option }`。 */
  label?(scope: { option: SegmentedOption }): unknown;
}>();

/** Normalised option list — mixed input shapes collapse to one contract. */
const normalizedOptions = computed<SegmentedOption[]>(() =>
  props.options.map((option) => {
    if (typeof option === 'string' || typeof option === 'number') {
      return { value: option, label: String(option) };
    }
    return { ...option, label: option.label ?? String(option.value) };
  }),
);

/** Uncontrolled fallback + controlled sync — both modes stay in step. */
/**
 * Bound value.
 *
 * wot-ui names this `value`; this component's own API is `modelValue`. When a
 * caller passes both, `value` wins — that is the wot-ui-native spelling, so a
 * component migrated from wd-segmented keeps working unchanged.
 */
const boundValue = computed<string | number | undefined>(() => props.value ?? props.modelValue);

/** Uncontrolled fallback + controlled sync — both modes stay in step. */
const innerValue = ref<string | number | undefined>(boundValue.value);
watch(boundValue, (next) => {
  innerValue.value = next;
});
const activeIndex = computed(() =>
  normalizedOptions.value.findIndex((option) => option.value === innerValue.value),
);

function isActive(option: SegmentedOption): boolean {
  return option.value === innerValue.value;
}

/** Short haptic feedback — guarded because H5 has no vibration motor. */
function vibrate(): void {
  if (!props.vibrateShort) return;
  const uni = (globalThis as { uni?: { vibrateShort?: (opts?: object) => unknown } }).uni;
  if (typeof uni?.vibrateShort !== 'function') return;
  try {
    uni.vibrateShort({});
  } catch {
    /* Vibration is decorative — a host that rejects the API must not break tap. */
  }
}

function onTap(option: SegmentedOption): void {
  if (props.disabled || option.disabled) return;
  emit('click', option);
  if (isActive(option)) return;
  innerValue.value = option.value;
  vibrate();
  emit('update:modelValue', option.value);
  // wot-ui spelling: same payload, so `@update:value` callers keep working.
  emit('update:value', option.value);
  emit('change', option);
}

const rootClass = computed(() => [
  'sn-segmented',
  `sn-segmented--${props.theme}`,
  {
    'sn-segmented--disabled': props.disabled,
  },
  props.customClass,
]);

/** Slider geometry — one equal share per option, offset by the active index. */
const sliderStyle = computed(() => {
  const count = normalizedOptions.value.length;
  if (count === 0 || activeIndex.value < 0) return undefined;
  const share = 100 / count;
  return `width: calc(${share}% - 8rpx); transform: translateX(calc(${activeIndex.value} * 100%))`;
});
</script>

<template>
  <view
    data-snui-component="segmented"
    :class="rootClass"
    :style="customStyle || undefined"
    role="group"
  >
    <view
      v-if="theme === 'card'"
      class="sn-segmented__slider"
      :style="sliderStyle"
      aria-hidden="true"
    />
    <view
      v-for="option in normalizedOptions"
      :key="String(option.value)"
      class="sn-segmented__item"
      :class="{
        'sn-segmented__item--active': isActive(option),
        'sn-segmented__item--disabled': disabled || option.disabled,
      }"
      role="button"
      :aria-pressed="isActive(option)"
      :aria-disabled="disabled || option.disabled"
      @tap="onTap(option)"
    >
      <slot name="label" :option="option">
        <text class="sn-segmented__label">{{ option.label }}</text>
      </slot>
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only; geometry in rpx (750 design canvas). */
.sn-segmented {
  position: relative;
  display: flex;
  align-items: stretch;
  box-sizing: border-box;
  width: 100%;
  padding: var(--sn-mp-spacing-1);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-subtle);
}

.sn-segmented--outline {
  padding: 0;
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: 0;
  background-color: transparent;
}

.sn-segmented--disabled {
  opacity: 0.6;
}

.sn-segmented__slider {
  position: absolute;
  top: var(--sn-mp-spacing-1);
  bottom: var(--sn-mp-spacing-1);
  left: var(--sn-mp-spacing-1);
  box-sizing: border-box;
  border-radius: var(--sn-mp-radius-sm);
  background-color: var(--sn-mp-color-background-surface);
  transition: transform 0.2s ease;
}

.sn-segmented__item {
  position: relative;
  z-index: 1;
  display: flex;
  flex: 1 1 0;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-3);
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-md);
}

.sn-segmented__item:active:not(.sn-segmented__item--disabled) {
  opacity: 0.7;
}

.sn-segmented__item--active {
  color: var(--sn-mp-color-action-primary);
  font-weight: var(--sn-mp-font-weight-medium);
}

.sn-segmented__item--disabled {
  color: var(--sn-mp-color-text-disabled);
}

/* Outline theme — the active item fills with the brand colour. */
.sn-segmented--outline .sn-segmented__item {
  border-left: 2rpx solid var(--sn-mp-color-border-default);
}

.sn-segmented--outline .sn-segmented__item:first-child {
  border-left: none;
}

.sn-segmented--outline .sn-segmented__item--active {
  background-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
}

.sn-segmented__label {
  overflow: hidden;
  color: inherit;
  font-size: inherit;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* Doodle skin — heavier active label. */
.snui-skin-doodle .sn-segmented__item--active {
  font-weight: var(--sn-mp-font-weight-bold);
}
</style>
