<script setup lang="ts">
/**
 * sn-divider (uni-end) — visual separator for mobile / miniprogram.
 *
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

defineOptions({ name: 'SnDivider' })

const props = withDefaults(
  defineProps<{
    /** Axis: horizontal (full-width line) or vertical (inline line). */
    direction?: 'horizontal' | 'vertical'
    /** Dashed instead of solid. */
    dashed?: boolean
    /** Hairline (0.5px-like thin line) — mobile common. Default true. */
    hairline?: boolean
    /** Optional color override (CSS color value). */
    color?: string
    /** Vertical margin (only for horizontal direction). */
    marginSize?: 'small' | 'medium' | 'large'
  }>(),
  {
    direction: 'horizontal',
    dashed: false,
    hairline: true,
    color: '',
    marginSize: 'medium',
  },
)

defineSlots<{
  /** Optional text shown on the horizontal line (e.g. "OR"). */
  default?(): unknown
}>()
</script>

<template>
  <view
    role="separator"
    :aria-orientation="direction === 'vertical' ? 'vertical' : 'horizontal'"
    :class="[
      'sn-divider',
      `sn-divider--${direction}`,
      `sn-divider--margin-${marginSize}`,
      hairline ? 'sn-divider--hairline' : '',
      dashed ? 'sn-divider--dashed' : '',
      $slots.default ? 'sn-divider--with-text' : '',
    ]"
    :style="{ borderTopStyle: dashed ? 'dashed' : 'solid', borderLeftStyle: dashed ? 'dashed' : 'solid', borderColor: color || undefined }"
  >
    <text v-if="$slots.default && direction === 'horizontal'" class="sn-divider__text">
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

.sn-divider--margin-small {
  margin: 16rpx 0;
}

.sn-divider--margin-medium {
  margin: 32rpx 0;
}

.sn-divider--margin-large {
  margin: 48rpx 0;
}

.sn-divider__text {
  padding: 0 24rpx;
  color: var(--sn-mp-color-text-secondary);
  font-size: 28rpx;
  background: var(--sn-mp-color-background-surface);
}
</style>