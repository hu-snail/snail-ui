<script setup lang="ts">
/**
 * sn-cell (uni-end) — single list row: title, value, icons and a link arrow.
 *
 * Reference library: wot-ui `wd-cell`
 *   (https://wot-ui.cn/component/cell.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-cell 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-cell/sn-cell.vue
 * → auto-registered as `<sn-cell>` in any .vue that uses it.
 *
 * ## Inherited props
 *
 * `border` / `titleWidth` / `center` / `layout` / `valueAlign` are documented
 * upstream as "继承自 CellGroup". Each stays `undefined` here and only falls
 * back to the injected group value when unset — so an explicit per-cell prop
 * always wins, and a cell outside a group keeps a sane default. See
 * `sn-cell-types.ts`.
 *
 * ## Why `to` does not navigate by itself
 *
 * A component must not own routing (§60 AppBridge is the host capability
 * boundary). `to` / `replace` are forwarded to the `click` payload so the host
 * decides whether that means `navigateTo`, `redirectTo` or nothing at all.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 路由跳转 — 由宿主按 `click` 的 `to` / `replace` 决定
 *   - 表单校验 / 表单项布局 — 用 sn-form-item
 *   - 分组容器 — 用 sn-cell-group
 */

import { computed, inject, markRaw } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import type { IconData } from '../sn-icon/sn-icon.vue';
import { resolveIconByName } from '../sn-icon/sn-icon-registry';
import { ChevronRight } from '../sn-icon/sn-icon-set';
import { SN_CELL_GROUP_KEY, type SnCellValueAlign } from './sn-cell-types';

