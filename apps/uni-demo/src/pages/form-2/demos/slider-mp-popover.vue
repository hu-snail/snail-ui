<script setup lang="ts">
/** Demo: sn-slider — 数值气泡：popoverVisible 取 always / normal / never 控制数值气泡。 */
import { ref } from 'vue';
import SnSlider from '@snui/uni-src/components/sn-slider/sn-slider.vue';

const bubble = ref(40);
const never = ref(70);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__row">
      <view class="sn-demo__col">
        <SnSlider v-model="bubble" vertical popover-visible="always" />
        <text class="sn-demo__label">always</text>
      </view>
    </view>
    <text class="sn-demo__meta">popoverVisible 默认只在拖动时显示，always 常驻</text>

    <SnSlider v-model="never" popover-visible="never" />
    <text class="sn-demo__meta">popoverVisible="never"：拖动时也不显示数值气泡</text>
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
.sn-demo__row {
  display: flex;
  align-items: flex-start;
  gap: 48rpx;
  padding: 8rpx 0;
}
.sn-demo__col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  min-width: 96rpx;
}
.sn-demo__label {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
