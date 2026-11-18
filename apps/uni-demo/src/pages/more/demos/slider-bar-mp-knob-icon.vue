<script setup lang="ts">
/**
 * Demo: sn-slider-bar — 把手图标 × 把手形状。
 *
 * `knob-icon` 接受任意 sn-icon 名称（registry → 内置目录 111 个 → Provider），
 * 图标画在把手正中、默认取把手的描边色，所以换主题/换形状都不必再管它：
 * - circle / square / pill / round：图标跟着把手轮廓走，短边缩到 56%；
 * - heart + knob-icon-color：只改字形颜色，不动把手描边；
 * - theme="ocean" + check：字形颜色跟随主题（不传 knob-icon-color）；
 * - knob-icon-size="12px"：显式字号（数字按 rpx，"12px" 原样）。
 * 最后一对比的是「端部行为」：默认 `overlap` 时把手中心压在轨道端头上、
 * 与轨道端盖重叠；`knob-align="inset"` 时整个把手缩进轨道内、与端盖齐平。
 * 六行共用同一个值：拖动任意一行，其余把手同步停在同一位置。
 */
import { ref } from 'vue';
import SnSliderBar from '@snui/uni-src/components/sn-slider-bar/sn-slider-bar.vue';

const circle = ref(48);
const square = ref(64);
const pill = ref(72);
const round = ref(36);
const ocean = ref(58);
const sized = ref(80);
const inset = ref(100);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="look-head">
      <text class="look-head__label">circle + star</text>
      <text class="look-head__value">{{ circle }}</text>
    </view>
    <SnSliderBar
      v-model="circle"
      knob-shape="circle"
      knob-icon="star"
      aria-label="Circle knob with a star"
    />

    <view class="look-head">
      <text class="look-head__label">square + plus</text>
    </view>
    <SnSliderBar
      v-model="square"
      knob-shape="square"
      knob-icon="plus"
      aria-label="Square knob with a plus"
    />

    <view class="look-head">
      <text class="look-head__label">pill + heart（自定义颜色）</text>
    </view>
    <SnSliderBar
      v-model="pill"
      knob-shape="pill"
      :knob-size="52"
      knob-icon="heart"
      knob-icon-color="#f43f5e"
      aria-label="Pill knob with a heart"
    />

    <view class="look-head">
      <text class="look-head__label">round + minus（默认轮廓）</text>
      <text class="look-head__value">{{ round }}</text>
    </view>
    <SnSliderBar v-model="round" knob-icon="minus" aria-label="Round knob with a minus" />

    <view class="look-head">
      <text class="look-head__label">theme=ocean + check（跟随主题色）</text>
      <text class="look-head__value">{{ ocean }}</text>
    </view>
    <SnSliderBar
      v-model="ocean"
      theme="ocean"
      knob-shape="circle"
      knob-icon="check"
      aria-label="Ocean slider with a check"
    />

    <view class="look-head">
      <text class="look-head__label">knob-icon-size="12px"</text>
      <text class="look-head__value">{{ sized }}</text>
    </view>
    <SnSliderBar
      v-model="sized"
      knob-shape="circle"
      knob-icon="trending-up"
      knob-icon-size="12px"
      aria-label="Circle knob with an explicit icon size"
    />

    <view class="look-head">
      <text class="look-head__label">knob-align="inset"（把手缩进轨道内）</text>
      <text class="look-head__value">{{ inset }}</text>
    </view>
    <SnSliderBar
      v-model="inset"
      knob-shape="circle"
      knob-icon="star"
      knob-align="inset"
      aria-label="Inset knob at the end"
    />
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
