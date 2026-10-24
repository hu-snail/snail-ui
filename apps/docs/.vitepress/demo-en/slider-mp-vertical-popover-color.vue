<script setup lang="ts">
/**
 * Demo: sn-slider — vertical / popoverVisible / activeColor / inactiveColor.
 *
 * `vertical` stands the track up (400rpx tall by default); `popover-visible`
 * takes `always` / `normal` / `never` for the value bubble; `active-color` /
 * `inactive-color` override the filled and unfilled track colors.
 */
import { ref } from 'vue'
import SnSlider from '@snui/uni-src/components/sn-slider/sn-slider.vue'

const upright = ref(60)
const bubble = ref(40)
const never = ref(70)
const colored = ref(55)
const styled = ref(45)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__row">
      <view class="sn-demo__col">
        <SnSlider v-model="upright" vertical :min="0" :max="100" />
        <text class="sn-demo__label">default bubble</text>
      </view>
      <view class="sn-demo__col">
        <SnSlider v-model="bubble" vertical popover-visible="always" />
        <text class="sn-demo__label">always</text>
      </view>
    </view>
    <text class="sn-demo__meta">vertical track; popoverVisible shows only while dragging by default, "always" keeps it on</text>

    <SnSlider v-model="never" popover-visible="never" />
    <text class="sn-demo__meta">popoverVisible="never": no value bubble even while dragging</text>

    <SnSlider
      v-model="colored"
      active-color="var(--sn-mp-color-feedback-success)"
      inactive-color="var(--sn-mp-color-background-sunken)"
    />
    <text class="sn-demo__meta">activeColor / inactiveColor override the filled / unfilled track colors</text>

    <SnSlider
      v-model="styled"
      custom-class="sn-demo__slider"
      custom-style="padding: 8rpx 16rpx; border-radius: var(--sn-mp-radius-md); background-color: var(--sn-mp-color-background-soft);"
    />
    <text class="sn-demo__meta">customClass / customStyle land on the root (border from the class, fill from the inline style)</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: stretch;
  width: 100%;
}
.sn-demo__row {
  display: flex;
  align-items: flex-start;
  gap: 32rpx;
}
.sn-demo__col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
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
/* custom-class lands on the sn-slider root, so :deep pierces the component boundary. */
.sn-demo :deep(.sn-demo__slider) {
  border: 2rpx solid var(--sn-mp-color-border-subtle);
}
</style>
