<script setup lang="ts">
/**
 * Demo: sn-typing (uni-end) — 变体矩阵：文案开关 / 圆点数量 / 脉动速度 /
 * 圆点颜色。
 */
import SnTyping from '@snui/uni-src/components/sn-typing/sn-typing.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">text=""（只显示圆点）</text>
    <SnTyping text="" />

    <text class="sn-demo__title">dot-count 1 / 3 / 5</text>
    <view class="typing-row">
      <SnTyping text="" :dot-count="1" />
      <SnTyping text="" :dot-count="3" />
      <SnTyping text="" :dot-count="5" />
    </view>

    <text class="sn-demo__title">speed 180ms（快）vs 600ms（慢）</text>
    <view class="typing-row">
      <SnTyping text="快速" :speed="180" />
      <SnTyping text="慢速" :speed="600" />
    </view>

    <text class="sn-demo__title">active-dot-color 主题色</text>
    <view class="typing-row">
      <SnTyping text="" active-dot-color="var(--sn-mp-color-feedback-success)" />
      <SnTyping text="" active-dot-color="var(--sn-mp-color-feedback-warning)" />
      <SnTyping text="" active-dot-color="var(--sn-mp-color-feedback-danger)" />
    </view>
    <text class="sn-demo__meta">圆点数量被夹取到 1-5；速度即单个圆点的脉动周期</text>
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

.sn-demo__title {
  font-size: var(--sn-mp-font-size-sm);
  font-weight: var(--sn-mp-font-weight-semibold);
  color: var(--sn-mp-color-text-secondary);
}

.sn-demo__meta {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-tertiary);
}
</style>
