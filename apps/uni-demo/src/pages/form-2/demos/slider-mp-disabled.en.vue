<script setup lang="ts">
/** Demo: sn-slider — disabled: dragging is blocked. */
import { ref } from 'vue';
import SnSlider from '@snui/uni-src/components/sn-slider/sn-slider.vue';

const locked = ref(50);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSlider v-model="locked" disabled />
    <text class="sn-demo__meta">disabled: drags are ignored, the value stays {{ locked }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
