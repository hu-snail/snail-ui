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
 * ## Default back navigation (`autoBack`)
 *
 * Tapping the back arrow performs the platform back navigation itself, so the
 * host does not need per-end `window.history` / `uni.navigateBack` branches:
 *
 *   - every end (H5 / MP / App / uni-app x) goes through the static
 *     `uni.navigateBack` call — the uni compiler bundles only statically
 *     visible router APIs (see src/uni-env.d.ts);
 *   - when the page stack holds just the current page (page opened directly /
 *     refreshed), `navigateBack` is skipped (H5 clamps delta to 0 and reloads
 *     the page) and `backFallback` is reLaunched instead, when provided.
 *
 * The `back` event still fires first, so a host that owns the transition keeps
 * listening and sets `:auto-back="false"` to opt out (AGENTS.md §112.3a
 * additive capability; wd-navbar only emits).
 *
 * ## Built-in MP capsule (`mpCapsule`, AUI additive)
 *
 * A WeChat mini-program page with custom navigation carries the «返回 + 首页»
 * capsule on the left — WeChat draws the right system capsule itself, but the
 * left one is the page's job. Instead of hand-drawing it per page (as the
 * `#capsule` slot requires), the bar renders a built-in capsule whenever it
 * detects the MP environment (a measured system capsule) and the host filled
 * neither the `#capsule` slot nor the left zone. The back half reuses the
 * `autoBack` / `backFallback` navigation; the home half emits `back-home`.
 * The pill mirrors the system capsule's quiet look: faint border, secondary
 * icon colour. Set `:mp-capsule="false"` to opt out.
 *
 * Not responsible for:
 *   - 标签栏 — 用 sn-tabbar
 *   - 侧边导航 — 用 sn-sidebar
 */

import { computed, useSlots } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import { ChevronLeft, Home } from '../sn-icon/sn-icon-set';
import { getCapsuleMetrics } from '../../utils/capsule';

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
    /**
     * AUI 追加（wd-navbar 无）：点击返回箭头时由组件自己完成跨端返回
     * （页面栈有上一页 → `uni.navigateBack`；只有当前页 → `backFallback`）。
     *
     * 宿主想自行接管返回时传 `false`（仍会收到 `back` / `click-left` 事件）。
     */
    autoBack?: boolean;
    /**
     * AUI 追加（wd-navbar 无）：页面栈没有上一页（直接打开内页 / 刷新后栈
     * 重建）时的兜底页面，经 `uni.reLaunch` 打开。空串 = 不做兜底。
     */
    backFallback?: string;
    /**
     * AUI 追加（wd-navbar 无）：小程序环境下自动渲染内置「返回 + 首页」胶囊。
     * 仅当运行环境实测到系统胶囊（微信小程序）、且宿主未提供 `#capsule` 插槽、
     * 左侧区域为空时生效；返回键复用 `autoBack` / `backFallback` 返回逻辑，
     * 首页键发 `back-home`。传 `false` 关闭。
     */
    mpCapsule?: boolean;
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
    autoBack: true,
    backFallback: '',
    mpCapsule: true,
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

/** Launch-stable MP status-bar / capsule metrics (zeros on H5 / App). */
const capsule = getCapsuleMetrics();

/** Left zone renders only when it actually carries something. */
const hasLeft = computed(() => props.leftArrow || props.leftText !== '' || !!slots.left);
/** Right zone renders only when it actually carries something. */
const hasRight = computed(() => props.rightText !== '' || !!slots.right);

/**
 * 内置小程序胶囊：实测到系统胶囊（= 微信小程序环境）且宿主没有自定义胶囊
 * 插槽、左侧区域为空时自动渲染。胶囊是小程序自定义导航的固定件，宿主不应
 * 每页手画；`mpCapsule: false` 退出，或提供 `#capsule` / 左侧内容即被取代。
 */
const showBuiltinCapsule = computed(
  () => props.mpCapsule && capsule.hasCapsule && !slots.capsule && !hasLeft.value,
);

/** 页面栈深度；宿主未暴露 `getCurrentPages` 时返回 0（栈深度未知）。 */
function pageStackDepth(): number {
  if (typeof getCurrentPages !== 'function') return 0;
  try {
    return getCurrentPages().length;
  } catch {
    return 0;
  }
}

