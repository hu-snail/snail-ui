<script setup lang="ts">
/**
 * sn-navbar (uni-end) — top navigation bar for mobile / miniprogram.
 *
 * Reference library: wot-ui `wd-navbar`
 *   (https://wot-ui.cn/component/navbar.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-navbar 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-navbar/sn-navbar.vue
 * → auto-registered as `<sn-navbar>` in any .vue that uses it.
 *
 * ## Why `placeholder` renders a sibling, not a child
 *
 * `fixed` takes the bar out of flow, so the page content jumps up by the bar
 * height. wd-navbar's `placeholder` contract is "reserve the same height in
 * the original position", which on uni means a sibling `<view>` of identical
 * height before the bar. It is `aria-hidden` because it carries no meaning.
 *
 * ## Safe area
 *
 * `safeAreaInsetTop` adds the status-bar height as `padding-top`. The uni-app
 * runtime exposes it as `--status-bar-height`; the fallback keeps the design
 * canvas rhythm (44rpx) on targets that do not define it.
 *
 * Per AGENTS.md §32, this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 页面路由 / 返回栈 — 由宿主 AppBridge 处理，组件只 emit 事件
 *   - 标签栏 — 用 sn-tabbar
 *   - 侧边导航 — 用 sn-sidebar
 */

import { computed, useSlots } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import { ArrowLeft } from '../sn-icon/sn-icon-set';

