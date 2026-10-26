<script setup lang="ts">
/**
 * sn-sidebar-item (uni-end) — single entry in a `sn-sidebar`.
 *
 * Reference library: wot-ui `wd-sidebar-item`
 *   (https://wot-ui.cn/component/sidebar.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-sidebar-item 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * Lives next to `sn-sidebar.vue` so the provide/inject contract types
 * (`sn-sidebar-types.ts`) stay beside both halves of the pair — the same
 * layout `sn-radio` / `sn-radio-group` uses.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 选中状态本身 — 由 sn-sidebar 持有
 *   - 右侧内容面板 — 由使用方按 `change` 自行切换
 */

import { computed, inject, markRaw } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import type { IconData } from '../sn-icon/sn-icon.vue';
import { resolveIconByName } from '../sn-icon/sn-icon-registry';
import { SN_SIDEBAR_KEY, type SnSidebarValue } from './sn-sidebar-types';

defineOptions({ name: 'SnSidebarItem' });

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-sidebar-item` 1:1 surface ───────────────────────────── */

    /** 当前选项标题。 */
    label?: string;
    /** 当前选项值，唯一标识。 */
    value?: SnSidebarValue | undefined;
    /** 徽标显示值。 */
    badge?: string | number | undefined;
    /** 图标名称（经 `registerSnIcons()` 注册）。 */
    icon?: string;
    /** 图标类名前缀，`cssIcon` 打开时用于拼出字体图标 class。 */
    iconPrefix?: string;
    /** CSS（字体）图标：`true` 用 `iconPrefix`，字符串则直接作为类名前缀。 */
    cssIcon?: boolean | string;
    /** 是否显示点状徽标。 */
    isDot?: boolean;
    /** 徽标最大值，超过后显示 `{max}+`。 */
    max?: number;
    /** 是否禁用当前选项。 */
    disabled?: boolean;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: string;
  }>(),
  {
    label: '',
    value: undefined,
    badge: undefined,
    icon: '',
    iconPrefix: '',
    cssIcon: false,
    isDot: false,
    max: 99,
    disabled: false,
    customClass: '',
    customStyle: '',
  },
);

defineSlots<{
  /** 自定义图标内容。 */
  icon?(): unknown;
}>();

const sidebar = inject(SN_SIDEBAR_KEY, null);

/** Effective value: explicit `value` wins, otherwise the label is the key. */
const itemValue = computed<SnSidebarValue>(() => props.value ?? props.label);

const isActive = computed(() => sidebar?.isActive(itemValue.value) ?? false);

const iconData = computed<IconData | null>(() => {
  if (!props.icon) return null;
  const resolved = resolveIconByName(props.icon);
  return resolved ? markRaw(resolved) : null;
});

/** Font-icon class list — mirrors sn-tag's `cssIcon` handling. */
const cssIconClass = computed<string>(() => {
  if (!props.icon || !props.cssIcon) return '';
  const prefix = typeof props.cssIcon === 'string' ? props.cssIcon : props.iconPrefix;
  return prefix ? `${prefix}-${props.icon}` : props.icon;
});

/** Badge text: `{max}+` above the ceiling, dot mode renders no text. */
const badgeText = computed<string>(() => {
  if (props.isDot || props.badge === undefined || props.badge === '') return '';
  if (typeof props.badge === 'number' && props.badge > props.max) return `${props.max}+`;
  return String(props.badge);
});

function onTap(): void {
  if (props.disabled || !sidebar) return;
  sidebar.select(itemValue.value, props.label);
}

const rootClass = computed(() => [
  'sn-sidebar-item',
  {
    'sn-sidebar-item--active': isActive.value,
    'sn-sidebar-item--disabled': props.disabled,
  },
  props.customClass,
]);
</script>

<template>
  <view
    data-snui-component="sidebar-item"
    :class="rootClass"
    :style="customStyle || undefined"
    role="tab"
    :aria-selected="isActive"
    :aria-disabled="disabled"
    :aria-label="label || undefined"
    @tap="onTap"
  >
    <view class="sn-sidebar-item__content">
      <slot name="icon">
        <SnIcon v-if="iconData" class="sn-sidebar-item__icon" :icon="iconData" :size="32" />
        <text
          v-else-if="cssIconClass"
          :class="['sn-sidebar-item__icon', cssIconClass]"
          aria-hidden="true"
        />
      </slot>
      <text class="sn-sidebar-item__label">{{ label }}</text>
    </view>
    <view
      v-if="isDot || badgeText"
      class="sn-sidebar-item__badge"
      :class="{ 'sn-sidebar-item__badge--dot': isDot }"
    >
      <text v-if="badgeText" class="sn-sidebar-item__badge-text">{{ badgeText }}</text>
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only; geometry in rpx (750 design canvas). */
.sn-sidebar-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  min-height: 100rpx;
  padding: var(--sn-mp-spacing-3) var(--sn-mp-spacing-3);
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-md);
}

.sn-sidebar-item:active:not(.sn-sidebar-item--disabled) {
  opacity: 0.7;
}

.sn-sidebar-item--active {
  background-color: var(--sn-mp-color-background-surface);
  color: var(--sn-mp-color-action-primary);
  font-weight: var(--sn-mp-font-weight-medium);
}

.sn-sidebar-item--active::before {
  position: absolute;
  top: 50%;
  left: 0;
  width: 6rpx;
  height: 32rpx;
  border-radius: 0 var(--sn-mp-radius-xs) var(--sn-mp-radius-xs) 0;
  background-color: var(--sn-mp-color-action-primary);
  content: '';
  transform: translateY(-50%);
}

.sn-sidebar-item--disabled {
  color: var(--sn-mp-color-text-disabled);
}

.sn-sidebar-item__content {
  display: flex;
  align-items: center;
  gap: var(--sn-mp-spacing-1);
  min-width: 0;
}

.sn-sidebar-item__icon {
  flex: 0 0 auto;
  color: inherit;
}

.sn-sidebar-item__label {
  overflow: hidden;
  color: inherit;
  font-size: inherit;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.sn-sidebar-item__badge {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  min-width: 28rpx;
  height: 28rpx;
  padding: 0 6rpx;
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-feedback-danger);
  color: var(--sn-mp-color-text-on-primary);
}

.sn-sidebar-item__badge--dot {
  min-width: 14rpx;
  width: 14rpx;
  height: 14rpx;
  padding: 0;
}

.sn-sidebar-item__badge-text {
  font-size: var(--sn-mp-font-size-xs);
  line-height: 1;
  color: var(--sn-mp-color-text-on-primary);
}
</style>