/**
 * 默认跨端返回（`autoBack`）：静态 `uni.*` 调用，uni-app 编译器才会把路由
 * API 打进产物；`window` / `globalThis.uni` 动态查找在 App / uni-app x 上
 * 不存在（App 端没有 window），会导致点击静默失效。
 *
 * 栈里只有当前页时不调用 `navigateBack` —— H5 会把 delta 钳到 0
 * （`router.go(0)`）整页 reload，改走 `backFallback`。
 */
function navigateBackByDefault(): void {
  if (typeof uni === 'undefined' || typeof uni.navigateBack !== 'function') return;
  const depth = pageStackDepth();
  if (depth > 1 || depth === 0) {
    uni.navigateBack({ delta: 1 });
    return;
  }
  if (props.backFallback !== '' && typeof uni.reLaunch === 'function') {
    uni.reLaunch({ url: props.backFallback });
  }
}

function onLeftTap(event: Event): void {
  if (props.leftDisabled) {
    event.stopPropagation();
    return;
  }
  emit('click-left', event);
  if (!props.leftArrow) return;
  emit('back', event);
  if (props.autoBack) navigateBackByDefault();
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

/**
 * 内置胶囊的返回键：与 `leftArrow` 同一条返回契约（先发 `back`，再按
 * `autoBack` 跨端返回），但不发 `click-left` —— 胶囊不是左侧文案区。
 */
function onBuiltinBackTap(event: Event): void {
  emit('back', event);
  if (props.autoBack) navigateBackByDefault();
}

/** 内置胶囊的首页键：只发 `back-home`，跳不跳转由宿主决定（与插槽一致）。 */
function onBuiltinHomeTap(event: Event): void {
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
  // MP: `--status-bar-height` does not exist in WXSS, so the safe-area variant
  // would fall back to 44rpx (half the real inset). Use the measured status
  // bar in px and let min-height keep the 88rpx nav row (box-sizing: border-box).
  if (props.safeAreaInsetTop && capsule.statusBarHeight > 0) {
    parts.push(`padding-top: ${capsule.statusBarHeight}px`);
    parts.push(`min-height: calc(${capsule.statusBarHeight}px + 88rpx)`);
    // Absolute side slots span the padding box — feed them the same inset.
    parts.push(`--sn-navbar-safe-top: ${capsule.statusBarHeight}px`);
  }
  // Clear the WeChat capsule: the content box (centered title) shrinks and the
  // right slot's anchor moves left via --sn-navbar-capsule-pad.
  if (props.safeAreaInsetTop && capsule.hasCapsule) {
    parts.push(`padding-right: ${capsule.capsulePadRight}px`);
    parts.push(`--sn-navbar-capsule-pad: ${capsule.capsulePadRight}px`);
  }
  if (props.customStyle) parts.push(props.customStyle);
  return parts.length > 0 ? parts.join('; ') : undefined;
});

/**
 * MP placeholder must mirror the bar's total border-box height: measured
 * status-bar padding + the 88rpx nav row. Views are globally
 * `box-sizing: border-box` (uvue.wxss), so `height: auto; min-height: 88rpx;
 * padding-top: Npx` collapses an empty placeholder to `max(88rpx, Npx)` —
 * the nav row is eaten by the padding and first-screen content slides under
 * the fixed bar. An explicit calc height keeps placeholder === bar regardless
 * of the title slot's content. H5 / App keep the CSS `--status-bar-height`
 * path (the measured value is 0 there).
 */
const placeholderStyle = computed(() =>
  props.safeAreaInsetTop && capsule.statusBarHeight > 0
    ? { height: `calc(${capsule.statusBarHeight}px + 88rpx)` }
    : undefined,
);
</script>

