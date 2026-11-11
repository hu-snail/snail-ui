<script setup lang="ts">
/** Demo: sn-segmented — English shadow of segmented-mp-theme. */
import { ref } from 'vue';
import SnSegmented from '@snui/uni-src/components/sn-segmented/sn-segmented.vue';

const theme = ref('outline');
const options = [
  { value: 'card', label: 'Card' },
  { value: 'outline', label: 'Outline' },
];
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSegmented v-model="theme" :options="options" theme="outline" />
    <text class="sn-demo__meta"
      >theme=outline gives the outlined look; object options carry labels.</text
    >
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
