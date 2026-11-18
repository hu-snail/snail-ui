<script setup lang="ts">
/** Demo: sn-wheel-picker — inline wheel roller: pill selection band + distance fade + slide haptic (App / mini-program). */
import { ref } from 'vue';
import SnWheelPicker from '@snui/uni-src/components/sn-wheel-picker/sn-wheel-picker.vue';

const years = [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999];
const year = ref<Array<string | number>>([1995]);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnWheelPicker v-model="year" :columns="[years]" :item-height="44" :visible-item-count="5" />
    <text class="sn-demo__meta">Selected: {{ year[0] }} (each detent ticks a light haptic on App / MP)</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
