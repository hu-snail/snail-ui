<script setup lang="ts">
/** Demo: sn-slider — Single-knob slider: min / max / step drive the range and granularity; showExtremeValue renders both end captions. */
import { ref } from 'vue'
import SnSlider from '@snui/uni-src/components/sn-slider/sn-slider.vue'

const value = ref(40)
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSlider v-model="value" :min="0" :max="100" :step="5" show-extreme-value />
    <text class="sn-demo__meta">Value: {{ value }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
