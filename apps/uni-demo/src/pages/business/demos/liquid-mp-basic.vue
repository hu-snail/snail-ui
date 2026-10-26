<script setup lang="ts">
/**
 * Demo: sn-liquid (uni-end) — 基础用法：percent 驱动水位，v-model:current
 * 实时回读过渡值。
 */
import { ref } from 'vue';
import SnLiquid from '@snui/uni-src/components/sn-liquid/sn-liquid.vue';

const percent = ref(30);
const current = ref(30);

function step(delta: number): void {
  percent.value = Math.min(100, Math.max(0, percent.value + delta));
}
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="liquid-stage">
      <SnLiquid v-model:current="current" :percent="percent" :duration="600" size="200rpx" />
    </view>
    <text class="sn-demo__meta">percent={{ percent }} · 过渡值 current={{ current }}</text>
    <view class="liquid-actions">
      <view class="liquid-actions__btn" hover-class="liquid-actions__btn--down" @tap="step(-10)">
        <text class="liquid-actions__btn-text">-10</text>
      </view>
      <view class="liquid-actions__btn" hover-class="liquid-actions__btn--down" @tap="step(10)">
        <text class="liquid-actions__btn-text">+10</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.liquid-stage {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.liquid-actions {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: var(--sn-mp-spacing-3);
}

.liquid-actions__btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 120rpx;
  padding: 14rpx 0;
  border-radius: 32rpx;
  background-color: var(--sn-mp-color-action-primary);
}

.liquid-actions__btn--down {
  opacity: 0.85;
}

.liquid-actions__btn-text {
  color: var(--sn-mp-color-text-on-primary);
  font-size: var(--sn-mp-font-size-sm);
}

.sn-demo__meta {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-tertiary);
}
</style>
