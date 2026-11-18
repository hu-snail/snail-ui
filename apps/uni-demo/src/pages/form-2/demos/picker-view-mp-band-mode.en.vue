<script setup lang="ts">
/** Demo: sn-picker-view — band customization: wheelBand="perColumn" split bands + gradient band paint + inset/radius variables. */
import { ref } from 'vue';
import SnPickerView from '@snui/uni-src/components/sn-picker-view/sn-picker-view.vue';

const hours = [0, 1, 2, 3, 4];
const minutes = [20, 21, 22, 23, 24];
const value = ref<Array<string | number>>([2, 22]);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">shared (default) — one pill spanning every column</text>
    <SnPickerView
      v-model="value"
      :columns="[hours, minutes]"
      wheel
      :visible-item-count="5"
      custom-style="--sn-picker-view-wheel-band: linear-gradient(90deg, var(--sn-mp-color-lightblue-soft), var(--sn-mp-color-action-primary-soft))"
    />
    <text class="sn-demo__title">perColumn — one band per column</text>
    <SnPickerView
      v-model="value"
      :columns="[hours, minutes]"
      wheel
      wheel-band="perColumn"
      :visible-item-count="5"
      custom-style="--sn-picker-view-wheel-inset: 8rpx; --sn-picker-view-wheel-radius: 12rpx"
    />
    <text class="sn-demo__meta">Selected: {{ value.join(' : ') }} (band paint / radius / inset all customizable via CSS vars)</text>
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