<template>
  <view
    v-if="fixed && placeholder"
    class="sn-navbar__placeholder"
    :class="{ 'sn-navbar__placeholder--safe-area': safeAreaInsetTop }"
    :style="placeholderStyle"
    aria-hidden="true"
  />
  <view
    data-snui-component="navbar"
    :class="rootClass"
    :style="rootStyle"
    role="navigation"
    :aria-label="title || undefined"
  >
    <view
      v-if="$slots.capsule || showBuiltinCapsule"
      class="sn-navbar__capsule"
      @tap="onCapsuleTap"
    >
      <slot name="capsule" />
      <!-- 内置胶囊：实测到小程序系统胶囊且宿主未自定义时自动渲染。按键 stop
           冒泡——容器 @tap 是插槽的 back-home 契约，内置返回键不发它。 -->
      <view v-if="showBuiltinCapsule" class="sn-navbar__mp-capsule">
        <view
          class="sn-navbar__mp-capsule-btn"
          role="button"
          aria-label="Back"
          @tap.stop="onBuiltinBackTap"
        >
          <SnIcon :icon="ChevronLeft" :size="36" />
        </view>
        <view class="sn-navbar__mp-capsule-rule" aria-hidden="true" />
        <view
          class="sn-navbar__mp-capsule-btn"
          role="button"
          aria-label="Home"
          @tap.stop="onBuiltinHomeTap"
        >
          <SnIcon :icon="Home" :size="32" />
        </view>
      </view>
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
        <SnIcon
          v-if="leftArrow"
          class="sn-navbar__arrow"
          :icon="ChevronLeft"
          size="44rpx"
          :stroke-width="2.5"
        />
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
  /* border-box：min-height 必须含状态栏 padding，否则导航行被吃掉（见占位注释） */
  min-height: calc(var(--status-bar-height, 44rpx) + 88rpx);
  padding-top: var(--status-bar-height, 44rpx);
}

.sn-navbar--bordered {
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle);
}

.sn-navbar__placeholder {
  width: 100%;
  height: 88rpx;
}

/* safe-area 开启时占位元素镜像导航栏自身的盒子（88rpx + 状态栏 padding）：
 * 全局 border-box 下 `min-height: 88rpx; padding-top: Npx` 的空元素高度是
 * max(88rpx, Npx) 而不是 Npx + 88rpx——导航行被 padding 吃掉，MP 真机首屏
 * 内容会被压进导航栏下方。min-height 必须按 calc(状态栏 + 88rpx) 预留，
 * MP 实测路径由 placeholderStyle 直接给显式总高。 */
.sn-navbar__placeholder--safe-area {
  height: auto;
  min-height: calc(var(--status-bar-height, 44rpx) + 88rpx);
  padding-top: var(--status-bar-height, 44rpx);
}

.sn-navbar__side {
  position: absolute;
  top: 0;
  bottom: 0;
  /* 中心标题区是 width:100% 的普通流元素，DOM 里排在侧区之后，H5 上会整块
   * 盖住绝对定位的左右按钮（点击落不到 onLeftTap）。侧区必须显式抬层。 */
  z-index: 1;
  display: flex;
  align-items: center;
  gap: var(--sn-mp-spacing-1);
  max-width: 30%;
  padding: 0 var(--sn-mp-spacing-3);
  font-size: var(--sn-mp-font-size-md);
  color: var(--sn-mp-color-action-primary);
}

.sn-navbar--safe-area .sn-navbar__side {
  padding-top: var(--sn-navbar-safe-top, var(--status-bar-height, 44rpx));
}

.sn-navbar__left {
  left: 0;
}

.sn-navbar__right {
  right: 0;
  justify-content: flex-end;
}

/* MP capsule-safe inset: `right` is set inline on the bar via the custom
 * property (absolute children ignore the root's padding-right). */
.sn-navbar--safe-area .sn-navbar__right {
  right: var(--sn-navbar-capsule-pad, 0);
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
  /* 同侧区：抬到中心标题区之上，否则 H5 上胶囊点击被标题容器拦截。 */
  z-index: 1;
  display: flex;
  align-items: center;
}

/* 内置小程序胶囊（AUI 追加）：对齐微信系统胶囊的安静观感——极淡描边 +
 * 次级图标色，不再复用侧区的 action-primary 强调色。 */
.sn-navbar__mp-capsule {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 64rpx;
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-surface);
  color: var(--sn-mp-color-text-secondary);
}

.sn-navbar__mp-capsule-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68rpx;
  height: 100%;
}

.sn-navbar__mp-capsule-rule {
  width: 2rpx;
  height: 32rpx;
  background-color: var(--sn-mp-color-border-subtle);
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
