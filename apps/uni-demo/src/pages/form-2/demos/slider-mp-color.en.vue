<script setup lang="ts">
/** Demo: sn-slider — track colors: `activeColor` / `inactiveColor` override the filled and unfilled track colors. */
import { ref } from 'vue';
import SnSlider from '@snui/uni-src/components/sn-slider/sn-slider.vue';

const colored = ref(55);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSlider
      v-model="colored"
      active-color="var(--sn-mp-color-feedback-success)"
      inactive-color="var(--sn-mp-color-background-sunken)"
    />
    <text class="sn-demo__meta"
      >activeColor / inactiveColor override the filled / unfilled track colors</text
    >
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  align-items: stretch;
  width: 100%;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
