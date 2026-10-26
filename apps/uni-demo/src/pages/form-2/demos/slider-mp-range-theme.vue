<script setup lang="ts">
/** Demo: sn-slider — range 双滑块返回 [start, end]；marks 支持对象形式；theme="capsule" 加粗轨道；disabled 拦掉拖动。 */
import { ref } from 'vue';
import SnSlider from '@snui/uni-src/components/sn-slider/sn-slider.vue';

const pair = ref<number[]>([20, 60]);
const capsule = ref(60);
const locked = ref(50);
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
    <text class="sn-demo__meta">区间：{{ pair[0] }} - {{ pair[1] }}</text>
    <SnSlider v-model="capsule" theme="capsule" />
    <SnSlider v-model="locked" disabled />
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
