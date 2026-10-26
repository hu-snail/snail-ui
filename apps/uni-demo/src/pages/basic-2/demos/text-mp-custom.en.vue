<script setup lang="ts">
/**
 * Demo: sn-text (uni-end) — custom-class / custom-style and the three slots.
 *
 * What the props cannot express, the slots can: `default` overrides `text`,
 * `prefix` / `suffix` override their props — so a slot can hold any cross-end
 * node, not just a string.
 */
import SnText from '@snui/uni-src/components/sn-text/sn-text.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnText
      custom-class="sn-demo__highlight"
      custom-style="padding: 4rpx 12rpx; border-radius: var(--sn-mp-radius-sm);"
      text="custom-class + custom-style land on the root node"
    />
    <text class="sn-demo__meta"
      >The root carries both sn-text and sn-demo__highlight; the inline style overrides padding and
      radius.</text
    >

    <SnText type="primary" bold>
      <template #prefix>
        <text class="sn-demo__tag">NEW</text>
      </template>
      The default slot wins over text
      <template #suffix>
        <text class="sn-demo__suffix">→</text>
      </template>
    </SnText>
    <text class="sn-demo__meta">The prefix / suffix slots hold nodes, not strings.</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: stretch;
  width: 100%;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* custom-class lands on the sn-text root, so reaching it needs :deep. */
.sn-demo :deep(.sn-demo__highlight) {
  display: block;
  background-color: var(--sn-mp-color-action-primary-soft);
  color: var(--sn-mp-color-action-primary);
  font-weight: var(--sn-mp-font-weight-semibold);
}
.sn-demo__tag {
  margin-right: var(--sn-mp-spacing-1);
  padding: 0 var(--sn-mp-spacing-1);
  border-radius: var(--sn-mp-radius-xs);
  background-color: var(--sn-mp-color-feedback-danger-soft);
  color: var(--sn-mp-color-feedback-danger);
  font-size: var(--sn-mp-font-size-xs);
}
.sn-demo__suffix {
  margin-left: var(--sn-mp-spacing-1);
  color: var(--sn-mp-color-action-primary);
  font-size: var(--sn-mp-font-size-sm);
}
</style>
