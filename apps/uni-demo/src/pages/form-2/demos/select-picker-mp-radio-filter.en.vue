<script setup lang="ts">
/** Demo: sn-select-picker — `type="radio"` writes a scalar; `filterable` adds a search box that filters on the label; `checkedColor` overrides the accent. */
import { ref } from 'vue';
import SnSelectPicker from '@snui/uni-src/components/sn-select-picker/sn-select-picker.vue';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];
const single = ref<string | number | boolean>('apple');
const open = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__button" @tap="open = true">Radio + search</view>
    <text class="sn-demo__meta">Selected: {{ single || '(none)' }}</text>
    <SnSelectPicker
      v-model="single"
      v-model:visible="open"
      :columns="options"
      type="radio"
      filterable
      filter-placeholder="Search fruits"
      title="Radio"
      checked-color="var(--sn-mp-color-feedback-success)"
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