defineOptions({ name: 'SnCell' });

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-cell` 1:1 surface ───────────────────────────────────── */

    /** 左侧标题。 */
    title?: string;
    /** 右侧内容。 */
    value?: string | number | undefined;
    /** 占位符，仅在 value 为空时显示。 */
    placeholder?: string;
    /** 标题下方描述信息。 */
    label?: string;
    /** 前置图标名（经 `registerSnIcons()` 注册）。 */
    prefixIcon?: string;
    /** 后置图标名（经 `registerSnIcons()` 注册）。 */
    suffixIcon?: string;
    /** 图标大小。 */
    iconSize?: string | number | undefined;
    /** 图标类名前缀，`cssIcon` 打开时用于拼出字体图标 class。 */
    iconPrefix?: string;
    /** CSS（字体）图标：`true` 用 `iconPrefix`，字符串则直接作为 class 前缀。 */
    cssIcon?: boolean | string;
    /** 跳转地址（仅随 `click` 透出，组件不自行跳转）。 */
    to?: string;
    /** 跳转时是否替换当前页面历史（仅随 `click` 透出）。 */
    replace?: boolean;
    /** 是否开启点击反馈。 */
    clickable?: boolean;
    /** 是否展示右侧箭头并开启点击反馈。 */
    isLink?: boolean;
    /** 箭头方向：left / up / down / right。 */
    arrowDirection?: 'left' | 'up' | 'down' | 'right';
    /** 单元格大小，支持 large。 */
    size?: 'default' | 'large';
    /** 是否显示内边框，优先级高于 cell-group 同名属性。 */
    border?: boolean | undefined;
    /** 左侧标题宽度。 */
    titleWidth?: string | number | undefined;
    /** 是否垂直居中。 */
    center?: boolean | undefined;
    /** 单元格布局方式：horizontal / vertical。 */
    layout?: 'horizontal' | 'vertical' | undefined;
    /** 右侧内容对齐方式。 */
    valueAlign?: SnCellValueAlign | undefined;
    /** 是否显示必填星号。 */
    required?: boolean;
    /** 必填星号位置：start / end。 */
    asteriskPosition?: 'start' | 'end';
    /** 是否隐藏必填星号。 */
    hideAsterisk?: boolean;
    /** 内容是否超出隐藏显示省略号。 */
    ellipsis?: boolean;
    /** 是否启用 title 插槽。 */
    useTitleSlot?: boolean;
    /** 是否启用 label 插槽。 */
    useLabelSlot?: boolean;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: string;
    /** 前置图标自定义样式类。 */
    customPrefixClass?: string;
    /** 后置图标自定义样式类。 */
    customSuffixClass?: string;
    /** label 区域自定义样式类。 */
    customLabelClass?: string;
    /** value 区域自定义样式类。 */
    customValueClass?: string;
    /** title 区域自定义样式类。 */
    customTitleClass?: string;
  }>(),
  {
    title: '',
    value: '',
    placeholder: '',
    label: '',
    prefixIcon: '',
    suffixIcon: '',
    iconSize: undefined,
    iconPrefix: '',
    cssIcon: false,
    to: '',
    replace: false,
    clickable: false,
    isLink: false,
    arrowDirection: 'right',
    size: 'default',
    border: undefined,
    titleWidth: undefined,
    center: undefined,
    layout: undefined,
    valueAlign: undefined,
    required: false,
    asteriskPosition: 'start',
    hideAsterisk: false,
    ellipsis: false,
    useTitleSlot: true,
    useLabelSlot: true,
    customClass: '',
    customStyle: '',
    customPrefixClass: '',
    customSuffixClass: '',
    customLabelClass: '',
    customValueClass: '',
    customTitleClass: '',
  },
);

const emit = defineEmits<{
  /** `clickable` 或 `isLink` 为 true 时，点击单元格触发。 */
  (e: 'click', event: Event): void;
}>();

defineSlots<{
  /** 前置图标区域。 */
  prefix?(): unknown;
  /** 标题区域。 */
  title?(): unknown;
  /** 描述信息区域。 */
  label?(): unknown;
  /** 右侧内容区域。 */
  default?(): unknown;
  /** 后置图标区域（`isLink` 为 false 时生效）。 */
  suffix?(): unknown;
}>();

const group = inject(SN_CELL_GROUP_KEY, null);

/** Effective flags: explicit prop wins, group value fills the gaps. */
const effectiveBorder = computed(() => props.border ?? group?.border.value ?? false);
const effectiveCenter = computed(() => props.center ?? group?.center.value ?? false);
const effectiveLayout = computed(() => props.layout ?? group?.layout.value ?? 'horizontal');
const effectiveValueAlign = computed<SnCellValueAlign>(
  () => props.valueAlign ?? group?.valueAlign.value ?? 'right',
);
const effectiveTitleWidth = computed(() => props.titleWidth ?? group?.titleWidth.value);

/** Whether the row reacts to taps at all. */
const isInteractive = computed(() => props.clickable || props.isLink);

/** `value` renders the placeholder when empty — wd-cell's documented rule. */
const displayValue = computed<string>(() => {
  const value = props.value;
  if (value === undefined || value === '') return props.placeholder;
  return String(value);
});

function resolveIcon(name: string): IconData | null {
  if (!name) return null;
  const resolved = resolveIconByName(name);
  return resolved ? markRaw(resolved) : null;
}

const prefixIconData = computed(() => resolveIcon(props.prefixIcon));
const suffixIconData = computed(() => resolveIcon(props.suffixIcon));

/** Font-icon class list for either side. */
function cssIconClass(name: string): string {
  if (!name || !props.cssIcon) return '';
  const prefix = typeof props.cssIcon === 'string' ? props.cssIcon : props.iconPrefix;
  return prefix ? `${prefix}-${name}` : name;
}

/** Chevron rotation per `arrowDirection`. */
const arrowIconStyle = computed(() => {
  const rotation: Record<string, string> = {
    left: 'rotate(180deg)',
    up: 'rotate(-90deg)',
    down: 'rotate(90deg)',
    right: 'none',
  };
  return `transform: ${rotation[props.arrowDirection] ?? 'none'}`;
});

const iconSizeValue = computed(() => props.iconSize ?? 32);

/** Title column width — numbers are read as px (upstream contract). */
const titleStyle = computed(() => {
  const width = effectiveTitleWidth.value;
  if (width === undefined || width === '') return undefined;
  return `width: ${typeof width === 'number' ? `${width}px` : width}`;
});

function onTap(event: Event): void {
  if (!isInteractive.value) return;
  emit('click', event);
}

const rootClass = computed(() => [
  'sn-cell',
  `sn-cell--${props.size}`,
  `sn-cell--layout-${effectiveLayout.value}`,
  `sn-cell--align-${effectiveValueAlign.value}`,
  {
    'sn-cell--border': effectiveBorder.value,
    'sn-cell--center': effectiveCenter.value,
    'sn-cell--clickable': isInteractive.value,
    'sn-cell--ellipsis': props.ellipsis,
    'sn-cell--insert': group?.insert.value ?? false,
  },
  props.customClass,
]);
</script>

<template>
  <view
    data-snui-component="cell"
    :class="rootClass"
    :style="customStyle || undefined"
    :role="isInteractive ? 'button' : undefined"
    :aria-label="isInteractive ? title || undefined : undefined"
    @tap="onTap"
  >
    <view class="sn-cell__title" :style="titleStyle">
      <slot name="prefix">
        <SnIcon
          v-if="prefixIconData"
          :class="['sn-cell__icon', customPrefixClass]"
          :icon="prefixIconData"
          :size="iconSizeValue"
        />
        <text
          v-else-if="prefixIcon && cssIconClass(prefixIcon)"
          :class="['sn-cell__icon', cssIconClass(prefixIcon), customPrefixClass]"
          aria-hidden="true"
        />
      </slot>

      <view class="sn-cell__title-body">
        <view class="sn-cell__title-row">
          <text
            v-if="required && !hideAsterisk && asteriskPosition === 'start'"
            class="sn-cell__asterisk"
            aria-hidden="true"
            >*</text
          >
          <slot v-if="useTitleSlot" name="title">
            <text :class="['sn-cell__title-text', customTitleClass]">{{ title }}</text>
          </slot>
          <text v-else :class="['sn-cell__title-text', customTitleClass]">{{ title }}</text>
          <text
            v-if="required && !hideAsterisk && asteriskPosition === 'end'"
            class="sn-cell__asterisk"
            aria-hidden="true"
            >*</text
          >
        </view>

        <slot v-if="useLabelSlot" name="label">
          <text v-if="label" :class="['sn-cell__label', customLabelClass]">{{ label }}</text>
        </slot>
        <text v-else-if="label" :class="['sn-cell__label', customLabelClass]">{{ label }}</text>
      </view>
    </view>

    <view class="sn-cell__value">
      <slot>
        <text
          :class="[
            'sn-cell__value-text',
            { 'sn-cell__value-text--placeholder': displayValue === placeholder && value === '' },
            customValueClass,
          ]"
          >{{ displayValue }}</text
        >
      </slot>
    </view>

    <view v-if="isLink" class="sn-cell__arrow" aria-hidden="true">
      <SnIcon :icon="ChevronRight" :size="32" :style="arrowIconStyle" />
    </view>
    <slot v-else name="suffix">
      <SnIcon
        v-if="suffixIconData"
        :class="['sn-cell__icon', customSuffixClass]"
        :icon="suffixIconData"
        :size="iconSizeValue"
      />
      <text
        v-else-if="suffixIcon && cssIconClass(suffixIcon)"
        :class="['sn-cell__icon', cssIconClass(suffixIcon), customSuffixClass]"
        aria-hidden="true"
      />
    </slot>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only; geometry in rpx (750 design canvas). */
.sn-cell {
  position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: var(--sn-mp-spacing-3) var(--sn-mp-spacing-4);
  background-color: var(--sn-mp-color-background-surface);
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-md);
}

.sn-cell--center {
  align-items: center;
}

.sn-cell--clickable:active {
  background-color: var(--sn-mp-color-background-soft);
}

.sn-cell--border::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: var(--sn-mp-spacing-4);
  height: 2rpx;
  background-color: var(--sn-mp-color-border-subtle);
  content: '';
}

.sn-cell--layout-vertical {
  align-items: flex-start;
}

.sn-cell--layout-vertical .sn-cell__value {
  justify-content: flex-start;
  margin-top: var(--sn-mp-spacing-2);
}

.sn-cell--align-left .sn-cell__value {
  justify-content: flex-start;
}

.sn-cell--align-center .sn-cell__value {
  justify-content: center;
}

.sn-cell--align-right .sn-cell__value {
  justify-content: flex-end;
}

.sn-cell__title {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: var(--sn-mp-spacing-2);
  min-width: 0;
}

.sn-cell--layout-vertical .sn-cell__title {
  width: 100%;
}

.sn-cell__title-body {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-1);
  min-width: 0;
}

.sn-cell__title-row {
  display: flex;
  align-items: center;
  gap: var(--sn-mp-spacing-1);
  min-width: 0;
}

.sn-cell__title-text {
  overflow: hidden;
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-md);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.sn-cell--large .sn-cell__title-text {
  font-size: var(--sn-mp-font-size-lg);
}

.sn-cell__label {
  overflow: hidden;
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.sn-cell__asterisk {
  color: var(--sn-mp-color-feedback-danger);
  font-size: var(--sn-mp-font-size-md);
  line-height: 1;
}

.sn-cell__icon {
  flex: 0 0 auto;
  color: var(--sn-mp-color-text-secondary);
}

.sn-cell__value {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: flex-end;
  min-width: 0;
  margin-left: var(--sn-mp-spacing-3);
}

.sn-cell__value-text {
  overflow: hidden;
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-md);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.sn-cell--large .sn-cell__value-text {
  font-size: var(--sn-mp-font-size-lg);
}

.sn-cell--ellipsis .sn-cell__title-text,
.sn-cell--ellipsis .sn-cell__value-text {
  text-overflow: ellipsis;
}

.sn-cell__value-text--placeholder {
  color: var(--sn-mp-color-input-placeholder);
}

.sn-cell__arrow {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  margin-left: var(--sn-mp-spacing-2);
  color: var(--sn-mp-color-text-tertiary);
}

/* Doodle skin — heavier divider. */
.snui-skin-doodle .sn-cell--border::after {
  height: 4rpx;
  background-color: var(--sn-mp-color-text-primary);
}
</style>
