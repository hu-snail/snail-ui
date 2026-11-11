<script setup lang="ts">
/**
 * Demo: sn-typing (uni-end) — Pulse speed: `speed`.
 */
import SnTyping from '@snui/uni-src/components/sn-typing/sn-typing.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="typing-row">
      <SnTyping text="Fast" :speed="180" />
      <SnTyping text="Slow" :speed="600" />
    </view>
    <text class="sn-demo__meta">speed 180ms vs 600ms (per-dot pulse period)</text>
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