defineOptions({ name: 'SnNavbar' });

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-navbar` 1:1 surface ─────────────────────────────────── */

    /** 标题文字。 */
    title?: string;
    /** 左侧文案。 */
    leftText?: string;
    /** 右侧文案。 */
    rightText?: string;
    /** 是否显示左侧返回箭头。 */
    leftArrow?: boolean;
    /** 是否显示下边框。 */
    bordered?: boolean;
    /** 是否固定到顶部。 */
    fixed?: boolean;
    /** 固定到顶部时，是否在原位置生成一个等高的占位元素。 */
    placeholder?: boolean;
    /** 导航栏 z-index。 */
    zIndex?: number;
    /** 是否开启顶部安全区适配。 */
    safeAreaInsetTop?: boolean;
    /** 是否禁用左侧按钮（透明度降低且不触发事件）。 */
    leftDisabled?: boolean;
    /** 是否禁用右侧按钮（透明度降低且不触发事件）。 */
    rightDisabled?: boolean;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: string;
  }>(),
  {
    title: '',
    leftText: '',
    rightText: '',
    leftArrow: false,
    bordered: false,
    fixed: false,
    placeholder: false,
    zIndex: 10,
    safeAreaInsetTop: false,
    leftDisabled: false,
    rightDisabled: false,
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  /** 点击左侧按钮时触发。 */
  (e: 'click-left', event: Event): void;
  /** 点击右侧按钮时触发。 */
  (e: 'click-right', event: Event): void;
  /** 点击返回（左侧箭头）按钮时触发。 */
  (e: 'back', event: Event): void;
  /** 点击胶囊区域时触发（微信小程序返回首页语义）。 */
  (e: 'back-home', event: Event): void;
}>();

defineSlots<{
  /** 自定义胶囊（存在时 left 插槽不生效）。 */
  capsule?(): unknown;
  /** 左侧内容。 */
  left?(): unknown;
  /** 标题内容。 */
  title?(): unknown;
  /** 右侧内容。 */
  right?(): unknown;
}>();

const slots = useSlots();

/** Left zone renders only when it actually carries something. */
const hasLeft = computed(() => props.leftArrow || props.leftText !== '' || !!slots.left);
/** Right zone renders only when it actually carries something. */
const hasRight = computed(() => props.rightText !== '' || !!slots.right);

function onLeftTap(event: Event): void {
  if (props.leftDisabled) {
    event.stopPropagation();
    return;
  }
  emit('click-left', event);
  if (props.leftArrow) emit('back', event);
}

function onRightTap(event: Event): void {
  if (props.rightDisabled) {
    event.stopPropagation();
    return;
  }
  emit('click-right', event);
}

function onCapsuleTap(event: Event): void {
  emit('back-home', event);
}

const rootClass = computed(() => [
  'sn-navbar',
  {
    'sn-navbar--fixed': props.fixed,
    'sn-navbar--bordered': props.bordered,
    'sn-navbar--safe-area': props.safeAreaInsetTop,
    'sn-navbar--left-disabled': props.leftDisabled,
    'sn-navbar--right-disabled': props.rightDisabled,
  },
  props.customClass,
]);

const rootStyle = computed(() => {
  const parts: string[] = [];
  if (props.fixed) parts.push(`z-index: ${props.zIndex}`);
  if (props.customStyle) parts.push(props.customStyle);
  return parts.length > 0 ? parts.join('; ') : undefined;
});
</script>

<template>
  <view v-if="fixed && placeholder" class="sn-navbar__placeholder" aria-hidden="true" />
  <view
    data-snui-component="navbar"
    :class="rootClass"
    :style="rootStyle"
    role="navigation"
    :aria-label="title || undefined"
  >
    <view v-if="$slots.capsule" class="sn-navbar__capsule" @tap="onCapsuleTap">
      <slot name="capsule" />
    </view>

    <view
      v-else-if="hasLeft"
      class="sn-navbar__side sn-navbar__left"
      role="button"
      :aria-disabled="leftDisabled"
      :aria-label="leftText || 'Back'"
      :hover-class="leftDisabled ? 'none' : 'sn-navbar__side--pressed'"
      @tap="onLeftTap"
    >
      <slot name="left">
        <SnIcon v-if="leftArrow" class="sn-navbar__arrow" :icon="ArrowLeft" :size="36" />
        <text v-if="leftText" class="sn-navbar__text">{{ leftText }}</text>
      </slot>
    </view>

    <view class="sn-navbar__center">
      <slot name="title">
        <text class="sn-navbar__title">{{ title }}</text>
      </slot>
    </view>

    <view
      v-if="hasRight"
      class="sn-navbar__side sn-navbar__right"
      role="button"
      :aria-disabled="rightDisabled"
      :aria-label="rightText || 'Action'"
      :hover-class="rightDisabled ? 'none' : 'sn-navbar__side--pressed'"
      @tap="onRightTap"
    >
      <slot name="right">
        <text v-if="rightText" class="sn-navbar__text">{{ rightText }}</text>
      </slot>
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only; geometry in rpx (750 design canvas). */
.sn-navbar {
  position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 88rpx;
  padding: 0 var(--sn-mp-spacing-3);
  background-color: var(--sn-mp-color-background-surface);
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-lg);
}

.sn-navbar--fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}

.sn-navbar--safe-area {
  height: auto;
  min-height: 88rpx;
  padding-top: var(--status-bar-height, 44rpx);
}

.sn-navbar--bordered {
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle);
}

.sn-navbar__placeholder {
  width: 100%;
  height: 88rpx;
}

.sn-navbar__side {
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: var(--sn-mp-spacing-1);
  max-width: 30%;
  padding: 0 var(--sn-mp-spacing-3);
  font-size: var(--sn-mp-font-size-md);
  color: var(--sn-mp-color-action-primary);
}

.sn-navbar--safe-area .sn-navbar__side {
  padding-top: var(--status-bar-height, 44rpx);
}

.sn-navbar__left {
  left: 0;
}

.sn-navbar__right {
  right: 0;
  justify-content: flex-end;
}

/* Press feedback rides hover-class (§116.2 — App has no :active pseudo). */
.sn-navbar__side--pressed {
  opacity: 0.6;
}

.sn-navbar--left-disabled .sn-navbar__left,
.sn-navbar--right-disabled .sn-navbar__right {
  opacity: 0.4;
}

.sn-navbar__capsule {
  position: absolute;
  top: 0;
  bottom: 0;
  left: var(--sn-mp-spacing-3);
  display: flex;
  align-items: center;
}

.sn-navbar__arrow {
  color: inherit;
}

.sn-navbar__center {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  overflow: hidden;
}

.sn-navbar__title {
  max-width: 60%;
  overflow: hidden;
  font-size: var(--sn-mp-font-size-lg);
  font-weight: var(--sn-mp-font-weight-medium);
  color: var(--sn-mp-color-text-primary);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.sn-navbar__text {
  overflow: hidden;
  color: inherit;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* Doodle skin — heavier rule under the bar. */
.snui-skin-doodle .sn-navbar {
  border-bottom: 4rpx solid var(--sn-mp-color-text-primary);
  font-weight: var(--sn-mp-font-weight-bold);
}
</style>
