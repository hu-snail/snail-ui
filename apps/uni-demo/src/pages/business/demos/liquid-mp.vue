<script setup lang="ts">
/**
 * Demo: sn-liquid (uni-end) — 水波进度球：基础 + 渐增交互 + outline。
 */
import { ref } from 'vue';
import SnLiquid from '@snui/uni-src/components/sn-liquid/sn-liquid.vue';

const percent = ref(30);

function addPercent(): void {
  percent.value = (percent.value + 20) % 120;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__row">
      <SnLiquid :percent="percent" :duration="600" @update:current="() => undefined" />
      <SnLiquid :percent="68" outline size="180rpx" />
      <SnLiquid :percent="90" wave-color="var(--sn-mp-color-feedback-success)" />
    </view>
    <text class="sn-demo__meta">左球点击下方按钮涨水；中球 outline 外圈；右球自定义波浪色</text>
    <view class="sn-demo__button" :hover-class="'sn-demo__button--down'" @tap="addPercent">
      <text class="sn-demo__button-text">进度 +20（当前 {{ percent }}%）</text>
    </view>
  </view>
</template>

<style scoped>
.sn-demo__button {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 16rpx 32rpx;
  border-radius: 40rpx;
  background-color: var(--sn-mp-color-action-primary);
}

.sn-demo__button--down {
  opacity: 0.85;
}

.sn-demo__button-text {
  color: var(--sn-mp-color-text-on-primary);
  font-size: var(--sn-mp-font-size-sm);
}
</style>
