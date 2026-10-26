<script setup lang="ts">
/**
 * sn-divider (uni-end) — visual separator for mobile / miniprogram.
 *
 * Reference library: wot-ui `wd-divider`
 *   (https://wot-ui.cn/component/divider.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-divider 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * `direction` / `marginSize` are additive AUI hooks (wd-divider has no axis or
 * margin prop); `vertical` is the wd-divider name for the same axis and both
 * render the vertical variant.
 * Per Spec-02 v1.1 §3 (end: mp), uni-side component CSS uses only
 * `--sn-mp-*` aliases (rpx units). The `end: mp` marker in
 * ai-description.md is consumed by `@snui/cli` and MCP tools for
 * per-end filtering.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-divider/sn-divider.vue
 * → auto-registered as `<sn-divider>` in any .vue that uses it.
 *
 * Usage:
 *   <sn-divider />
 *   <sn-divider direction="vertical" />
 *   <sn-divider dashed hairline>OR</sn-divider>
 *
 * Not responsible for:
 *   - 复杂布局（用 sn-cell / sn-list）
 *   - 装饰图标 / 动画
 */

import { computed } from 'vue';

defineOptions({ name: 'SnDivider' });

const props = withDefaults(
  defineProps<{
    /** Axis: horizontal (full-width line) or vertical (inline line). */
    direction?: 'horizontal' | 'vertical';
    /** Dashed instead of solid. */
    dashed?: boolean;
    /** Hairline (0.5px-like thin line) — mobile common. Default true. */
    hairline?: boolean;
    /** Optional color override (CSS color value). */
    color?: string;
    /** Vertical margin (only for horizontal direction). */
    marginSize?: 'small' | 'medium' | 'large';
    /** Content position along the line (`wd-divider` `content-position`). */
    contentPosition?: 'left' | 'center' | 'right';
    /**
     * Vertical separator (`wd-divider` `vertical`). Equivalent to
     * `direction: 'vertical'`; either one renders the vertical variant.
     */
    vertical?: boolean;
    /** Extra class on the root node (`wd-divider` `custom-class`). */
    customClass?: string;
    /** Extra inline style on the root node (`wd-divider` `custom-style`). */
    customStyle?: string | Record<string, string>;
  }>(),
  {
    direction: 'horizontal',
    dashed: false,
    hairline: true,
    color: '',
    marginSize: 'medium',
    contentPosition: 'center',
    vertical: false,
    customClass: '',
    customStyle: '',
  },
);

defineSlots<{
  /** Optional text shown on the horizontal line (e.g. "OR"). */
  default?(): unknown;
}>();

/** `vertical` and `direction: 'vertical'` are the same axis. */
const isVertical = computed(() => props.vertical || props.direction === 'vertical');

const orientation = computed<'horizontal' | 'vertical'>(() =>
  isVertical.value ? 'vertical' : 'horizontal',
);

/**
 * Root `:style` — the dashed/colour border declarations plus `customStyle`.
 * Returned as an array so Vue normalizes both a CSS string and a
 * `Record<string, string>` (camelCase keys included) itself.
 */
const rootStyle = computed(() => {
  const border: Record<string, string> = {
    borderTopStyle: props.dashed ? 'dashed' : 'solid',
    borderLeftStyle: props.dashed ? 'dashed' : 'solid',
  };
  if (props.color) border.borderColor = props.color;
  return [border, props.customStyle];
});
</script>

<template>
  <view
    role="separator"
    :aria-orientation="orientation"
    :class="[
      'sn-divider',
      `sn-divider--${orientation}`,
      `sn-divider--margin-${marginSize}`,
      hairline ? 'sn-divider--hairline' : '',
      dashed ? 'sn-divider--dashed' : '',
      !isVertical && $slots.default ? `sn-divider--content-${contentPosition}` : '',
      !isVertical && $slots.default ? 'sn-divider--with-text' : '',
      customClass,
    ]"
    :style="rootStyle"
  >
    <text v-if="$slots.default && !isVertical" class="sn-divider__text">
      <slot />
    </text>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-divider {
  background: transparent;
}

.sn-divider--horizontal {
  display: flex;
  align-items: center;
  width: 100%;
  border-top: 2rpx solid var(--sn-mp-color-border-default);
}

.sn-divider--horizontal.sn-divider--hairline {
  border-top-width: 1rpx;
}

.sn-divider--vertical {
  display: inline-block;
  align-self: stretch;
  height: 1em;
  margin: 0 16rpx;
  border-left: 2rpx solid var(--sn-mp-color-border-default);
  vertical-align: middle;
}

.sn-divider--vertical.sn-divider--hairline {
  border-left-width: 1rpx;
}

.sn-divider--horizontal.sn-divider--margin-small {
  margin: 16rpx 0;
}

.sn-divider--horizontal.sn-divider--margin-medium {
  margin: 32rpx 0;
}

.sn-divider--horizontal.sn-divider--margin-large {
  margin: 48rpx 0;
}

/* Content position — the line spans the full width and the slot text masks it
 * where it sits, so aligning the text is what moves the visible gap. */
.sn-divider--content-left {
  justify-content: flex-start;
}

.sn-divider--content-right {
  justify-content: flex-end;
}

.sn-divider--content-left .sn-divider__text {
  padding-left: 0;
  padding-right: 24rpx;
}

.sn-divider--content-right .sn-divider__text {
  padding-left: 24rpx;
  padding-right: 0;
}

.sn-divider__text {
  padding: 0 24rpx;
  color: var(--sn-mp-color-text-secondary);
  font-size: 28rpx;
  background: var(--sn-mp-color-background-surface);
}

/* Doodle skin. */
.snui-skin-doodle .sn-divider--horizontal {
  border-top-width: 5rpx;
  border-top-color: #1a1a1a;
  border-top-style: dashed;
}
.snui-skin-doodle .sn-divider--vertical {
  border-left-width: 5rpx;
  border-left-color: #1a1a1a;
  border-left-style: dashed;
}
.snui-skin-doodle .sn-divider__text {
  padding: 4rpx 20rpx;
  border: 4rpx solid #1a1a1a;
  border-radius: 20rpx 4rpx / 4rpx 20rpx;
  font-weight: 700;
  background: var(--sn-mp-color-background-surface);
  box-shadow: 4rpx 4rpx 0 #1a1a1a;
}
</style>
