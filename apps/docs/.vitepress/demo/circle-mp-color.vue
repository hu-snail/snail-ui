<script setup lang="ts">
/**
 * Demo: sn-circle (uni-end) — solid / gradient / custom track colors.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-circle from its SFC source.
 */
import SnCircle from '@snui/uni-src/components/sn-circle/sn-circle.vue'
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-circle-demo__row">
      <SnCircle :model-value="60" :size="120" color="var(--sn-mp-color-feedback-success)" />
      <SnCircle :model-value="60" :size="120" color="var(--sn-mp-color-feedback-warning)" />
      <SnCircle :model-value="60" :size="120" color="var(--sn-mp-color-feedback-danger)" />
    </view>

    <view class="sn-circle-demo__row">
      <SnCircle
        :model-value="70"
        :size="140"
        :color="{ '0%': 'var(--sn-mp-color-action-primary)', '100%': 'var(--sn-mp-color-feedback-success)' }"
      />
      <SnCircle
        :model-value="45"
        :size="140"
        layer-color="var(--sn-mp-color-background-sunken)"
        fill="var(--sn-mp-color-background-soft)"
      />
      <SnCircle :model-value="45" :size="140" :clockwise="false" />
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
