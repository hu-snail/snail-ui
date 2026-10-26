<script setup lang="ts">
/** Demo: sn-picker — `cascade` turns `columns` into a tree and confirm returns the path; a `beforeConfirm` that returns false keeps the sheet open and leaves `v-model` untouched. */
import { ref } from 'vue';
import SnPicker from '@snui/uni-src/components/sn-picker/sn-picker.vue';

const tree = [
  {
    value: 'zj',
    label: 'Zhejiang',
    children: [
      { value: 'hz', label: 'Hangzhou' },
      { value: 'nb', label: 'Ningbo' },
    ],
  },
  { value: 'js', label: 'Jiangsu', children: [{ value: 'nj', label: 'Nanjing' }] },
];
const region = ref<Array<string | number>>(['zj', 'hz']);
const open = ref(false);
// Only the "Zhejiang" branch may be confirmed — demonstrates a beforeConfirm veto.
const guard = (payload: { value: Array<string | number> }) => payload.value[0] === 'zj';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__button" @tap="open = true">Pick a region</view>
    <text class="sn-demo__meta">Selected: {{ region.join(' / ') || '(none)' }}</text>
    <SnPicker
      v-model="region"
      v-model:visible="open"
      :columns="tree"
      cascade
      title="Pick a region"
      confirm-button-text="Use it"
      :before-confirm="guard"
    />
  </view>
</template>

<style scoped>
.sn-demo__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 72rpx;
  padding: 0 32rpx;
  border-radius: var(--sn-mp-button-radius);
  background-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
  font-size: 28rpx;
}

.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
