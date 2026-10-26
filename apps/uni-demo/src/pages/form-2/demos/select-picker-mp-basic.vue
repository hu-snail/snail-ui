<script setup lang="ts">
/** Demo: sn-select-picker — checkbox 类型用数组 v-model；min / max 限制可选数量；tap 行即切换。 */
import { ref } from 'vue';
import SnSelectPicker from '@snui/uni-src/components/sn-select-picker/sn-select-picker.vue';

const options = [
  { value: 'apple', label: '苹果' },
  { value: 'banana', label: '香蕉' },
  { value: 'cherry', label: '樱桃' },
];
const picked = ref<Array<string | number | boolean>>(['apple']);
const open = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__button" @tap="open = true">选择水果</view>
    <text class="sn-demo__meta">已选：{{ picked.join(' / ') || '（未选择）' }}</text>
    <SnSelectPicker
      v-model="picked"
      v-model:visible="open"
      :columns="options"
      :max="2"
      title="选择水果"
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
