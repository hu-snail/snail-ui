<script setup lang="ts">
/** Demo: sn-slider — sn-slider 单滑块：min / max / step 控制范围与步长，showExtremeValue 显示两端文案。 */
import { ref } from 'vue';
import SnSlider from '@snui/uni-src/components/sn-slider/sn-slider.vue';

const value = ref(40);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSlider v-model="value" :min="0" :max="100" :step="5" show-extreme-value />
    <text class="sn-demo__meta">当前值：{{ value }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
