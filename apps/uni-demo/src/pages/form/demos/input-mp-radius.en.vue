<script setup lang="ts">
/** Demo: sn-input — radius presets (AUI additive, tiers map to --sn-mp-radius-*). */
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
</script>

<template>
  <view class="sn-input-demo">
    <SnInput model-value="default (12rpx, default)" radius="default" readonly />
    <SnInput model-value="sm (8rpx)" radius="sm" readonly />
    <SnInput model-value="lg (16rpx)" radius="lg" readonly />
    <SnInput model-value="xl (24rpx)" radius="xl" readonly />
    <SnInput model-value="pill (search-bar style)" radius="pill" readonly />
    <SnInput model-value="square (right-angled)" radius="square" readonly />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
