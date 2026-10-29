<script setup lang="ts">
/**
 * sn-backtop (uni-end) — floating "back to top" button.
 *
 * Reference library: wot-ui `wd-backtop`
 *   (https://wot-ui.cn/component/backtop.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-backtop 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * Additive beyond the reference surface (AUI-OPT-04, §112.3a):
 *   - `size`  — button + icon tier (small / medium / large); icon length is
 *     the `--sn-mp-icon-size-*` token so the glyph-to-button ratio stays
 *     coherent at every tier.
 *   - `theme` — semantic fill (default / primary / success / warning /
 *     danger / info); content flips to `--sn-mp-color-text-on-primary`.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-backtop/sn-backtop.vue
 * → auto-registered as `<sn-backtop>` in any .vue that uses it.
 *
 * ## Why the scroll position is a prop, not an internal listener
 *
 * miniprogram pages cannot read `window.scrollY`, and `uni.createSelectorQuery`
 * is async. wd-backtop therefore takes `scrollTop` from the host (the page's
 * own `onPageScroll` or a `scroll-view`'s `@scroll`), which also keeps the
 * component free of listeners it would have to dispose (§41). Scrolling back
 * up goes through `uni.pageScrollTo` when the runtime exposes it, falling back
 * to `scroll-view`'s own `scroll-top` via the same API name.
 *
 * ## Visibility threshold
 *
 * The button appears once `scrollTop` passes `top`. It is rendered (not
 * `v-if`'d away) so the fade transition can run, and hidden buttons ignore
 * taps — a zero-size hit target must not swallow touches.
 *
 * ## Overflow-proof content box (AUI-OPT-04)
 *
 * The root is a fixed-position flex column whose width shrinks to fit:
 * `min-width` carries the tier box (88rpx by default) so an icon-only button
 * stays a perfect square/circle, while a label grows the box instead of
 * spilling out of it. The label itself is capped with an ellipsis so no text
 * length can stretch the button across the screen. Padding uses spacing
 * tokens; per AGENTS.md §32 this component handles rendering + interaction
 * only.
 *
 * Not responsible for:
 *   - 页面滚动监听 — 由宿主页面 `onPageScroll` 提供 `scrollTop`
 *   - 回到顶部动画曲线 — 交给宿主的 `pageScrollTo`
 */

import { computed } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import { ArrowRight } from '../sn-icon/sn-icon-set';

defineOptions({ name: 'SnBacktop' });

/** Button tiers — box geometry lives in the scoped CSS per class below. */
type BacktopSize = 'small' | 'medium' | 'large';

/** Semantic fill themes; `default` keeps the neutral surface look. */
type BacktopTheme = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

/**
 * Icon length per tier, expressed as the mp icon-size token (§112.5 — no
 * fallback values). 28/32/40rpx inside a 72/88/104rpx box keeps the glyph at
 * ~0.36-0.39 of the button diameter at every tier.
 */
