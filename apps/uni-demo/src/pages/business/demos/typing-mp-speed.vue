<script setup lang="ts">
/**
 * Demo: sn-typing (uni-end) — 脉动速度：speed。
 */
import SnTyping from '@snui/uni-src/components/sn-typing/sn-typing.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="typing-row">
      <SnTyping text="快速" :speed="180" />
      <SnTyping text="慢速" :speed="600" />
    </view>
    <text class="sn-demo__meta">speed 180ms vs 600ms（单个圆点的脉动周期）</text>
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
