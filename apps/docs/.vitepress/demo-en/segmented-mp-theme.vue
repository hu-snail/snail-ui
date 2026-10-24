<script setup lang="ts">
/** Demo: sn-segmented — outline theme, object options and disabled states. */
import { ref } from 'vue'
import SnSegmented from '@snui/uni-src/components/sn-segmented/sn-segmented.vue'

const theme = ref('card')
const options = [
  { value: 'card', label: 'Card' },
  { value: 'outline', label: 'Outline' },
  { value: 'locked', label: 'Disabled', disabled: true },
]
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSegmented v-model="theme" :options="options" theme="outline" />
    <SnSegmented :options="options" disabled />
    <text class="sn-demo__meta">theme=outline; object options; control-level disabled</text>
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
