<script setup lang="ts">
/** Demo: sn-picker-view — 块自定义:wheelBand="perColumn" 分列带 + 渐变带漆 + inset 圆角变量。 */
import { ref } from 'vue';
import SnPickerView from '@snui/uni-src/components/sn-picker-view/sn-picker-view.vue';

const hours = [0, 1, 2, 3, 4];
const minutes = [20, 21, 22, 23, 24];
const value = ref<Array<string | number>>([2, 22]);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">shared（默认）—— 一整条横跨全部列</text>
    <SnPickerView
      v-model="value"
      :columns="[hours, minutes]"
      wheel
      :visible-item-count="5"
      custom-style="--sn-picker-view-wheel-band: linear-gradient(90deg, var(--sn-mp-color-lightblue-soft), var(--sn-mp-color-action-primary-soft))"
    />
    <text class="sn-demo__title">perColumn —— 每列一条独立带</text>
    <SnPickerView
      v-model="value"
      :columns="[hours, minutes]"
      wheel
      wheel-band="perColumn"
      :visible-item-count="5"
      custom-style="--sn-picker-view-wheel-inset: 8rpx; --sn-picker-view-wheel-radius: 12rpx"
    />
    <text class="sn-demo__meta">已选：{{ value.join(' : ') }}（带漆/圆角/内边距均可经 CSS 变量自定义）</text>
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  color: var(--sn-mp-color-text-secondary);
}

.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
