<script setup lang="ts">
/** Demo: sn-slider — range & marks: `range` returns a `[start, end]` pair; `marks` accepts a record. */
import { ref } from 'vue';
import SnSlider from '@snui/uni-src/components/sn-slider/sn-slider.vue';

const pair = ref<number[]>([20, 60]);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSlider
      v-model="pair"
      range
      :min="0"
      :max="100"
      :step="10"
      :marks="{ 0: '0', 50: '50', 100: '100' }"
    />
    <text class="sn-demo__meta">Range: {{ pair[0] }} - {{ pair[1] }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
