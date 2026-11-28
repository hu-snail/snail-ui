<script setup lang="ts">
/** Demo: sn-slider — 主题：theme="capsule" 加粗轨道。 */
import { ref } from 'vue';
import SnSlider from '@snui/uni-src/components/sn-slider/sn-slider.vue';

const capsule = ref(60);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSlider v-model="capsule" theme="capsule" />
    <text class="sn-demo__meta">theme="capsule"：胶囊加粗轨道</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
