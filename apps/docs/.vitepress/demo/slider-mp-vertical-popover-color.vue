<script setup lang="ts">
/**
 * Demo: sn-slider — vertical / popoverVisible / activeColor / inactiveColor。
 *
 * `vertical` 把轨道竖起来（默认高度 400rpx）；`popover-visible` 取
 * `always` / `normal` / `never` 控制数值气泡；`active-color` / `inactive-color`
 * 覆盖已填充与未填充轨道颜色。
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
        <text class="sn-demo__label">默认气泡</text>
      </view>
      <view class="sn-demo__col">
        <SnSlider v-model="bubble" vertical popover-visible="always" />
        <text class="sn-demo__label">always</text>
      </view>
    </view>
    <text class="sn-demo__meta">vertical 竖排轨道；popoverVisible 默认只在拖动时显示，always 常驻</text>

    <SnSlider v-model="never" popover-visible="never" />
    <text class="sn-demo__meta">popoverVisible="never"：拖动时也不显示数值气泡</text>

    <SnSlider
      v-model="colored"
      active-color="var(--sn-mp-color-feedback-success)"
      inactive-color="var(--sn-mp-color-background-sunken)"
    />
    <text class="sn-demo__meta">activeColor / inactiveColor 覆盖已填充 / 未填充轨道色</text>

    <SnSlider
      v-model="styled"
      custom-class="sn-demo__slider"
      custom-style="padding: 8rpx 16rpx; border-radius: var(--sn-mp-radius-md); background-color: var(--sn-mp-color-background-soft);"
    />
    <text class="sn-demo__meta">customClass / customStyle 落在根节点上（边框来自类名，底色来自内联样式）</text>
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
/* custom-class 落在 sn-slider 根节点上，需要 :deep 穿透组件边界。 */
.sn-demo :deep(.sn-demo__slider) {
  border: 2rpx solid var(--sn-mp-color-border-subtle);
}
</style>
