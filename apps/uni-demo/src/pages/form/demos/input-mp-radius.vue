<script setup lang="ts">
/** Demo: sn-input — radius 圆角档位（AUI 追加，档位映射 --sn-mp-radius-*）。 */
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
</script>

<template>
  <view class="sn-input-demo">
    <SnInput model-value="default（12rpx，默认）" radius="default" readonly />
    <SnInput model-value="sm（8rpx）" radius="sm" readonly />
    <SnInput model-value="lg（16rpx）" radius="lg" readonly />
    <SnInput model-value="xl（24rpx）" radius="xl" readonly />
    <SnInput model-value="pill（胶囊，搜索条常用）" radius="pill" readonly />
    <SnInput model-value="square（直角）" radius="square" readonly />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