const ICON_SIZE_TOKEN: Record<BacktopSize, string> = {
  small: 'var(--sn-mp-icon-size-small)',
  medium: 'var(--sn-mp-icon-size-medium)',
  large: 'var(--sn-mp-icon-size-large)',
};

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-backtop` 1:1 surface ────────────────────────────────── */

    /** 页面滚动距离（由宿主提供）。 */
    scrollTop?: number;
    /** 按钮文字。 */
    text?: string;
    /** 滚动距离超过该值时显示按钮，单位为 px。 */
    top?: number;
    /** 返回顶部滚动时间，单位为 ms。 */
    duration?: number;
    /** 组件层级。 */
    zIndex?: number;
    /** 自定义图标样式。 */
    iconStyle?: string;
    /** 按钮形状：circle / square。 */
    shape?: 'circle' | 'square';
    /** 距离屏幕底部的距离，单位为 px。 */
    bottom?: number;
    /** 距离屏幕右侧的距离，单位为 px。 */
    right?: number;
    /** 自定义根节点样式。 */
    customStyle?: string;
    /** 自定义根节点样式类。 */
    customClass?: string;

    /* ── additive (AUI-OPT-04) ──────────────────────────────────────────── */

    /** 按钮尺寸档位；图标随档位取 `--sn-mp-icon-size-*` token。 */
    size?: BacktopSize;
    /** 按钮主题填充；内容色自动反转为 on-primary。 */
    theme?: BacktopTheme;
  }>(),
  {
    scrollTop: 0,
    text: '',
    top: 300,
    duration: 100,
    zIndex: 10,
    iconStyle: '',
    shape: 'circle',
    bottom: 100,
    right: 20,
    customStyle: '',
    customClass: '',
    size: 'medium',
    theme: 'default',
  },
);

const emit = defineEmits<{
  /** 点击按钮时触发（宿主也可自行调用 `pageScrollTo`）。 */
  (e: 'click', event: Event): void;
}>();

defineSlots<{
  /** 自定义按钮内容。 */
  default?(): unknown;
}>();

/** The button is visible only past the threshold. */
const isVisible = computed(() => props.scrollTop >= props.top);

/** Icon length for the active tier, as the `--sn-mp-icon-size-*` token. */
const iconSize = computed(() => ICON_SIZE_TOKEN[props.size]);

/**
 * Scroll the page back to the top.
 *
 * `uni.pageScrollTo` is the cross-end API; on H5 it maps to
 * `window.scrollTo`. When the host does not expose it (unit tests, some
 * embedded targets) the call is skipped — the component still emits `click`
 * so the host can scroll its own `scroll-view`.
 */
function scrollToTop(): void {
  if (!isVisible.value) return;
  const uni = (
    globalThis as {
      uni?: { pageScrollTo?: (opts: { scrollTop: number; duration: number }) => unknown };
    }
  ).uni;
  if (typeof uni?.pageScrollTo !== 'function') return;
  try {
    uni.pageScrollTo({ scrollTop: 0, duration: props.duration });
  } catch {
    /* A host that rejects the API must not break the tap handler. */
  }
}

function onTap(event: Event): void {
  if (!isVisible.value) return;
  scrollToTop();
  emit('click', event);
}

const rootClass = computed(() => [
  'sn-backtop',
  `sn-backtop--${props.shape}`,
  `sn-backtop--size-${props.size}`,
  `sn-backtop--theme-${props.theme}`,
  {
    'sn-backtop--visible': isVisible.value,
  },
  props.customClass,
]);

const rootStyle = computed(() => {
  const parts = [
    `bottom: ${props.bottom}px`,
    `right: ${props.right}px`,
    `z-index: ${props.zIndex}`,
  ];
  if (props.customStyle) parts.push(props.customStyle);
  return parts.join('; ');
});

const iconStyleComputed = computed(() => {
  /* The default glyph points right; rotate it to point up. */
  const base = 'transform: rotate(-90deg)';
  return props.iconStyle ? `${base}; ${props.iconStyle}` : base;
});
</script>

<template>
  <view
    data-snui-component="backtop"
    :class="rootClass"
    :style="rootStyle"
    role="button"
    :aria-label="text || 'Back to top'"
    :aria-hidden="!isVisible"
    :hover-class="isVisible ? 'sn-backtop--pressed' : 'none'"
    @tap="onTap"
  >
    <slot>
      <SnIcon class="sn-backtop__icon" :icon="ArrowRight" :size="iconSize" :style="iconStyleComputed" />
      <text v-if="text" class="sn-backtop__text">{{ text }}</text>
    </slot>
  </view>
</template>

<style scoped>
/*
 * uni side: --sn-mp-* aliases only; geometry in rpx (750 design canvas).
 * Theme slots are local custom properties so each theme class re-points
 * them without duplicating the chrome rules (and without var() fallbacks,
 * per AGENTS.md §112.5).
 */
.sn-backtop {
  --sn-backtop-bg: var(--sn-mp-color-background-surface);
  --sn-backtop-border: var(--sn-mp-color-border-default);
  --sn-backtop-fg: var(--sn-mp-color-text-primary);
  --sn-backtop-label: var(--sn-mp-color-text-secondary);
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  /* Width shrinks to fit; the tier class carries the square icon-only box. */
  min-width: 88rpx;
  height: 88rpx;
  padding: 0 var(--sn-mp-spacing-3);
  border: 2rpx solid var(--sn-backtop-border);
  background-color: var(--sn-backtop-bg);
  color: var(--sn-backtop-fg);
  box-shadow: var(--sn-mp-shadow-sm);
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.2s ease,
    visibility 0.2s ease;
}

/* Tiers — box geometry stays as rpx values (sn-button--circle convention). */
.sn-backtop--size-small {
  min-width: 72rpx;
  height: 72rpx;
}

.sn-backtop--size-large {
  min-width: 104rpx;
  height: 104rpx;
}

/* Semantic fills — same slot convention as sn-button filled variants. */
.sn-backtop--theme-primary {
  --sn-backtop-bg: var(--sn-mp-color-action-primary);
  --sn-backtop-fg: var(--sn-mp-color-text-on-primary);
  --sn-backtop-label: var(--sn-mp-color-text-on-primary);
  border-color: var(--sn-backtop-bg);
}

.sn-backtop--theme-success {
  --sn-backtop-bg: var(--sn-mp-color-feedback-success);
  --sn-backtop-fg: var(--sn-mp-color-text-on-primary);
  --sn-backtop-label: var(--sn-mp-color-text-on-primary);
  border-color: var(--sn-backtop-bg);
}

.sn-backtop--theme-warning {
  --sn-backtop-bg: var(--sn-mp-color-feedback-warning);
  --sn-backtop-fg: var(--sn-mp-color-text-on-primary);
  --sn-backtop-label: var(--sn-mp-color-text-on-primary);
  border-color: var(--sn-backtop-bg);
}

.sn-backtop--theme-danger {
  --sn-backtop-bg: var(--sn-mp-color-feedback-danger);
  --sn-backtop-fg: var(--sn-mp-color-text-on-primary);
  --sn-backtop-label: var(--sn-mp-color-text-on-primary);
  border-color: var(--sn-backtop-bg);
}

.sn-backtop--theme-info {
  --sn-backtop-bg: var(--sn-mp-color-feedback-info);
  --sn-backtop-fg: var(--sn-mp-color-text-on-primary);
  --sn-backtop-label: var(--sn-mp-color-text-on-primary);
  border-color: var(--sn-backtop-bg);
}

.sn-backtop--circle {
  border-radius: var(--sn-mp-radius-full);
}

.sn-backtop--square {
  border-radius: var(--sn-mp-radius-md);
}

.sn-backtop--visible {
  opacity: 1;
  visibility: visible;
}

/* Press feedback rides hover-class (§116.2 — App has no :active pseudo). */
.sn-backtop--visible.sn-backtop--pressed {
  opacity: 0.7;
}

.sn-backtop__icon {
  color: var(--sn-backtop-fg);
}

.sn-backtop__text {
  /* Block: uni <text> is inline, and ellipsis needs a real box to clip. */
  display: block;
  /* Cap + ellipsis: a long label shrinks, it can never stretch the button. */
  max-width: 200rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: var(--sn-mp-spacing-1);
  color: var(--sn-backtop-label);
  font-size: var(--sn-mp-font-size-xs);
  line-height: 1;
}

/* Doodle skin — heavier outline. */
.snui-skin-doodle .sn-backtop {
  border-width: 4rpx;
  border-color: var(--sn-mp-color-text-primary);
}
</style>
