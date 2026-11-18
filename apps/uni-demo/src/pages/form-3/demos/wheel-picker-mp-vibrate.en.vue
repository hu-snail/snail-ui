<script setup lang="ts">
/** Demo: sn-wheel-picker — slide haptic switch: vibrateShort defaults on, pass false to mute (compare on device). */
import { ref } from 'vue';
import SnWheelPicker from '@snui/uni-src/components/sn-wheel-picker/sn-wheel-picker.vue';

const minutes = [15, 20, 25, 30, 45, 60];
const on = ref<Array<string | number>>([25]);
const off = ref<Array<string | number>>([25]);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">vibrateShort = true (default)</text>
    <SnWheelPicker v-model="on" :columns="[minutes]" :visible-item-count="5" />
    <text class="sn-demo__title">vibrateShort = false</text>
    <SnWheelPicker v-model="off" :columns="[minutes]" :visible-item-count="5" :vibrate-short="false" />
    <text class="sn-demo__meta">Top ticks per detent; bottom is silent (App / MP devices only — H5 has no motor)</text>
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
