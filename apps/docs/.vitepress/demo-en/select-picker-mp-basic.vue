<script setup lang="ts">
/** Demo: sn-select-picker — The checkbox type takes an array `v-model`; min / max cap the selection; tapping a row toggles it. */
import { ref } from 'vue'
import SnSelectPicker from '@snui/uni-src/components/sn-select-picker/sn-select-picker.vue'

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
const picked = ref<Array<string | number | boolean>>(['apple'])
const open = ref(false)
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__button" @tap="open = true">Pick fruits</view>
    <text class="sn-demo__meta">Selected: {{ picked.join(' / ') || '(none)' }}</text>
    <SnSelectPicker v-model="picked" v-model:visible="open" :columns="options" :max="2" title="Pick fruits" />
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
