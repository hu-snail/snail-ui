<script setup lang="ts">
/** Demo: sn-select-picker — type="radio" 写回标量；filterable 打开搜索框按 label 过滤；checkedColor 覆盖选中色。 */
import { ref } from 'vue';
import SnSelectPicker from '@snui/uni-src/components/sn-select-picker/sn-select-picker.vue';

const options = [
  { value: 'apple', label: '苹果' },
  { value: 'banana', label: '香蕉' },
  { value: 'cherry', label: '樱桃' },
];
const single = ref<string | number | boolean>('apple');
const open = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__button" @tap="open = true">单选 + 搜索</view>
    <text class="sn-demo__meta">已选：{{ single || '（未选择）' }}</text>
    <SnSelectPicker
      v-model="single"
      v-model:visible="open"
      :columns="options"
      type="radio"
      filterable
      filter-placeholder="搜索水果"
      title="单选"
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
