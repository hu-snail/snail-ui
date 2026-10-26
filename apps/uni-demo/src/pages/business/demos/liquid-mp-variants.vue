<script setup lang="ts">
/**
 * Demo: sn-liquid (uni-end) — 变体矩阵：尺寸 / outline 外圈 / radius 圆角 /
 * waveColor 波色 / innerColor 球内底色。
 */
import SnLiquid from '@snui/uni-src/components/sn-liquid/sn-liquid.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">size 120 / 160 / 200rpx</text>
    <view class="liquid-row">
      <SnLiquid :percent="40" size="120rpx" />
      <SnLiquid :percent="60" size="160rpx" />
      <SnLiquid :percent="80" size="200rpx" />
    </view>

    <text class="sn-demo__title">outline 外圈</text>
    <view class="liquid-row">
      <SnLiquid :percent="55" outline size="160rpx" />
      <SnLiquid :percent="55" size="160rpx" />
    </view>

    <text class="sn-demo__title">radius="32rpx"（方圆容器）</text>
    <view class="liquid-row">
      <SnLiquid :percent="70" radius="32rpx" size="160rpx" />
    </view>

    <text class="sn-demo__title">waveColor / innerColor 主题色</text>
    <view class="liquid-row">
      <SnLiquid
        :percent="45"
        size="140rpx"
        wave-color="var(--sn-mp-color-feedback-success)"
        inner-color="var(--sn-mp-color-feedback-success-soft)"
      />
      <SnLiquid
        :percent="65"
        size="140rpx"
        wave-color="var(--sn-mp-color-feedback-warning)"
        inner-color="var(--sn-mp-color-feedback-warning-soft)"
      />
      <SnLiquid
        :percent="85"
        size="140rpx"
        wave-color="var(--sn-mp-color-feedback-danger)"
        inner-color="var(--sn-mp-color-feedback-danger-soft)"
      />
    </view>
    <text class="sn-demo__meta">波浪色与球内底色成对配置（soft 色做水面以上区域）</text>
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
