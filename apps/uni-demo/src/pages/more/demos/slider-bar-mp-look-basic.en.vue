<script setup lang="ts">
/**
 * Demo: sn-slider-bar — 参考风格：主题色描边圆盘把手 + 胶囊轨道。
 * 对应参考图「Volume 48」——标题 + 读数在轨道上方，轨道浅灰、填充主题色，
 * 把手为白色圆盘描主题色环（默认风格，无需额外 prop）。
 */
import { ref } from 'vue';
import SnSliderBar from '@snui/uni-src/components/sn-slider-bar/sn-slider-bar.vue';

const volume = ref(48);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="look-head">
      <text class="look-head__label">Volume</text>
      <text class="look-head__value">{{ volume }}</text>
    </view>
    <SnSliderBar v-model="volume" aria-label="Volume" />
    <text class="sn-demo__meta">volume = {{ volume }}</text>
  </view>
</template>

<style scoped>
.look-head {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}
.look-head__label {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-primary);
}
.look-head__value {
  font-size: 32rpx;
  font-weight: 500;
  color: var(--sn-mp-color-text-tertiary);
}
.sn-demo__meta {
  margin-top: 16rpx;
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
