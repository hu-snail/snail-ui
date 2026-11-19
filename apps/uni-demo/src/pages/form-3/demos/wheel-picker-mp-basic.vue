<script setup lang="ts">
/** Demo: sn-wheel-picker — 行内 wheel 滚轮：胶囊高亮带 + 远行淡出 + 滑动短震动（App / 小程序）。 */
import { ref } from 'vue';
import SnWheelPicker from '@snui/uni-src/components/sn-wheel-picker/sn-wheel-picker.vue';

const years = [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999];
const year = ref<Array<string | number>>([1995]);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnWheelPicker
      v-model="year"
      :columns="[years]"
      :item-height="44"
      :visible-item-count="5"
      custom-style="--sn-picker-view-wheel-inset: 150rpx"
    />
    <text class="sn-demo__meta">已选：{{ year[0] }}（滑动经过每一行有轻震，App / 小程序生效）</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
