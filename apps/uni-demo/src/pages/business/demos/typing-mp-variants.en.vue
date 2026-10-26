<script setup lang="ts">
/**
 * Demo: sn-typing (uni-end) — Variant matrix: label on/off / dot count /
 * pulse speed / dot color.
 */
import SnTyping from '@snui/uni-src/components/sn-typing/sn-typing.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">text="" (dots only)</text>
    <SnTyping text="" />

    <text class="sn-demo__title">dot-count 1 / 3 / 5</text>
    <view class="typing-row">
      <SnTyping text="" :dot-count="1" />
      <SnTyping text="" :dot-count="3" />
      <SnTyping text="" :dot-count="5" />
    </view>

    <text class="sn-demo__title">speed 180ms (fast) vs 600ms (slow)</text>
    <view class="typing-row">
      <SnTyping text="Fast" :speed="180" />
      <SnTyping text="Slow" :speed="600" />
    </view>

    <text class="sn-demo__title">active-dot-color themes</text>
    <view class="typing-row">
      <SnTyping text="" active-dot-color="var(--sn-mp-color-feedback-success)" />
      <SnTyping text="" active-dot-color="var(--sn-mp-color-feedback-warning)" />
      <SnTyping text="" active-dot-color="var(--sn-mp-color-feedback-danger)" />
    </view>
    <text class="sn-demo__meta">Dot count clamps to 1-5; speed is one dot's pulse period</text>
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
