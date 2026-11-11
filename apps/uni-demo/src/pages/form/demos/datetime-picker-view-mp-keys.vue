<script setup lang="ts">
/**
 * Demo: sn-datetime-picker-view — 字段映射（valueKey / labelKey）。
 *
 * 列由组件内部生成，valueKey / labelKey 为参考库对齐参数：声明后配置
 * 可原样通过类型检查，不产生视觉效果。
 */
import { ref } from 'vue';
import SnDatetimePickerView from '@snui/uni-src/components/sn-datetime-picker-view/sn-datetime-picker-view.vue';

const min = new Date(2024, 0, 1).getTime();
const max = new Date(2024, 11, 31).getTime();

const value = ref<string | number>(new Date(2024, 5, 15).getTime());
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnDatetimePickerView
      v-model="value"
      type="date"
      :min-date="min"
      :max-date="max"
      value-key="value"
      label-key="label"
    />
    <text class="sn-demo__meta">
      valueKey / labelKey 为对齐参数（列由组件生成），声明不产生视觉效果
    </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: stretch;
  width: 100%;
}

.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
