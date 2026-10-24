<script setup lang="ts">
/** Demo: sn-tour — step-by-step guide. */
import { ref } from 'vue'
import SnTour from '@snui/uni-src/components/sn-tour/sn-tour.vue'

const visible = ref(false)
const current = ref(0)
const steps = [
  { content: 'This is the home overview with your key metrics.' },
  { content: 'Tap here to create a new task.' },
  { content: 'Settings let you change theme and notifications.' },
]
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__button" @tap="visible = true">Start the guide</text>
    <text class="sn-demo__meta">Step {{ current + 1 }} of {{ steps.length }}</text>
    <SnTour v-model="visible" v-model:current="current" :steps="steps" />
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.sn-demo__button {
  align-self: flex-start;
  padding: 6px 12px;
  border: 1px solid var(--sn-mp-color-action-primary);
  border-radius: 8rpx;
  font-size: 24rpx;
  color: var(--sn-mp-color-action-primary);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
