<script setup lang="ts">
/** Demo: sn-wheel-picker — 滑动震动开关：vibrateShort 默认开启，传 false 关闭（真机对比感受）。 */
import { ref } from 'vue';
import SnWheelPicker from '@snui/uni-src/components/sn-wheel-picker/sn-wheel-picker.vue';

const minutes = [15, 20, 25, 30, 45, 60];
const on = ref<Array<string | number>>([25]);
const off = ref<Array<string | number>>([25]);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">vibrateShort = true（默认）</text>
    <SnWheelPicker v-model="on" :columns="[minutes]" :visible-item-count="5" />
    <text class="sn-demo__title">vibrateShort = false</text>
    <SnWheelPicker v-model="off" :columns="[minutes]" :visible-item-count="5" :vibrate-short="false" />
    <text class="sn-demo__meta">上：滑动有轻震；下：静音滑动（App / 小程序真机生效，H5 无震动电机）</text>
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
