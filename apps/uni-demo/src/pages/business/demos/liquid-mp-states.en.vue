<script setup lang="ts">
/**
 * Demo: sn-liquid (uni-end) — States and edges: 0 / 100 / out-of-range
 * clamping / duration=0 instant vs slow / custom center slot.
 */
import { ref } from 'vue';
import SnLiquid from '@snui/uni-src/components/sn-liquid/sn-liquid.vue';

const percent = ref(50);
const current = ref(50);

function jumpTo(next: number): void {
  percent.value = next;
}
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="liquid-row">
      <SnLiquid :percent="0" size="140rpx" />
      <SnLiquid :percent="100" size="140rpx" />
      <SnLiquid :percent="150" size="140rpx" />
    </view>
    <text class="sn-demo__meta">0% empty / 100% full / out-of-range 150 clamped to 100</text>

    <text class="sn-demo__title">duration=0 instant vs duration=1200 slow</text>
    <view class="liquid-row">
      <SnLiquid :percent="percent" :duration="0" size="140rpx" />
      <SnLiquid :percent="percent" :duration="1200" size="140rpx" />
    </view>

    <text class="sn-demo__title">Custom center slot</text>
    <view class="liquid-row">
      <SnLiquid v-model:current="current" :percent="percent" :duration="600" size="160rpx">
        <view class="liquid-center">
          <text class="liquid-center__value">{{ Math.round(current) }}%</text>
          <text class="liquid-center__label">done</text>
        </view>
      </SnLiquid>
    </view>

    <view class="liquid-actions">
      <view class="liquid-actions__btn" hover-class="liquid-actions__btn--down" @tap="jumpTo(0)">
        <text class="liquid-actions__btn-text">0</text>
      </view>
      <view class="liquid-actions__btn" hover-class="liquid-actions__btn--down" @tap="jumpTo(30)">
        <text class="liquid-actions__btn-text">30</text>
      </view>
      <view class="liquid-actions__btn" hover-class="liquid-actions__btn--down" @tap="jumpTo(100)">
        <text class="liquid-actions__btn-text">100</text>
      </view>
      <view class="liquid-actions__btn" hover-class="liquid-actions__btn--down" @tap="jumpTo(150)">
        <text class="liquid-actions__btn-text">150</text>
      </view>
    </view>
    <text class="sn-demo__meta"
      >Buttons drive the three balls below; transitioning current: {{ Math.round(current) }}</text
    >
  </view>
</template>

<style scoped>
.liquid-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--sn-mp-spacing-4);
}

.liquid-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.liquid-center__value {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-lg);
  font-weight: var(--sn-mp-font-weight-bold);
}

.liquid-center__label {
  margin-top: 4rpx;
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
}

.liquid-actions {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: var(--sn-mp-spacing-3);
}

.liquid-actions__btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100rpx;
  padding: 14rpx 0;
  border-radius: 32rpx;
  background-color: var(--sn-mp-color-background-subtle);
}

.liquid-actions__btn--down {
  opacity: 0.8;
}

.liquid-actions__btn-text {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-sm);
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
