<script setup lang="ts">
/** Demo: sn-picker-view — band customization: full-width soft blue band (zero inset, large radius). Pure CSS variables — identical on every end. */
import { ref } from 'vue';
import SnPickerView from '@snui/uni-src/components/sn-picker-view/sn-picker-view.vue';

const times = ['08:00', '08:30', '09:00', '09:30', '10:00'];
const value = ref<Array<string | number>>(['09:00']);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnPickerView
      v-model="value"
      :columns="[times]"
      wheel
      vibrate-short
      :visible-item-count="5"
      :item-height="52"
      custom-style="--sn-picker-view-wheel-inset: 0rpx; --sn-picker-view-wheel-radius: 20rpx; --sn-picker-view-wheel-band: var(--sn-mp-color-lightblue-soft)"
    />
    <text class="sn-demo__meta">Selected: {{ value[0] }} (full-width soft band, zero inset + large radius)</text>
  </view>
</template>
