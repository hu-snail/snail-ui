<script setup lang="ts">
/** Demo: sn-picker-view — Single-column roller: pass a string array as `columns` and tap a row to select it. */
import { ref } from 'vue';
import SnPickerView from '@snui/uni-src/components/sn-picker-view/sn-picker-view.vue';

const fruits = ['Apple', 'Banana', 'Cherry', 'Grape'];
const value = ref<Array<string | number>>(['Apple']);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnPickerView v-model="value" :columns="[fruits]" />
    <text class="sn-demo__meta">Selected: {{ value[0] }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
