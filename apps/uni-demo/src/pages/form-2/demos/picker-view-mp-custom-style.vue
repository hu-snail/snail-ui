<script setup lang="ts">
/** Demo: sn-picker-view — 根节点样式：custom-class / custom-style 落在根节点上改滚轮外框。 */
import { ref } from 'vue';
import SnPickerView from '@snui/uni-src/components/sn-picker-view/sn-picker-view.vue';

const trailing = ref<Array<string | number>>(['北京']);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnPickerView
      v-model="trailing"
      :columns="[['北京', '上海', '广州']]"
      custom-class="sn-demo__picker"
      custom-style="padding: 8rpx 0; background-color: var(--sn-mp-color-background-soft);"
    />
    <text class="sn-demo__meta">customClass / customStyle 改根节点外框与底色</text>
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
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* custom-class 落在 sn-picker-view 根节点上，需要 :deep 穿透组件边界。 */
.sn-demo :deep(.sn-demo__picker) {
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-md);
}
</style>
