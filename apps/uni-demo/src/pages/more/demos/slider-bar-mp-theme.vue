<script setup lang="ts">
/**
 * Demo: sn-slider-bar — 主题：theme 一次性换掉「轨道底 / 填充 / 把手描边」三色。
 *
 * 除默认与 aurora（渐变 + 星光）外，另有四个零配置预设：
 * ocean（青→蓝）、sunset（橙→玫红）、grape（紫→品红）、mono（墨灰）。
 * 主题只改配色不动几何，所以每个主题的把手直径、轨道厚度完全一致；
 * 想覆盖单个颜色时照常传 fill-background / knob-border-color（显式优先）。
 */
import { ref } from 'vue';
import SnSliderBar from '@snui/uni-src/components/sn-slider-bar/sn-slider-bar.vue';

const aurora = ref(64);
const ocean = ref(72);
const sunset = ref(56);
const grape = ref(40);
const mono = ref(84);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="look-head">
      <text class="look-head__label">aurora · 渐变 + 星光</text>
      <text class="look-head__value">{{ aurora }}</text>
    </view>
    <SnSliderBar v-model="aurora" theme="aurora" aria-label="Aurora" />

    <view class="look-head">
      <text class="look-head__label">ocean · 青 → 蓝</text>
      <text class="look-head__value">{{ ocean }}</text>
    </view>
    <SnSliderBar v-model="ocean" theme="ocean" aria-label="Ocean" />

    <view class="look-head">
      <text class="look-head__label">sunset · 橙 → 玫红</text>
      <text class="look-head__value">{{ sunset }}</text>
    </view>
    <SnSliderBar v-model="sunset" theme="sunset" aria-label="Sunset" />

    <view class="look-head">
      <text class="look-head__label">grape · 紫 → 品红</text>
      <text class="look-head__value">{{ grape }}</text>
    </view>
    <SnSliderBar v-model="grape" theme="grape" aria-label="Grape" />

    <view class="look-head">
      <text class="look-head__label">mono · 墨灰</text>
      <text class="look-head__value">{{ mono }}</text>
    </view>
    <SnSliderBar v-model="mono" theme="mono" aria-label="Mono" />
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
