<script setup lang="ts">
/**
 * sn-tabbar-item (uni-end) — single tab in a `sn-tabbar`.
 *
 * Reference library: wot-ui `wd-tabbar-item`
 *   (https://wot-ui.cn/component/tabbar.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-tabbar-item 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * Lives next to `sn-tabbar.vue` so the provide/inject contract types
 * (`sn-tabbar-types.ts`) stay beside both halves of the pair — the same
 * layout `sn-radio` / `sn-radio-group` uses.
 *
 * ## Index fallback
 *
 * `name` is optional upstream: "不传时默认使用索引值". The bar hands out a
 * stable registration index on mount, which this item uses as its value when
 * `name` is absent. Registration order is the DOM order because items mount
 * in template order.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 选中状态本身 — 由 sn-tabbar 持有
 *   - 徽标本体 — 用 sn-badge
 */

import { computed, inject, markRaw } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import type { IconData } from '../sn-icon/sn-icon.vue';
import { resolveSnIconStringSync } from '../sn-icon/sn-icon-providers';
import { Check as CheckIcon } from '../sn-icon/sn-icon-set';
import { SN_TABBAR_KEY, type SnTabbarValue } from './sn-tabbar-types';

defineOptions({ name: 'SnTabbarItem' });

/**
 * 图标边长（rpx，750 画布 → 48rpx = 24px，与 `--sn-mp-icon-size-xlarge`
 * 同档）。必须是 rpx 字符串：数字在 `SnIcon` 里按 **px** 解释，会让图标
 * 比同画布下的其它几何大一倍且不随屏宽缩放。
 */
