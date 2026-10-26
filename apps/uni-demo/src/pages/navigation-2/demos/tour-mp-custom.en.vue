<script setup lang="ts">
/** Demo: sn-tour — custom copy and mask-tap advance. */
import { ref } from 'vue';
import SnTour from '@snui/uni-src/components/sn-tour/sn-tour.vue';

const visible = ref(false);
const current = ref(0);
const steps = [
  { content: 'Tapping the mask also advances to the next step.' },
  { content: 'On the last step the button turns into "Finish".' },
];
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__button" @tap="visible = true">Open (mask tap advances)</text>
    <SnTour
      v-model="visible"
      v-model:current="current"
      :steps="steps"
      click-mask-next
      prev-text="Back"
      next-text="Continue"
      skip-text="Don't show again"
      finish-text="Finish"
      :border-radius="12"
    />
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
</style>
