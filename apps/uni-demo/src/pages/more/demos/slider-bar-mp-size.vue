<script setup lang="ts">
/** Demo: sn-slider-bar — 尺寸：size="small" / size="large"。 */
import { ref } from 'vue';
import SnSliderBar from '@snui/uni-src/components/sn-slider-bar/sn-slider-bar.vue';

const volume = ref(64);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">尺寸 small / large</text>
    <SnSliderBar v-model="volume" size="small" show-value />
    <SnSliderBar v-model="volume" size="large" show-value />
  </view>
</template>

<style scoped>
.sn-demo__title {
  margin-top: 20rpx;
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