const TABBAR_ICON_SIZE = '48rpx';

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-tabbar-item` 1:1 surface ────────────────────────────── */

    /** 标签页标题。 */
    title?: string;
    /** 唯一标识符，不传时默认使用索引值。 */
    name?: SnTabbarValue | undefined;
    /** 图标名称（经 `registerSnIcons()` 注册）。 */
    icon?: string;
    /** 图标类名前缀，`cssIcon` 打开时用于拼出字体图标 class。 */
    iconPrefix?: string;
    /** CSS（字体）图标：`true` 用 `iconPrefix`，字符串则直接作为 class 前缀。 */
    cssIcon?: boolean | string;
    /** 徽标显示值。 */
    value?: number | string | undefined;
    /** 是否显示点状徽标。 */
    isDot?: boolean;
    /** 徽标最大值，超过后显示 `{max}+`。 */
    max?: number;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: string;
  }>(),
  {
    title: '',
    name: undefined,
    icon: '',
    iconPrefix: '',
    cssIcon: false,
    value: undefined,
    isDot: false,
    max: 99,
    customClass: '',
    customStyle: '',
  },
);

defineSlots<{
  /** 自定义整个标签项内容。 */
  default?(): unknown;
  /** 自定义图标（作用域参数 `{ active }`）。 */
  icon?(scope: { active: boolean }): unknown;
}>();

const tabbar = inject(SN_TABBAR_KEY, null);

/** Stable index handed out by the bar on mount (DOM order). */
const registeredIndex = tabbar ? tabbar.nextIndex() : 0;

/** Effective value: explicit `name` wins, otherwise the registration index. */
const itemValue = computed<SnTabbarValue>(() => props.name ?? registeredIndex);

const isActive = computed(() => tabbar?.isActive(itemValue.value) ?? false);

/** 凸起中心项配置（bar 下发）：命中当前项时走圆形主按钮渲染。 */
const elevateConfig = computed(() => tabbar?.elevate.value ?? null);
const isElevated = computed(
  () =>
    elevateConfig.value !== null &&
    elevateConfig.value !== undefined &&
    elevateConfig.value.index === registeredIndex,
);

/** Active / inactive colour, emitted on the root so icon, label and any
 * slotted glyph all resolve it (icon strokes paint with `currentColor`). */
const activeColor = computed<string | undefined>(() => {
  if (!tabbar) return undefined;
  const custom = isActive.value ? tabbar.activeColor.value : tabbar.inactiveColor.value;
  return custom === '' ? undefined : custom;
});

/**
 * The elevated action paints with the bar's `activeColor` (theme sync — the
 * round button is always the highlighted affordance); an empty prop keeps the
 * CSS fallback (primary token).
 */
const fabStyle = computed<string | undefined>(() => {
  const custom = tabbar ? tabbar.activeColor.value : '';
  return custom === '' ? undefined : `background-color: ${custom}`;
});

/** Root inline style: caller style first, the resolved active/inactive colour last. */
const rootStyle = computed<string | undefined>(() => {
  const parts: string[] = [];
  if (props.customStyle) parts.push(props.customStyle);
  const custom = activeColor.value;
  if (custom) parts.push(`color: ${custom}`);
  return parts.length === 0 ? undefined : parts.join(';');
});

const iconData = computed<IconData | null>(() => {
  if (!props.icon || props.cssIcon) return null;
  // Full chain (registry → built-in catalogue): catalogue names like
  // `house` / `search` / `user` resolve with zero registration, same as
  // every other string-icon consumer.
  const resolved = resolveSnIconStringSync(props.icon);
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
  if (props.isDot || props.value === undefined || props.value === '') return '';
  if (typeof props.value === 'number' && props.value > props.max) return `${props.max}+`;
  return String(props.value);
});

function onTap(): void {
  if (!tabbar) return;
  void tabbar.select(itemValue.value);
}

const rootClass = computed(() => [
  'sn-tabbar-item',
  {
    'sn-tabbar-item--active': isActive.value,
    'sn-tabbar-item--round': tabbar?.shape.value === 'round',
    'sn-tabbar-item--elevate': isElevated.value,
    'sn-tabbar-item--dot': props.isDot,
  },
  props.customClass,
]);
</script>

<template>
  <view
    data-snui-component="tabbar-item"
    :class="rootClass"
    :style="rootStyle"
    role="tab"
    :aria-selected="isActive"
    :aria-label="title || undefined"
    hover-class="sn-tabbar-item--pressed"
    @tap="onTap"
  >
    <view v-if="isElevated" class="sn-tabbar-item__fab" aria-hidden="true" />
    <slot v-if="!isElevated" :active="isActive">
      <view class="sn-tabbar-item__inner">
        <view class="sn-tabbar-item__icon">
          <slot name="icon" :active="isActive">
            <SnIcon v-if="iconData" :icon="iconData" :size="TABBAR_ICON_SIZE" />
            <text
              v-else-if="cssIconClass"
              :class="['sn-tabbar-item__css-icon', cssIconClass]"
              aria-hidden="true"
            />
          </slot>
          <view
            v-if="isDot || badgeText"
            class="sn-tabbar-item__badge"
            :class="{ 'sn-tabbar-item__badge--dot': isDot }"
          >
            <text v-if="badgeText" class="sn-tabbar-item__badge-text">{{ badgeText }}</text>
          </view>
        </view>
        <text v-if="title" class="sn-tabbar-item__title">{{ title }}</text>
      </view>
    </slot>
    <view
      v-if="isElevated"
      class="sn-tabbar-item__fab-button"
      :style="fabStyle"
      role="tab"
      :aria-selected="isActive"
      :aria-label="title || 'elevated action'"
    >
      <SnIcon
        v-if="elevateConfig && elevateConfig.icon"
        :icon="resolveSnIconStringSync(elevateConfig.icon) ?? CheckIcon"
        :size="TABBAR_ICON_SIZE"
      />
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only; geometry in rpx (750 design canvas). */
.sn-tabbar-item {
  display: flex;
  flex: 1 1 0;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: 0;
  padding: var(--sn-mp-spacing-1) var(--sn-mp-spacing-1);
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}

/* Press feedback rides hover-class (§116.2 — App has no :active pseudo). */
.sn-tabbar-item--pressed {
  opacity: 0.7;
}

.sn-tabbar-item--active {
  color: var(--sn-mp-color-action-primary);
}

.sn-tabbar-item--round {
  border-radius: var(--sn-mp-radius-full);
}

.sn-tabbar-item__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--sn-mp-spacing-1);
  min-width: 0;
}

.sn-tabbar-item__icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
}

.sn-tabbar-item__css-icon {
  font-size: var(--sn-mp-icon-size-xlarge);
  line-height: 1;
  color: inherit;
}

.sn-tabbar-item__title {
  max-width: 160rpx;
  overflow: hidden;
  color: inherit;
  font-size: var(--sn-mp-font-size-xs);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.sn-tabbar-item__badge {
  position: absolute;
  top: -8rpx;
  right: -16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28rpx;
  height: 28rpx;
  padding: 0 6rpx;
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-feedback-danger);
  color: var(--sn-mp-color-text-on-primary);
}

.sn-tabbar-item__badge--dot {
  top: -4rpx;
  right: -8rpx;
  min-width: 14rpx;
  width: 14rpx;
  height: 14rpx;
  padding: 0;
}

.sn-tabbar-item__badge-text {
  font-size: var(--sn-mp-font-size-xs);
  line-height: 1;
  color: var(--sn-mp-color-text-on-primary);
}

/* ── 中心凸起项（additive）：上凸圆形主按钮。bar 在 --elevated 形态下加高
 * 到 128rpx，圆钮以 flex-start + 负 margin 上浮出栏顶；__fab 是与栏同底色
 * 的凸包座（随 --sn-tabbar-bar-bg 走玻璃 / 暗色），轮廓由精确相切的几何弧经
 * CSS mask 挖出：栏顶凹弧（与栏顶线相切）→ 与按钮同心、间距 6rpx 的
 * 外套弧**完整包过按钮顶点**（外套顶在按钮顶外 6rpx）——白环 + 外套连成
 * 一条 14rpx 等宽白带环抱圆钮、融进栏顶。mask 不生效的环境降级为半椭圆穹顶（border-radius 兜底）。 ── */
.sn-tabbar-item--elevate {
  align-items: flex-start;
}

.sn-tabbar-item__fab {
  position: absolute;
  top: -52rpx;
  left: 50%;
  width: 144rpx;
  height: 52rpx;
  margin-left: -72rpx;
  border-radius: 52rpx 52rpx 0 0;
  background-color: var(--sn-tabbar-bar-bg, var(--sn-mp-color-background-surface));
  -webkit-mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNDQgNTIiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxwYXRoIGQ9Ik01LjkxIDUyTDYuMDggNTJMNi4yNiA1MS45OUw2LjQzIDUxLjk5TDYuNjEgNTEuOThMNi43OCA1MS45Nkw2Ljk1IDUxLjk1TDcuMTMgNTEuOTNMNy4zIDUxLjlMNy40NyA1MS44OEw3LjY1IDUxLjg1TDcuODIgNTEuODJMNy45OSA1MS43OEw4LjE2IDUxLjc0TDguMzMgNTEuN0w4LjUgNTEuNjZMOC42NyA1MS42MUw4LjgzIDUxLjU2TDkgNTEuNTFMOS4xNiA1MS40Nkw5LjMzIDUxLjRMOS40OSA1MS4zNEw5LjY2IDUxLjI3TDkuODIgNTEuMjFMOS45OCA1MS4xNEwxMC4xNCA1MS4wNkwxMC4yOSA1MC45OUwxMC40NSA1MC45MUwxMC42IDUwLjgzTDEwLjc2IDUwLjc1TDEwLjkxIDUwLjY2TDExLjA2IDUwLjU3TDExLjIxIDUwLjQ4TDExLjM2IDUwLjM5TDExLjUgNTAuMjlMMTEuNjQgNTAuMTlMMTEuNzkgNTAuMDlMMTEuOTMgNDkuOTlMMTIuMDcgNDkuODhMMTIuMiA0OS43N0wxMi4zNCA0OS42NkwxMi40NyA0OS41NUwxMi42IDQ5LjQzTDEyLjczIDQ5LjMxTDEyLjg2IDQ5LjE5TDEyLjk4IDQ5LjA3TDEzLjEgNDguOTVMMTMuMjIgNDguODJMMTMuMzQgNDguNjlMMTMuNDYgNDguNTZMMTMuNTcgNDguNDNMMTMuNjggNDguMjlMMTMuNzkgNDguMTZMMTMuOSA0OC4wMkwxNCA0Ny44OEwxNC4xIDQ3Ljc0TDE0LjIgNDcuNTlMMTQuMyA0Ny40NUwxNC4zOSA0Ny4zTDE0LjQ4IDQ3LjE1TDE0LjU3IDQ3TDE0LjY2IDQ2Ljg1TDE0Ljc0IDQ2LjY5TDE0LjgyIDQ2LjU0TDE0LjkgNDYuMzhMMTQuOTcgNDYuMjNMMTUuMDQgNDYuMDdMMTUuMTEgNDUuOTFMMTUuMTggNDUuNzVMMTUuMjQgNDUuNThMMTUuMzEgNDUuNDJMMTUuMzYgNDUuMjZMMTUuNDIgNDUuMDlMMTUuNDcgNDQuOTJMMTUuNTIgNDQuNzZMMTUuNTcgNDQuNTlMMTUuNjEgNDQuNDJMMTUuNjMgNDQuMzVMMTUuNjMgNDQuMzVMMTUuNzUgNDMuODZMMTUuODggNDMuMzdMMTYgNDIuODhMMTYuMTQgNDIuMzlMMTYuMjggNDEuOTFMMTYuNDIgNDEuNDJMMTYuNTcgNDAuOTRMMTYuNzIgNDAuNDVMMTYuODcgMzkuOTdMMTcuMDMgMzkuNDlMMTcuMiAzOS4wMUwxNy4zNiAzOC41NEwxNy41NCAzOC4wNkwxNy43MSAzNy41OEwxNy44OSAzNy4xMUwxOC4wOCAzNi42NEwxOC4yNiAzNi4xN0wxOC40NiAzNS43TDE4LjY1IDM1LjI0TDE4Ljg1IDM0Ljc3TDE5LjA2IDM0LjMxTDE5LjI3IDMzLjg1TDE5LjQ4IDMzLjM5TDE5LjcgMzIuOTNMMTkuOTIgMzIuNDhMMjAuMTQgMzIuMDJMMjAuMzcgMzEuNTdMMjAuNiAzMS4xMkwyMC44NCAzMC42N0wyMS4wOCAzMC4yM0wyMS4zMyAyOS43OEwyMS41NyAyOS4zNEwyMS44MyAyOC45TDIyLjA4IDI4LjQ3TDIyLjM0IDI4LjAzTDIyLjYgMjcuNkwyMi44NyAyNy4xN0wyMy4xNCAyNi43NEwyMy40MiAyNi4zMkwyMy43IDI1LjlMMjMuOTggMjUuNDhMMjQuMjYgMjUuMDZMMjQuNTUgMjQuNjRMMjQuODUgMjQuMjNMMjUuMTQgMjMuODJMMjUuNDQgMjMuNDFMMjUuNzUgMjMuMDFMMjYuMDUgMjIuNkwyNi4zNiAyMi4yTDI2LjY4IDIxLjgxTDI3IDIxLjQxTDI3LjMyIDIxLjAyTDI3LjY0IDIwLjYzTDI3Ljk3IDIwLjI1TDI4LjMgMTkuODdMMjguNjMgMTkuNDlMMjguOTcgMTkuMTFMMjkuMzEgMTguNzNMMjkuNjYgMTguMzZMMzAgMThMMzAuMzUgMTcuNjNMMzAuNzEgMTcuMjdMMzEuMDcgMTYuOTFMMzEuNDMgMTYuNTVMMzEuNzkgMTYuMkwzMi4xNiAxNS44NUwzMi41MiAxNS41MUwzMi45IDE1LjE2TDMzLjI3IDE0LjgyTDMzLjY1IDE0LjQ5TDM0LjAzIDE0LjE1TDM0LjQyIDEzLjgyTDM0LjggMTMuNUwzNS4xOSAxMy4xOEwzNS41OSAxMi44NkwzNS45OCAxMi41NEwzNi4zOCAxMi4yM0wzNi43OCAxMS45MkwzNy4xOCAxMS42MUwzNy41OSAxMS4zMUwzOCAxMS4wMUwzOC40MSAxMC43MkwzOC44MiAxMC40M0wzOS4yNCAxMC4xNEwzOS42NiA5Ljg1TDQwLjA4IDkuNTdMNDAuNSA5LjNMNDAuOTMgOS4wMkw0MS4zNiA4Ljc1TDQxLjc5IDguNDlMNDIuMjIgOC4yM0w0Mi42NiA3Ljk3TDQzLjEgNy43Mkw0My41NCA3LjQ3TDQzLjk4IDcuMjJMNDQuNDIgNi45OEw0NC44NyA2Ljc0TDQ1LjMyIDYuNUw0NS43NyA2LjI3TDQ2LjIyIDYuMDRMNDYuNjcgNS44Mkw0Ny4xMyA1LjZMNDcuNTkgNS4zOUw0OC4wNSA1LjE4TDQ4LjUxIDQuOTdMNDguOTcgNC43N0w0OS40NCA0LjU3TDQ5LjkxIDQuMzdMNTAuMzggNC4xOEw1MC44NSA0TDUxLjMyIDMuODFMNTEuNzkgMy42M0w1Mi4yNyAzLjQ2TDUyLjc0IDMuMjlMNTMuMjIgMy4xMkw1My43IDIuOTZMNTQuMTggMi44TDU0LjY2IDIuNjVMNTUuMTUgMi41TDU1LjYzIDIuMzZMNTYuMTIgMi4yMkw1Ni42MSAyLjA4TDU3LjEgMS45NUw1Ny41OCAxLjgyTDU4LjA4IDEuN0w1OC41NyAxLjU4TDU5LjA2IDEuNDZMNTkuNTUgMS4zNUw2MC4wNSAxLjI0TDYwLjU0IDEuMTRMNjEuMDQgMS4wNEw2MS41NCAwLjk1TDYyLjA0IDAuODZMNjIuNTQgMC43OEw2My4wNCAwLjdMNjMuNTQgMC42Mkw2NC4wNCAwLjU1TDY0LjU0IDAuNDhMNjUuMDQgMC40Mkw2NS41NCAwLjM2TDY2LjA1IDAuMzFMNjYuNTUgMC4yNkw2Ny4wNSAwLjIxTDY3LjU2IDAuMTdMNjguMDYgMC4xM0w2OC41NyAwLjFMNjkuMDcgMC4wN0w2OS41OCAwLjA1TDcwLjA5IDAuMDNMNzAuNTkgMC4wMkw3MS4xIDAuMDFMNzEuNiAwTDcyIDBMNzIuNCAwTDcyLjkgMC4wMUw3My40MSAwLjAyTDczLjkxIDAuMDNMNzQuNDIgMC4wNUw3NC45MyAwLjA3TDc1LjQzIDAuMUw3NS45NCAwLjEzTDc2LjQ0IDAuMTdMNzYuOTUgMC4yMUw3Ny40NSAwLjI2TDc3Ljk1IDAuMzFMNzguNDYgMC4zNkw3OC45NiAwLjQyTDc5LjQ2IDAuNDhMNzkuOTYgMC41NUw4MC40NiAwLjYyTDgwLjk2IDAuN0w4MS40NiAwLjc4TDgxLjk2IDAuODZMODIuNDYgMC45NUw4Mi45NiAxLjA0TDgzLjQ2IDEuMTRMODMuOTUgMS4yNEw4NC40NSAxLjM1TDg0Ljk0IDEuNDZMODUuNDMgMS41OEw4NS45MiAxLjdMODYuNDIgMS44Mkw4Ni45IDEuOTVMODcuMzkgMi4wOEw4Ny44OCAyLjIyTDg4LjM3IDIuMzZMODguODUgMi41TDg5LjM0IDIuNjVMODkuODIgMi44TDkwLjMgMi45Nkw5MC43OCAzLjEyTDkxLjI2IDMuMjlMOTEuNzMgMy40Nkw5Mi4yMSAzLjYzTDkyLjY4IDMuODFMOTMuMTUgNEw5My42MiA0LjE4TDk0LjA5IDQuMzdMOTQuNTYgNC41N0w5NS4wMyA0Ljc3TDk1LjQ5IDQuOTdMOTUuOTUgNS4xOEw5Ni40MSA1LjM5TDk2Ljg3IDUuNkw5Ny4zMyA1LjgyTDk3Ljc4IDYuMDRMOTguMjMgNi4yN0w5OC42OCA2LjVMOTkuMTMgNi43NEw5OS41OCA2Ljk4TDEwMC4wMiA3LjIyTDEwMC40NiA3LjQ3TDEwMC45IDcuNzJMMTAxLjM0IDcuOTdMMTAxLjc4IDguMjNMMTAyLjIxIDguNDlMMTAyLjY0IDguNzVMMTAzLjA3IDkuMDJMMTAzLjUgOS4zTDEwMy45MiA5LjU3TDEwNC4zNCA5Ljg1TDEwNC43NiAxMC4xNEwxMDUuMTggMTAuNDNMMTA1LjU5IDEwLjcyTDEwNiAxMS4wMUwxMDYuNDEgMTEuMzFMMTA2LjgyIDExLjYxTDEwNy4yMiAxMS45MkwxMDcuNjIgMTIuMjNMMTA4LjAyIDEyLjU0TDEwOC40MSAxMi44NkwxMDguODEgMTMuMThMMTA5LjIgMTMuNUwxMDkuNTggMTMuODJMMTA5Ljk3IDE0LjE1TDExMC4zNSAxNC40OUwxMTAuNzMgMTQuODJMMTExLjEgMTUuMTZMMTExLjQ4IDE1LjUxTDExMS44NCAxNS44NUwxMTIuMjEgMTYuMkwxMTIuNTcgMTYuNTVMMTEyLjkzIDE2LjkxTDExMy4yOSAxNy4yN0wxMTMuNjUgMTcuNjNMMTE0IDE4TDExNC4zNCAxOC4zNkwxMTQuNjkgMTguNzNMMTE1LjAzIDE5LjExTDExNS4zNyAxOS40OUwxMTUuNyAxOS44N0wxMTYuMDMgMjAuMjVMMTE2LjM2IDIwLjYzTDExNi42OCAyMS4wMkwxMTcgMjEuNDFMMTE3LjMyIDIxLjgxTDExNy42NCAyMi4yTDExNy45NSAyMi42TDExOC4yNSAyMy4wMUwxMTguNTYgMjMuNDFMMTE4Ljg2IDIzLjgyTDExOS4xNSAyNC4yM0wxMTkuNDUgMjQuNjRMMTE5Ljc0IDI1LjA2TDEyMC4wMiAyNS40OEwxMjAuMyAyNS45TDEyMC41OCAyNi4zMkwxMjAuODYgMjYuNzRMMTIxLjEzIDI3LjE3TDEyMS40IDI3LjZMMTIxLjY2IDI4LjAzTDEyMS45MiAyOC40N0wxMjIuMTcgMjguOUwxMjIuNDMgMjkuMzRMMTIyLjY3IDI5Ljc4TDEyMi45MiAzMC4yM0wxMjMuMTYgMzAuNjdMMTIzLjQgMzEuMTJMMTIzLjYzIDMxLjU3TDEyMy44NiAzMi4wMkwxMjQuMDggMzIuNDhMMTI0LjMgMzIuOTNMMTI0LjUyIDMzLjM5TDEyNC43MyAzMy44NUwxMjQuOTQgMzQuMzFMMTI1LjE1IDM0Ljc3TDEyNS4zNSAzNS4yNEwxMjUuNTQgMzUuN0wxMjUuNzQgMzYuMTdMMTI1LjkyIDM2LjY0TDEyNi4xMSAzNy4xMUwxMjYuMjkgMzcuNThMMTI2LjQ2IDM4LjA2TDEyNi42NCAzOC41NEwxMjYuOCAzOS4wMUwxMjYuOTcgMzkuNDlMMTI3LjEzIDM5Ljk3TDEyNy4yOCA0MC40NUwxMjcuNDMgNDAuOTRMMTI3LjU4IDQxLjQyTDEyNy43MiA0MS45MUwxMjcuODYgNDIuMzlMMTI4IDQyLjg4TDEyOC4xMiA0My4zN0wxMjguMjUgNDMuODZMMTI4LjM3IDQ0LjM1TDEyOC4zNyA0NC4zNUwxMjguMzkgNDQuNDJMMTI4LjQzIDQ0LjU5TDEyOC40OCA0NC43NkwxMjguNTMgNDQuOTJMMTI4LjU4IDQ1LjA5TDEyOC42NCA0NS4yNkwxMjguNjkgNDUuNDJMMTI4Ljc2IDQ1LjU4TDEyOC44MiA0NS43NUwxMjguODkgNDUuOTFMMTI4Ljk2IDQ2LjA3TDEyOS4wMyA0Ni4yM0wxMjkuMSA0Ni4zOEwxMjkuMTggNDYuNTRMMTI5LjI2IDQ2LjY5TDEyOS4zNCA0Ni44NUwxMjkuNDMgNDdMMTI5LjUyIDQ3LjE1TDEyOS42MSA0Ny4zTDEyOS43IDQ3LjQ1TDEyOS44IDQ3LjU5TDEyOS45IDQ3Ljc0TDEzMCA0Ny44OEwxMzAuMSA0OC4wMkwxMzAuMjEgNDguMTZMMTMwLjMyIDQ4LjI5TDEzMC40MyA0OC40M0wxMzAuNTQgNDguNTZMMTMwLjY2IDQ4LjY5TDEzMC43OCA0OC44MkwxMzAuOSA0OC45NUwxMzEuMDIgNDkuMDdMMTMxLjE0IDQ5LjE5TDEzMS4yNyA0OS4zMUwxMzEuNCA0OS40M0wxMzEuNTMgNDkuNTVMMTMxLjY2IDQ5LjY2TDEzMS44IDQ5Ljc3TDEzMS45MyA0OS44OEwxMzIuMDcgNDkuOTlMMTMyLjIxIDUwLjA5TDEzMi4zNiA1MC4xOUwxMzIuNSA1MC4yOUwxMzIuNjQgNTAuMzlMMTMyLjc5IDUwLjQ4TDEzMi45NCA1MC41N0wxMzMuMDkgNTAuNjZMMTMzLjI0IDUwLjc1TDEzMy40IDUwLjgzTDEzMy41NSA1MC45MUwxMzMuNzEgNTAuOTlMMTMzLjg2IDUxLjA2TDEzNC4wMiA1MS4xNEwxMzQuMTggNTEuMjFMMTM0LjM0IDUxLjI3TDEzNC41MSA1MS4zNEwxMzQuNjcgNTEuNEwxMzQuODQgNTEuNDZMMTM1IDUxLjUxTDEzNS4xNyA1MS41NkwxMzUuMzMgNTEuNjFMMTM1LjUgNTEuNjZMMTM1LjY3IDUxLjdMMTM1Ljg0IDUxLjc0TDEzNi4wMSA1MS43OEwxMzYuMTggNTEuODJMMTM2LjM1IDUxLjg1TDEzNi41MyA1MS44OEwxMzYuNyA1MS45TDEzNi44NyA1MS45M0wxMzcuMDUgNTEuOTVMMTM3LjIyIDUxLjk2TDEzNy4zOSA1MS45OEwxMzcuNTcgNTEuOTlMMTM3Ljc0IDUxLjk5TDEzNy45MiA1MkwxMzguMDkgNTJaIiBmaWxsPSIjMDAwIi8+PC9zdmc+');
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNDQgNTIiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxwYXRoIGQ9Ik01LjkxIDUyTDYuMDggNTJMNi4yNiA1MS45OUw2LjQzIDUxLjk5TDYuNjEgNTEuOThMNi43OCA1MS45Nkw2Ljk1IDUxLjk1TDcuMTMgNTEuOTNMNy4zIDUxLjlMNy40NyA1MS44OEw3LjY1IDUxLjg1TDcuODIgNTEuODJMNy45OSA1MS43OEw4LjE2IDUxLjc0TDguMzMgNTEuN0w4LjUgNTEuNjZMOC42NyA1MS42MUw4LjgzIDUxLjU2TDkgNTEuNTFMOS4xNiA1MS40Nkw5LjMzIDUxLjRMOS40OSA1MS4zNEw5LjY2IDUxLjI3TDkuODIgNTEuMjFMOS45OCA1MS4xNEwxMC4xNCA1MS4wNkwxMC4yOSA1MC45OUwxMC40NSA1MC45MUwxMC42IDUwLjgzTDEwLjc2IDUwLjc1TDEwLjkxIDUwLjY2TDExLjA2IDUwLjU3TDExLjIxIDUwLjQ4TDExLjM2IDUwLjM5TDExLjUgNTAuMjlMMTEuNjQgNTAuMTlMMTEuNzkgNTAuMDlMMTEuOTMgNDkuOTlMMTIuMDcgNDkuODhMMTIuMiA0OS43N0wxMi4zNCA0OS42NkwxMi40NyA0OS41NUwxMi42IDQ5LjQzTDEyLjczIDQ5LjMxTDEyLjg2IDQ5LjE5TDEyLjk4IDQ5LjA3TDEzLjEgNDguOTVMMTMuMjIgNDguODJMMTMuMzQgNDguNjlMMTMuNDYgNDguNTZMMTMuNTcgNDguNDNMMTMuNjggNDguMjlMMTMuNzkgNDguMTZMMTMuOSA0OC4wMkwxNCA0Ny44OEwxNC4xIDQ3Ljc0TDE0LjIgNDcuNTlMMTQuMyA0Ny40NUwxNC4zOSA0Ny4zTDE0LjQ4IDQ3LjE1TDE0LjU3IDQ3TDE0LjY2IDQ2Ljg1TDE0Ljc0IDQ2LjY5TDE0LjgyIDQ2LjU0TDE0LjkgNDYuMzhMMTQuOTcgNDYuMjNMMTUuMDQgNDYuMDdMMTUuMTEgNDUuOTFMMTUuMTggNDUuNzVMMTUuMjQgNDUuNThMMTUuMzEgNDUuNDJMMTUuMzYgNDUuMjZMMTUuNDIgNDUuMDlMMTUuNDcgNDQuOTJMMTUuNTIgNDQuNzZMMTUuNTcgNDQuNTlMMTUuNjEgNDQuNDJMMTUuNjMgNDQuMzVMMTUuNjMgNDQuMzVMMTUuNzUgNDMuODZMMTUuODggNDMuMzdMMTYgNDIuODhMMTYuMTQgNDIuMzlMMTYuMjggNDEuOTFMMTYuNDIgNDEuNDJMMTYuNTcgNDAuOTRMMTYuNzIgNDAuNDVMMTYuODcgMzkuOTdMMTcuMDMgMzkuNDlMMTcuMiAzOS4wMUwxNy4zNiAzOC41NEwxNy41NCAzOC4wNkwxNy43MSAzNy41OEwxNy44OSAzNy4xMUwxOC4wOCAzNi42NEwxOC4yNiAzNi4xN0wxOC40NiAzNS43TDE4LjY1IDM1LjI0TDE4Ljg1IDM0Ljc3TDE5LjA2IDM0LjMxTDE5LjI3IDMzLjg1TDE5LjQ4IDMzLjM5TDE5LjcgMzIuOTNMMTkuOTIgMzIuNDhMMjAuMTQgMzIuMDJMMjAuMzcgMzEuNTdMMjAuNiAzMS4xMkwyMC44NCAzMC42N0wyMS4wOCAzMC4yM0wyMS4zMyAyOS43OEwyMS41NyAyOS4zNEwyMS44MyAyOC45TDIyLjA4IDI4LjQ3TDIyLjM0IDI4LjAzTDIyLjYgMjcuNkwyMi44NyAyNy4xN0wyMy4xNCAyNi43NEwyMy40MiAyNi4zMkwyMy43IDI1LjlMMjMuOTggMjUuNDhMMjQuMjYgMjUuMDZMMjQuNTUgMjQuNjRMMjQuODUgMjQuMjNMMjUuMTQgMjMuODJMMjUuNDQgMjMuNDFMMjUuNzUgMjMuMDFMMjYuMDUgMjIuNkwyNi4zNiAyMi4yTDI2LjY4IDIxLjgxTDI3IDIxLjQxTDI3LjMyIDIxLjAyTDI3LjY0IDIwLjYzTDI3Ljk3IDIwLjI1TDI4LjMgMTkuODdMMjguNjMgMTkuNDlMMjguOTcgMTkuMTFMMjkuMzEgMTguNzNMMjkuNjYgMTguMzZMMzAgMThMMzAuMzUgMTcuNjNMMzAuNzEgMTcuMjdMMzEuMDcgMTYuOTFMMzEuNDMgMTYuNTVMMzEuNzkgMTYuMkwzMi4xNiAxNS44NUwzMi41MiAxNS41MUwzMi45IDE1LjE2TDMzLjI3IDE0LjgyTDMzLjY1IDE0LjQ5TDM0LjAzIDE0LjE1TDM0LjQyIDEzLjgyTDM0LjggMTMuNUwzNS4xOSAxMy4xOEwzNS41OSAxMi44NkwzNS45OCAxMi41NEwzNi4zOCAxMi4yM0wzNi43OCAxMS45MkwzNy4xOCAxMS42MUwzNy41OSAxMS4zMUwzOCAxMS4wMUwzOC40MSAxMC43MkwzOC44MiAxMC40M0wzOS4yNCAxMC4xNEwzOS42NiA5Ljg1TDQwLjA4IDkuNTdMNDAuNSA5LjNMNDAuOTMgOS4wMkw0MS4zNiA4Ljc1TDQxLjc5IDguNDlMNDIuMjIgOC4yM0w0Mi42NiA3Ljk3TDQzLjEgNy43Mkw0My41NCA3LjQ3TDQzLjk4IDcuMjJMNDQuNDIgNi45OEw0NC44NyA2Ljc0TDQ1LjMyIDYuNUw0NS43NyA2LjI3TDQ2LjIyIDYuMDRMNDYuNjcgNS44Mkw0Ny4xMyA1LjZMNDcuNTkgNS4zOUw0OC4wNSA1LjE4TDQ4LjUxIDQuOTdMNDguOTcgNC43N0w0OS40NCA0LjU3TDQ5LjkxIDQuMzdMNTAuMzggNC4xOEw1MC44NSA0TDUxLjMyIDMuODFMNTEuNzkgMy42M0w1Mi4yNyAzLjQ2TDUyLjc0IDMuMjlMNTMuMjIgMy4xMkw1My43IDIuOTZMNTQuMTggMi44TDU0LjY2IDIuNjVMNTUuMTUgMi41TDU1LjYzIDIuMzZMNTYuMTIgMi4yMkw1Ni42MSAyLjA4TDU3LjEgMS45NUw1Ny41OCAxLjgyTDU4LjA4IDEuN0w1OC41NyAxLjU4TDU5LjA2IDEuNDZMNTkuNTUgMS4zNUw2MC4wNSAxLjI0TDYwLjU0IDEuMTRMNjEuMDQgMS4wNEw2MS41NCAwLjk1TDYyLjA0IDAuODZMNjIuNTQgMC43OEw2My4wNCAwLjdMNjMuNTQgMC42Mkw2NC4wNCAwLjU1TDY0LjU0IDAuNDhMNjUuMDQgMC40Mkw2NS41NCAwLjM2TDY2LjA1IDAuMzFMNjYuNTUgMC4yNkw2Ny4wNSAwLjIxTDY3LjU2IDAuMTdMNjguMDYgMC4xM0w2OC41NyAwLjFMNjkuMDcgMC4wN0w2OS41OCAwLjA1TDcwLjA5IDAuMDNMNzAuNTkgMC4wMkw3MS4xIDAuMDFMNzEuNiAwTDcyIDBMNzIuNCAwTDcyLjkgMC4wMUw3My40MSAwLjAyTDczLjkxIDAuMDNMNzQuNDIgMC4wNUw3NC45MyAwLjA3TDc1LjQzIDAuMUw3NS45NCAwLjEzTDc2LjQ0IDAuMTdMNzYuOTUgMC4yMUw3Ny40NSAwLjI2TDc3Ljk1IDAuMzFMNzguNDYgMC4zNkw3OC45NiAwLjQyTDc5LjQ2IDAuNDhMNzkuOTYgMC41NUw4MC40NiAwLjYyTDgwLjk2IDAuN0w4MS40NiAwLjc4TDgxLjk2IDAuODZMODIuNDYgMC45NUw4Mi45NiAxLjA0TDgzLjQ2IDEuMTRMODMuOTUgMS4yNEw4NC40NSAxLjM1TDg0Ljk0IDEuNDZMODUuNDMgMS41OEw4NS45MiAxLjdMODYuNDIgMS44Mkw4Ni45IDEuOTVMODcuMzkgMi4wOEw4Ny44OCAyLjIyTDg4LjM3IDIuMzZMODguODUgMi41TDg5LjM0IDIuNjVMODkuODIgMi44TDkwLjMgMi45Nkw5MC43OCAzLjEyTDkxLjI2IDMuMjlMOTEuNzMgMy40Nkw5Mi4yMSAzLjYzTDkyLjY4IDMuODFMOTMuMTUgNEw5My42MiA0LjE4TDk0LjA5IDQuMzdMOTQuNTYgNC41N0w5NS4wMyA0Ljc3TDk1LjQ5IDQuOTdMOTUuOTUgNS4xOEw5Ni40MSA1LjM5TDk2Ljg3IDUuNkw5Ny4zMyA1LjgyTDk3Ljc4IDYuMDRMOTguMjMgNi4yN0w5OC42OCA2LjVMOTkuMTMgNi43NEw5OS41OCA2Ljk4TDEwMC4wMiA3LjIyTDEwMC40NiA3LjQ3TDEwMC45IDcuNzJMMTAxLjM0IDcuOTdMMTAxLjc4IDguMjNMMTAyLjIxIDguNDlMMTAyLjY0IDguNzVMMTAzLjA3IDkuMDJMMTAzLjUgOS4zTDEwMy45MiA5LjU3TDEwNC4zNCA5Ljg1TDEwNC43NiAxMC4xNEwxMDUuMTggMTAuNDNMMTA1LjU5IDEwLjcyTDEwNiAxMS4wMUwxMDYuNDEgMTEuMzFMMTA2LjgyIDExLjYxTDEwNy4yMiAxMS45MkwxMDcuNjIgMTIuMjNMMTA4LjAyIDEyLjU0TDEwOC40MSAxMi44NkwxMDguODEgMTMuMThMMTA5LjIgMTMuNUwxMDkuNTggMTMuODJMMTA5Ljk3IDE0LjE1TDExMC4zNSAxNC40OUwxMTAuNzMgMTQuODJMMTExLjEgMTUuMTZMMTExLjQ4IDE1LjUxTDExMS44NCAxNS44NUwxMTIuMjEgMTYuMkwxMTIuNTcgMTYuNTVMMTEyLjkzIDE2LjkxTDExMy4yOSAxNy4yN0wxMTMuNjUgMTcuNjNMMTE0IDE4TDExNC4zNCAxOC4zNkwxMTQuNjkgMTguNzNMMTE1LjAzIDE5LjExTDExNS4zNyAxOS40OUwxMTUuNyAxOS44N0wxMTYuMDMgMjAuMjVMMTE2LjM2IDIwLjYzTDExNi42OCAyMS4wMkwxMTcgMjEuNDFMMTE3LjMyIDIxLjgxTDExNy42NCAyMi4yTDExNy45NSAyMi42TDExOC4yNSAyMy4wMUwxMTguNTYgMjMuNDFMMTE4Ljg2IDIzLjgyTDExOS4xNSAyNC4yM0wxMTkuNDUgMjQuNjRMMTE5Ljc0IDI1LjA2TDEyMC4wMiAyNS40OEwxMjAuMyAyNS45TDEyMC41OCAyNi4zMkwxMjAuODYgMjYuNzRMMTIxLjEzIDI3LjE3TDEyMS40IDI3LjZMMTIxLjY2IDI4LjAzTDEyMS45MiAyOC40N0wxMjIuMTcgMjguOUwxMjIuNDMgMjkuMzRMMTIyLjY3IDI5Ljc4TDEyMi45MiAzMC4yM0wxMjMuMTYgMzAuNjdMMTIzLjQgMzEuMTJMMTIzLjYzIDMxLjU3TDEyMy44NiAzMi4wMkwxMjQuMDggMzIuNDhMMTI0LjMgMzIuOTNMMTI0LjUyIDMzLjM5TDEyNC43MyAzMy44NUwxMjQuOTQgMzQuMzFMMTI1LjE1IDM0Ljc3TDEyNS4zNSAzNS4yNEwxMjUuNTQgMzUuN0wxMjUuNzQgMzYuMTdMMTI1LjkyIDM2LjY0TDEyNi4xMSAzNy4xMUwxMjYuMjkgMzcuNThMMTI2LjQ2IDM4LjA2TDEyNi42NCAzOC41NEwxMjYuOCAzOS4wMUwxMjYuOTcgMzkuNDlMMTI3LjEzIDM5Ljk3TDEyNy4yOCA0MC40NUwxMjcuNDMgNDAuOTRMMTI3LjU4IDQxLjQyTDEyNy43MiA0MS45MUwxMjcuODYgNDIuMzlMMTI4IDQyLjg4TDEyOC4xMiA0My4zN0wxMjguMjUgNDMuODZMMTI4LjM3IDQ0LjM1TDEyOC4zNyA0NC4zNUwxMjguMzkgNDQuNDJMMTI4LjQzIDQ0LjU5TDEyOC40OCA0NC43NkwxMjguNTMgNDQuOTJMMTI4LjU4IDQ1LjA5TDEyOC42NCA0NS4yNkwxMjguNjkgNDUuNDJMMTI4Ljc2IDQ1LjU4TDEyOC44MiA0NS43NUwxMjguODkgNDUuOTFMMTI4Ljk2IDQ2LjA3TDEyOS4wMyA0Ni4yM0wxMjkuMSA0Ni4zOEwxMjkuMTggNDYuNTRMMTI5LjI2IDQ2LjY5TDEyOS4zNCA0Ni44NUwxMjkuNDMgNDdMMTI5LjUyIDQ3LjE1TDEyOS42MSA0Ny4zTDEyOS43IDQ3LjQ1TDEyOS44IDQ3LjU5TDEyOS45IDQ3Ljc0TDEzMCA0Ny44OEwxMzAuMSA0OC4wMkwxMzAuMjEgNDguMTZMMTMwLjMyIDQ4LjI5TDEzMC40MyA0OC40M0wxMzAuNTQgNDguNTZMMTMwLjY2IDQ4LjY5TDEzMC43OCA0OC44MkwxMzAuOSA0OC45NUwxMzEuMDIgNDkuMDdMMTMxLjE0IDQ5LjE5TDEzMS4yNyA0OS4zMUwxMzEuNCA0OS40M0wxMzEuNTMgNDkuNTVMMTMxLjY2IDQ5LjY2TDEzMS44IDQ5Ljc3TDEzMS45MyA0OS44OEwxMzIuMDcgNDkuOTlMMTMyLjIxIDUwLjA5TDEzMi4zNiA1MC4xOUwxMzIuNSA1MC4yOUwxMzIuNjQgNTAuMzlMMTMyLjc5IDUwLjQ4TDEzMi45NCA1MC41N0wxMzMuMDkgNTAuNjZMMTMzLjI0IDUwLjc1TDEzMy40IDUwLjgzTDEzMy41NSA1MC45MUwxMzMuNzEgNTAuOTlMMTMzLjg2IDUxLjA2TDEzNC4wMiA1MS4xNEwxMzQuMTggNTEuMjFMMTM0LjM0IDUxLjI3TDEzNC41MSA1MS4zNEwxMzQuNjcgNTEuNEwxMzQuODQgNTEuNDZMMTM1IDUxLjUxTDEzNS4xNyA1MS41NkwxMzUuMzMgNTEuNjFMMTM1LjUgNTEuNjZMMTM1LjY3IDUxLjdMMTM1Ljg0IDUxLjc0TDEzNi4wMSA1MS43OEwxMzYuMTggNTEuODJMMTM2LjM1IDUxLjg1TDEzNi41MyA1MS44OEwxMzYuNyA1MS45TDEzNi44NyA1MS45M0wxMzcuMDUgNTEuOTVMMTM3LjIyIDUxLjk2TDEzNy4zOSA1MS45OEwxMzcuNTcgNTEuOTlMMTM3Ljc0IDUxLjk5TDEzNy45MiA1MkwxMzguMDkgNTJaIiBmaWxsPSIjMDAwIi8+PC9zdmc+');
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
}

.sn-tabbar-item__fab-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 104rpx;
  height: 104rpx;
  margin-top: -52rpx;
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
  /* 无投影：fab 的 box-shadow 会落在同色凸包上形成灰月牙，破坏「环与
   * 凸包一体」的 illusion；凸起感由造型本身承担。 */
  border: 8rpx solid var(--sn-tabbar-bar-bg, var(--sn-mp-color-background-surface));
  box-sizing: border-box;
}

/* Doodle skin — heavier label. */
.snui-skin-doodle .sn-tabbar-item__title {
  font-weight: var(--sn-mp-font-weight-bold);
}
</style>
