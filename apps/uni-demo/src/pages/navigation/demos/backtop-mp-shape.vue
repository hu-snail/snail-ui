<script setup lang="ts">
/** Demo: sn-backtop — 圆形 / 方形与自定义位置。 */
import { ref } from 'vue';
import SnBacktop from '@snui/uni-src/components/sn-backtop/sn-backtop.vue';

const scrollTop = ref(500);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__meta">shape=square、bottom=160、right=40</text>
    <SnBacktop :scroll-top="scrollTop" shape="square" :bottom="160" :right="40" :duration="300" />
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
