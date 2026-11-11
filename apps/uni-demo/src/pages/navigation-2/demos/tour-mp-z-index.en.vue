<script setup lang="ts">
/**
 * Demo: sn-tour — English shadow of tour-mp-z-index.
 */
import { ref } from 'vue';
import SnTour from '@snui/uni-src/components/sn-tour/sn-tour.vue';

const visible = ref(false);
const current = ref(0);
const steps = [{ content: 'duration=150 + z-index=60.' }, { content: 'Second step.' }];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__stage">
      <text class="sn-demo__button" @tap="visible = true">Open guide</text>

      <SnTour
        v-model="visible"
        v-model:current="current"
        :steps="steps"
        :duration="150"
        :z-index="60"
        custom-class="sn-demo-contained"
      />
    </view>

    <text class="sn-demo__meta"
      >duration=150 overrides the animation length; z-index=60 lifts the layer.</text
    >
  </view>
</template>

<style scoped>
.sn-demo__stage {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  align-items: flex-start;
  min-height: 320rpx;
  padding: var(--sn-mp-spacing-4);
  overflow: hidden;
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-surface);
}
.sn-demo__button {
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-4);
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-sm);
  font-size: 24rpx;
  color: var(--sn-mp-color-text-primary);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
/* Docs-preview only — pin the fixed guide layer to the stage. */
.sn-demo__stage :deep(.sn-tour.sn-demo-contained) {
  position: absolute;
}
</style>
