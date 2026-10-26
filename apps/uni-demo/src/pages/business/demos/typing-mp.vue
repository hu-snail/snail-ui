<script setup lang="ts">
/**
 * Demo: sn-typing (uni-end) — 输入中：默认文案 / 自定义文案 / 自定义圆点色。
 */
import SnTyping from '@snui/uni-src/components/sn-typing/sn-typing.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__row">
      <SnTyping />
      <SnTyping text="思考中" />
      <SnTyping text="" :dot-count="4" active-dot-color="var(--sn-mp-color-feedback-success)" />
    </view>
    <text class="sn-demo__meta">聊天气泡场景：等待回复时以 typing 气泡占位</text>
    <view class="bubble">
      <SnTyping text="对方正在输入…" :speed="280" />
    </view>
  </view>
</template>

<style scoped>
.bubble {
  align-self: flex-start;
  border-radius: 20rpx 20rpx 20rpx 4rpx;
  background-color: var(--sn-mp-color-background-subtle);
}
</style>
