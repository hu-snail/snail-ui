<script setup lang="ts">
/**
 * Demo: sn-slider-bar — 把手形状与尺寸：knob-shape="circle" + knob-size。
 *
 * 五个把手共用同一个值（拖动任意一个，其余同步停在同一点）——同一位置下
 * 直接对比轮廓与直径，不必来回拖动：
 * - 圆形 circle：真正的正圆，宽高相等、圆角 50%（默认尺寸跟随轨道厚度）；
 * - knob-size 56 / 32：显式直径（数字按 rpx，也接受 "28px"）；
 * - 方形 square：圆角方块，边长等于轨道厚度；
 * - 胶囊 pill：竖长药丸，比轨道窄。
 */
import { ref } from 'vue';
import SnSliderBar from '@snui/uni-src/components/sn-slider-bar/sn-slider-bar.vue';

const volume = ref(52);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="look-head">
      <text class="look-head__label">圆形 circle</text>
      <text class="look-head__value">{{ volume }}</text>
    </view>
    <SnSliderBar v-model="volume" knob-shape="circle" aria-label="Circle knob" />

    <view class="look-head">
      <text class="look-head__label">圆形 + knob-size 56</text>
    </view>
    <SnSliderBar
      v-model="volume"
      knob-shape="circle"
      :knob-size="56"
      aria-label="Circle knob, 56 rpx"
    />

    <view class="look-head">
      <text class="look-head__label">圆形 + knob-size 32</text>
    </view>
    <SnSliderBar
      v-model="volume"
      knob-shape="circle"
      :knob-size="32"
      aria-label="Circle knob, 32 rpx"
    />

    <view class="look-head">
      <text class="look-head__label">方形 square</text>
    </view>
    <SnSliderBar v-model="volume" knob-shape="square" aria-label="Square knob" />

    <view class="look-head">
      <text class="look-head__label">胶囊 pill</text>
    </view>
    <SnSliderBar v-model="volume" knob-shape="pill" aria-label="Pill knob" />
  </view>
</template>

<style scoped>
.look-head {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 28rpx;
  margin-bottom: 20rpx;
}
.look-head__label {
  font-size: 28rpx;
  font-weight: 500;
  color: var(--sn-mp-color-text-secondary);
}
.look-head__value {
  font-size: 28rpx;
  font-weight: 500;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
