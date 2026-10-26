<script setup lang="ts">
/**
 * Demo: sn-circle (uni-end) — progress values and sizes.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-circle from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnCircle from '@snui/uni-src/components/sn-circle/sn-circle.vue';

const percent = ref(30);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-circle-demo__row">
      <SnCircle :model-value="0" :size="120" />
      <SnCircle :model-value="30" :size="120" />
      <SnCircle :model-value="70" :size="120" />
      <SnCircle :model-value="100" :size="120" />
    </view>

    <view class="sn-circle-demo__row">
      <SnCircle :model-value="percent" :size="80" :stroke-width="10" />
      <SnCircle :model-value="percent" :size="140" :stroke-width="22" />
      <SnCircle :model-value="percent" :size="180" text="完成" />
    </view>

    <view class="sn-circle-demo__row">
      <SnButton size="small" @tap="percent = Math.max(0, percent - 10)">-10</SnButton>
      <SnButton size="small" @tap="percent = Math.min(100, percent + 10)">+10</SnButton>
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.sn-circle-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
  align-items: center;
}
</style>
