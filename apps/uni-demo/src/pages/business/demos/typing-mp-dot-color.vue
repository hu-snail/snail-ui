<script setup lang="ts">
/**
 * Demo: sn-typing (uni-end) — 圆点颜色：active-dot-color。
 */
import SnTyping from '@snui/uni-src/components/sn-typing/sn-typing.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="typing-row">
      <SnTyping text="" active-dot-color="var(--sn-mp-color-feedback-success)" />
      <SnTyping text="" active-dot-color="var(--sn-mp-color-feedback-warning)" />
      <SnTyping text="" active-dot-color="var(--sn-mp-color-feedback-danger)" />
    </view>
    <text class="sn-demo__meta">active-dot-color 主题色</text>
  </view>
</template>

<style scoped>
.typing-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--sn-mp-spacing-3);
}

.sn-demo__meta {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-tertiary);
}
</style>
