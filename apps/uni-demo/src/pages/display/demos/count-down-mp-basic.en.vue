<script setup lang="ts">
/**
 * Demo: sn-count-down (uni-end) — default format + custom formats.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-count-down from its SFC source.
 */
import { ref } from 'vue';
import SnCountDown from '@snui/uni-src/components/sn-count-down/sn-count-down.vue';

const finished = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnCountDown :time="3600000" format="HH:mm:ss" />
    <SnCountDown :time="3723000" format="HH:mm:ss" />
    <SnCountDown :time="90061000" format="DD d HH:mm:ss" />

    <view class="sn-count-down-demo__row">
      <text class="sn-count-down-demo__label">Flash sale ends in</text>
      <SnCountDown :time="300000" format="mm:ss" @finish="finished = true" />
    </view>
    <text class="sn-count-down-demo__meta">
      {{ finished ? 'The countdown finished' : 'Counting down…' }}
    </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-count-down-demo__row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8rpx;
}
.sn-count-down-demo__label {
  font-size: 26rpx;
  color: var(--vp-c-text-2);
}
.sn-count-down-demo__meta {
  font-size: 24rpx;
  color: var(--vp-c-text-2);
}
</style>
