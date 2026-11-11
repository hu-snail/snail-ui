<script setup lang="ts">
/** Demo: sn-select-picker — 加载态：loading 显示选项列表加载中，loadingColor 覆盖 spinner 颜色。 */
import { ref } from 'vue';
import SnSelectPicker from '@snui/uni-src/components/sn-select-picker/sn-select-picker.vue';

const options = [
  { value: 'apple', label: '苹果' },
  { value: 'banana', label: '香蕉' },
  { value: 'cherry', label: '樱桃' },
];

const loading = ref<Array<string | number | boolean>>([]);
const open = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">loading + loadingColor</text>
    <view class="sn-demo__button" @tap="open = true">加载态</view>
    <SnSelectPicker
      v-model="loading"
      v-model:visible="open"
      :columns="options"
      loading
      loading-color="var(--sn-mp-color-action-primary)"
      title="加载态"
    />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}

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
</style>
