<script setup lang="ts">
/**
 * Demo: sn-typing (uni-end) — 基础用法：默认文案 + 聊天气泡占位场景。
 */
import SnTyping from '@snui/uni-src/components/sn-typing/sn-typing.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnTyping />
    <text class="sn-demo__meta">默认文案「输入中」+ 3 个脉动圆点</text>

    <text class="sn-demo__title">聊天气泡场景</text>
    <view class="chat">
      <view class="chat__bubble chat__bubble--peer">
        <SnTyping text="对方正在输入…" :speed="280" />
      </view>
    </view>
    <text class="sn-demo__meta">等待回复时以 typing 气泡占位，回复到达后由宿主卸载</text>
  </view>
</template>

<style scoped>
.chat {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-2);
}

.chat__bubble--peer {
  align-self: flex-start;
  border-radius: 20rpx 20rpx 20rpx 4rpx;
  background-color: var(--sn-mp-color-background-subtle);
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
