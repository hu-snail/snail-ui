<script setup lang="ts">
/** Demo: sn-picker-view — root styling: custom-class / custom-style land on the root and restyle the roller frame. */
import { ref } from 'vue';
import SnPickerView from '@snui/uni-src/components/sn-picker-view/sn-picker-view.vue';

const trailing = ref<Array<string | number>>(['Beijing']);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnPickerView
      v-model="trailing"
      :columns="[['Beijing', 'Shanghai', 'Guangzhou']]"
      custom-class="sn-demo__picker"
      custom-style="padding: 8rpx 0; background-color: var(--sn-mp-color-background-soft);"
    />
    <text class="sn-demo__meta">customClass / customStyle restyle the root frame and fill</text>
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
/* custom-class lands on the sn-picker-view root, so :deep pierces the component boundary. */
.sn-demo :deep(.sn-demo__picker) {
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-md);
}
</style>
