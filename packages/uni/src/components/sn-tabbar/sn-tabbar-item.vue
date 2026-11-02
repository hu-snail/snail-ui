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
 * 外套弧 → 平滑收敛并入圆钮白环——外套与按钮始终同心，无搁板感。mask 不生效的环境降级为半椭圆穹顶（border-radius 兜底）。 ── */
.sn-tabbar-item--elevate {
  align-items: flex-start;
}

.sn-tabbar-item__fab {
  position: absolute;
  top: -44rpx;
  left: 50%;
  width: 144rpx;
  height: 44rpx;
  margin-left: -72rpx;
  border-radius: 52rpx 52rpx 0 0;
  background-color: var(--sn-tabbar-bar-bg, var(--sn-mp-color-background-surface));
  -webkit-mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNDQgNDQiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxwYXRoIGQ9Ik01LjkxIDQ0TDYuMjYgNDMuOTlMNi42MSA0My45OEw2Ljk1IDQzLjk1TDcuMyA0My45TDcuNjUgNDMuODVMNy45OSA0My43OEw4LjMzIDQzLjdMOC42NyA0My42MUw5IDQzLjUxTDkuMzMgNDMuNEw5LjY2IDQzLjI3TDkuOTggNDMuMTRMMTAuMjkgNDIuOTlMMTAuNiA0Mi44M0wxMC45MSA0Mi42NkwxMS4yMSA0Mi40OEwxMS41IDQyLjI5TDExLjc5IDQyLjA5TDEyLjA3IDQxLjg4TDEyLjM0IDQxLjY2TDEyLjYgNDEuNDNMMTIuODYgNDEuMTlMMTMuMSA0MC45NUwxMy4zNCA0MC42OUwxMy41NyA0MC40M0wxMy43OSA0MC4xNkwxNCAzOS44OEwxNC4yIDM5LjU5TDE0LjM5IDM5LjNMMTQuNTcgMzlMMTQuNzQgMzguNjlMMTQuOSAzOC4zOEwxNS4wNCAzOC4wN0wxNS4xOCAzNy43NUwxNS4zMSAzNy40MkwxNS40MiAzNy4wOUwxNS41MiAzNi43NkwxNS42MSAzNi40MkwxNS42MyAzNi4zNUwxNS44OCAzNS4zN0wxNi4xNCAzNC4zOUwxNi40MiAzMy40MkwxNi43MiAzMi40NUwxNy4wMyAzMS40OUwxNy4zNiAzMC41NEwxNy43MSAyOS41OEwxOC4wOCAyOC42NEwxOC40NiAyNy43TDE4Ljg1IDI2Ljc3TDE5LjI3IDI1Ljg1TDE5LjcgMjQuOTNMMjAuMTQgMjQuMDJMMjAuNiAyMy4xMkwyMS4wOCAyMi4yM0wyMS41NyAyMS4zNEwyMi4wOCAyMC40N0wyMi42IDE5LjZMMjMuMTQgMTguNzRMMjMuNyAxNy45TDI0LjI2IDE3LjA2TDI0Ljg1IDE2LjIzTDI1LjQ0IDE1LjQxTDI2LjA1IDE0LjZMMjYuNjggMTMuODFMMjcuMzIgMTMuMDJMMjcuOTcgMTIuMjVMMjguNjMgMTEuNDlMMjkuMzEgMTAuNzNMMzAgMTBMMzAuNzEgOS4yN0wzMS40MyA4LjU1TDMyLjE2IDcuODVMMzIuOSA3LjE2TDMzLjY1IDYuNDlMMzQuNDIgNS44MkwzNS4xOSA1LjE4TDM1Ljk4IDQuNTRMMzYuMjkgNC4zTDM2LjcxIDQuMDFMMzcuMTcgMy43N0wzNy42NSAzLjU4TDM4LjE3IDMuNDRMMzguNzEgMy4zM0wzOS4yNyAzLjI2TDM5Ljg1IDMuMjJMNDAuNDQgMy4yMUw0MS4wNCAzLjIyTDQxLjY0IDMuMjVMNDIuMjUgMy4zTDQyLjg1IDMuMzZMNDMuNDYgMy40Mkw0NC4wNiAzLjQ5TDQ0LjY0IDMuNTZMNDUuMjIgMy42Mkw0NS43OSAzLjY3TDQ2LjM0IDMuN0w0Ni44NyAzLjcxTDQ3LjM4IDMuNjlMNDcuODcgMy42NUw0OC4zNCAzLjU2TDQ4Ljc4IDMuNDRMNDkuMiAzLjI2TDQ5LjIgMy4yNkw1MC4wMiAyLjg3TDUwLjg1IDIuNUw1MS42OCAyLjEzTDUyLjUyIDEuNzlMNTMuMzYgMS40NUw1NC4yMSAxLjE0TDU1LjA3IDAuODNMNTUuOTMgMC41NUw1Ni44IDAuMjdMNTcuNjcgMC4wMUw1OC41NCAtMC4yM0w1OS40MiAtMC40Nkw2MC4zIC0wLjY3TDYxLjE5IC0wLjg2TDYyLjA4IC0xLjA0TDYyLjk3IC0xLjIxTDYzLjg3IC0xLjM2TDY0Ljc2IC0xLjQ5TDY1LjY2IC0xLjYxTDY2LjU2IC0xLjcyTDY3LjQ3IC0xLjhMNjguMzcgLTEuODdMNjkuMjggLTEuOTNMNzAuMTkgLTEuOTdMNzEuMDkgLTEuOTlMNzIgLTJMNzIuOTEgLTEuOTlMNzMuODEgLTEuOTdMNzQuNzIgLTEuOTNMNzUuNjMgLTEuODdMNzYuNTMgLTEuOEw3Ny40NCAtMS43Mkw3OC4zNCAtMS42MUw3OS4yNCAtMS40OUw4MC4xMyAtMS4zNkw4MS4wMyAtMS4yMUw4MS45MiAtMS4wNEw4Mi44MSAtMC44Nkw4My43IC0wLjY3TDg0LjU4IC0wLjQ2TDg1LjQ2IC0wLjIzTDg2LjMzIDAuMDFMODcuMiAwLjI3TDg4LjA3IDAuNTVMODguOTMgMC44M0w4OS43OSAxLjE0TDkwLjY0IDEuNDVMOTEuNDggMS43OUw5Mi4zMiAyLjEzTDkzLjE1IDIuNUw5My45OCAyLjg3TDk0LjggMy4yNkw5NC44IDMuMjZMOTUuMjIgMy40NEw5NS42NiAzLjU2TDk2LjEzIDMuNjVMOTYuNjIgMy42OUw5Ny4xMyAzLjcxTDk3LjY2IDMuN0w5OC4yMSAzLjY3TDk4Ljc4IDMuNjJMOTkuMzYgMy41Nkw5OS45NCAzLjQ5TDEwMC41NCAzLjQyTDEwMS4xNSAzLjM2TDEwMS43NSAzLjNMMTAyLjM2IDMuMjVMMTAyLjk2IDMuMjJMMTAzLjU2IDMuMjFMMTA0LjE1IDMuMjJMMTA0LjczIDMuMjZMMTA1LjI5IDMuMzNMMTA1LjgzIDMuNDRMMTA2LjM1IDMuNThMMTA2LjgzIDMuNzdMMTA3LjI5IDQuMDFMMTA3LjcxIDQuM0wxMDguMDIgNC41NEwxMDguODEgNS4xOEwxMDkuNTggNS44MkwxMTAuMzUgNi40OUwxMTEuMSA3LjE2TDExMS44NCA3Ljg1TDExMi41NyA4LjU1TDExMy4yOSA5LjI3TDExNCAxMEwxMTQuNjkgMTAuNzNMMTE1LjM3IDExLjQ5TDExNi4wMyAxMi4yNUwxMTYuNjggMTMuMDJMMTE3LjMyIDEzLjgxTDExNy45NSAxNC42TDExOC41NiAxNS40MUwxMTkuMTUgMTYuMjNMMTE5Ljc0IDE3LjA2TDEyMC4zIDE3LjlMMTIwLjg2IDE4Ljc0TDEyMS40IDE5LjZMMTIxLjkyIDIwLjQ3TDEyMi40MyAyMS4zNEwxMjIuOTIgMjIuMjNMMTIzLjQgMjMuMTJMMTIzLjg2IDI0LjAyTDEyNC4zIDI0LjkzTDEyNC43MyAyNS44NUwxMjUuMTUgMjYuNzdMMTI1LjU0IDI3LjdMMTI1LjkyIDI4LjY0TDEyNi4yOSAyOS41OEwxMjYuNjQgMzAuNTRMMTI2Ljk3IDMxLjQ5TDEyNy4yOCAzMi40NUwxMjcuNTggMzMuNDJMMTI3Ljg2IDM0LjM5TDEyOC4xMiAzNS4zN0wxMjguMzcgMzYuMzVMMTI4LjM5IDM2LjQyTDEyOC40OCAzNi43NkwxMjguNTggMzcuMDlMMTI4LjY5IDM3LjQyTDEyOC44MiAzNy43NUwxMjguOTYgMzguMDdMMTI5LjEgMzguMzhMMTI5LjI2IDM4LjY5TDEyOS40MyAzOUwxMjkuNjEgMzkuM0wxMjkuOCAzOS41OUwxMzAgMzkuODhMMTMwLjIxIDQwLjE2TDEzMC40MyA0MC40M0wxMzAuNjYgNDAuNjlMMTMwLjkgNDAuOTVMMTMxLjE0IDQxLjE5TDEzMS40IDQxLjQzTDEzMS42NiA0MS42NkwxMzEuOTMgNDEuODhMMTMyLjIxIDQyLjA5TDEzMi41IDQyLjI5TDEzMi43OSA0Mi40OEwxMzMuMDkgNDIuNjZMMTMzLjQgNDIuODNMMTMzLjcxIDQyLjk5TDEzNC4wMiA0My4xNEwxMzQuMzQgNDMuMjdMMTM0LjY3IDQzLjRMMTM1IDQzLjUxTDEzNS4zMyA0My42MUwxMzUuNjcgNDMuN0wxMzYuMDEgNDMuNzhMMTM2LjM1IDQzLjg1TDEzNi43IDQzLjlMMTM3LjA1IDQzLjk1TDEzNy4zOSA0My45OEwxMzcuNzQgNDMuOTlMMTM4LjA5IDQ0WiIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==');
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNDQgNDQiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxwYXRoIGQ9Ik01LjkxIDQ0TDYuMjYgNDMuOTlMNi42MSA0My45OEw2Ljk1IDQzLjk1TDcuMyA0My45TDcuNjUgNDMuODVMNy45OSA0My43OEw4LjMzIDQzLjdMOC42NyA0My42MUw5IDQzLjUxTDkuMzMgNDMuNEw5LjY2IDQzLjI3TDkuOTggNDMuMTRMMTAuMjkgNDIuOTlMMTAuNiA0Mi44M0wxMC45MSA0Mi42NkwxMS4yMSA0Mi40OEwxMS41IDQyLjI5TDExLjc5IDQyLjA5TDEyLjA3IDQxLjg4TDEyLjM0IDQxLjY2TDEyLjYgNDEuNDNMMTIuODYgNDEuMTlMMTMuMSA0MC45NUwxMy4zNCA0MC42OUwxMy41NyA0MC40M0wxMy43OSA0MC4xNkwxNCAzOS44OEwxNC4yIDM5LjU5TDE0LjM5IDM5LjNMMTQuNTcgMzlMMTQuNzQgMzguNjlMMTQuOSAzOC4zOEwxNS4wNCAzOC4wN0wxNS4xOCAzNy43NUwxNS4zMSAzNy40MkwxNS40MiAzNy4wOUwxNS41MiAzNi43NkwxNS42MSAzNi40MkwxNS42MyAzNi4zNUwxNS44OCAzNS4zN0wxNi4xNCAzNC4zOUwxNi40MiAzMy40MkwxNi43MiAzMi40NUwxNy4wMyAzMS40OUwxNy4zNiAzMC41NEwxNy43MSAyOS41OEwxOC4wOCAyOC42NEwxOC40NiAyNy43TDE4Ljg1IDI2Ljc3TDE5LjI3IDI1Ljg1TDE5LjcgMjQuOTNMMjAuMTQgMjQuMDJMMjAuNiAyMy4xMkwyMS4wOCAyMi4yM0wyMS41NyAyMS4zNEwyMi4wOCAyMC40N0wyMi42IDE5LjZMMjMuMTQgMTguNzRMMjMuNyAxNy45TDI0LjI2IDE3LjA2TDI0Ljg1IDE2LjIzTDI1LjQ0IDE1LjQxTDI2LjA1IDE0LjZMMjYuNjggMTMuODFMMjcuMzIgMTMuMDJMMjcuOTcgMTIuMjVMMjguNjMgMTEuNDlMMjkuMzEgMTAuNzNMMzAgMTBMMzAuNzEgOS4yN0wzMS40MyA4LjU1TDMyLjE2IDcuODVMMzIuOSA3LjE2TDMzLjY1IDYuNDlMMzQuNDIgNS44MkwzNS4xOSA1LjE4TDM1Ljk4IDQuNTRMMzYuMjkgNC4zTDM2LjcxIDQuMDFMMzcuMTcgMy43N0wzNy42NSAzLjU4TDM4LjE3IDMuNDRMMzguNzEgMy4zM0wzOS4yNyAzLjI2TDM5Ljg1IDMuMjJMNDAuNDQgMy4yMUw0MS4wNCAzLjIyTDQxLjY0IDMuMjVMNDIuMjUgMy4zTDQyLjg1IDMuMzZMNDMuNDYgMy40Mkw0NC4wNiAzLjQ5TDQ0LjY0IDMuNTZMNDUuMjIgMy42Mkw0NS43OSAzLjY3TDQ2LjM0IDMuN0w0Ni44NyAzLjcxTDQ3LjM4IDMuNjlMNDcuODcgMy42NUw0OC4zNCAzLjU2TDQ4Ljc4IDMuNDRMNDkuMiAzLjI2TDQ5LjIgMy4yNkw1MC4wMiAyLjg3TDUwLjg1IDIuNUw1MS42OCAyLjEzTDUyLjUyIDEuNzlMNTMuMzYgMS40NUw1NC4yMSAxLjE0TDU1LjA3IDAuODNMNTUuOTMgMC41NUw1Ni44IDAuMjdMNTcuNjcgMC4wMUw1OC41NCAtMC4yM0w1OS40MiAtMC40Nkw2MC4zIC0wLjY3TDYxLjE5IC0wLjg2TDYyLjA4IC0xLjA0TDYyLjk3IC0xLjIxTDYzLjg3IC0xLjM2TDY0Ljc2IC0xLjQ5TDY1LjY2IC0xLjYxTDY2LjU2IC0xLjcyTDY3LjQ3IC0xLjhMNjguMzcgLTEuODdMNjkuMjggLTEuOTNMNzAuMTkgLTEuOTdMNzEuMDkgLTEuOTlMNzIgLTJMNzIuOTEgLTEuOTlMNzMuODEgLTEuOTdMNzQuNzIgLTEuOTNMNzUuNjMgLTEuODdMNzYuNTMgLTEuOEw3Ny40NCAtMS43Mkw3OC4zNCAtMS42MUw3OS4yNCAtMS40OUw4MC4xMyAtMS4zNkw4MS4wMyAtMS4yMUw4MS45MiAtMS4wNEw4Mi44MSAtMC44Nkw4My43IC0wLjY3TDg0LjU4IC0wLjQ2TDg1LjQ2IC0wLjIzTDg2LjMzIDAuMDFMODcuMiAwLjI3TDg4LjA3IDAuNTVMODguOTMgMC44M0w4OS43OSAxLjE0TDkwLjY0IDEuNDVMOTEuNDggMS43OUw5Mi4zMiAyLjEzTDkzLjE1IDIuNUw5My45OCAyLjg3TDk0LjggMy4yNkw5NC44IDMuMjZMOTUuMjIgMy40NEw5NS42NiAzLjU2TDk2LjEzIDMuNjVMOTYuNjIgMy42OUw5Ny4xMyAzLjcxTDk3LjY2IDMuN0w5OC4yMSAzLjY3TDk4Ljc4IDMuNjJMOTkuMzYgMy41Nkw5OS45NCAzLjQ5TDEwMC41NCAzLjQyTDEwMS4xNSAzLjM2TDEwMS43NSAzLjNMMTAyLjM2IDMuMjVMMTAyLjk2IDMuMjJMMTAzLjU2IDMuMjFMMTA0LjE1IDMuMjJMMTA0LjczIDMuMjZMMTA1LjI5IDMuMzNMMTA1LjgzIDMuNDRMMTA2LjM1IDMuNThMMTA2LjgzIDMuNzdMMTA3LjI5IDQuMDFMMTA3LjcxIDQuM0wxMDguMDIgNC41NEwxMDguODEgNS4xOEwxMDkuNTggNS44MkwxMTAuMzUgNi40OUwxMTEuMSA3LjE2TDExMS44NCA3Ljg1TDExMi41NyA4LjU1TDExMy4yOSA5LjI3TDExNCAxMEwxMTQuNjkgMTAuNzNMMTE1LjM3IDExLjQ5TDExNi4wMyAxMi4yNUwxMTYuNjggMTMuMDJMMTE3LjMyIDEzLjgxTDExNy45NSAxNC42TDExOC41NiAxNS40MUwxMTkuMTUgMTYuMjNMMTE5Ljc0IDE3LjA2TDEyMC4zIDE3LjlMMTIwLjg2IDE4Ljc0TDEyMS40IDE5LjZMMTIxLjkyIDIwLjQ3TDEyMi40MyAyMS4zNEwxMjIuOTIgMjIuMjNMMTIzLjQgMjMuMTJMMTIzLjg2IDI0LjAyTDEyNC4zIDI0LjkzTDEyNC43MyAyNS44NUwxMjUuMTUgMjYuNzdMMTI1LjU0IDI3LjdMMTI1LjkyIDI4LjY0TDEyNi4yOSAyOS41OEwxMjYuNjQgMzAuNTRMMTI2Ljk3IDMxLjQ5TDEyNy4yOCAzMi40NUwxMjcuNTggMzMuNDJMMTI3Ljg2IDM0LjM5TDEyOC4xMiAzNS4zN0wxMjguMzcgMzYuMzVMMTI4LjM5IDM2LjQyTDEyOC40OCAzNi43NkwxMjguNTggMzcuMDlMMTI4LjY5IDM3LjQyTDEyOC44MiAzNy43NUwxMjguOTYgMzguMDdMMTI5LjEgMzguMzhMMTI5LjI2IDM4LjY5TDEyOS40MyAzOUwxMjkuNjEgMzkuM0wxMjkuOCAzOS41OUwxMzAgMzkuODhMMTMwLjIxIDQwLjE2TDEzMC40MyA0MC40M0wxMzAuNjYgNDAuNjlMMTMwLjkgNDAuOTVMMTMxLjE0IDQxLjE5TDEzMS40IDQxLjQzTDEzMS42NiA0MS42NkwxMzEuOTMgNDEuODhMMTMyLjIxIDQyLjA5TDEzMi41IDQyLjI5TDEzMi43OSA0Mi40OEwxMzMuMDkgNDIuNjZMMTMzLjQgNDIuODNMMTMzLjcxIDQyLjk5TDEzNC4wMiA0My4xNEwxMzQuMzQgNDMuMjdMMTM0LjY3IDQzLjRMMTM1IDQzLjUxTDEzNS4zMyA0My42MUwxMzUuNjcgNDMuN0wxMzYuMDEgNDMuNzhMMTM2LjM1IDQzLjg1TDEzNi43IDQzLjlMMTM3LjA1IDQzLjk1TDEzNy4zOSA0My45OEwxMzcuNzQgNDMuOTlMMTM4LjA5IDQ0WiIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==');
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
  box-shadow: var(--sn-mp-shadow-md);
  border: 8rpx solid var(--sn-tabbar-bar-bg, var(--sn-mp-color-background-surface));
  box-sizing: border-box;
}

/* Doodle skin — heavier label. */
.snui-skin-doodle .sn-tabbar-item__title {
  font-weight: var(--sn-mp-font-weight-bold);
}
</style>
