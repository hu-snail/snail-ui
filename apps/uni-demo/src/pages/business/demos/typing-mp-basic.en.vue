<script setup lang="ts">
/**
 * Demo: sn-typing (uni-end) — Basic usage: default text and the chat-bubble
 * placeholder scenario.
 */
import SnTyping from '@snui/uni-src/components/sn-typing/sn-typing.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnTyping />
    <text class="sn-demo__meta">Default "typing" label + 3 pulsing dots</text>

    <text class="sn-demo__title">Chat bubble scenario</text>
    <view class="chat">
      <view class="chat__bubble chat__bubble--peer">
        <SnTyping text="The other side is typing…" :speed="280" />
      </view>
    </view>
    <text class="sn-demo__meta">Use the typing bubble while waiting; unmount it once the reply arrives</text>
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
