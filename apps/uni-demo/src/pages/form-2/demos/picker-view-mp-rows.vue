<script setup lang="ts">
/** Demo: sn-picker-view — 滚筒几何：itemHeight 每行高度（px 设计值 → rpx）/ visibleItemCount 可见行数。 */
import { ref } from 'vue';
import SnPickerView from '@snui/uni-src/components/sn-picker-view/sn-picker-view.vue';

/** 行高 32 / 可见 5 行：滚轮更紧凑。 */
const dense = ref<Array<string | number>>(['上海']);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnPickerView
      v-model="dense"
      :columns="[['上海', '北京', '广州', '深圳', '杭州', '成都']]"
      :item-height="32"
      :visible-item-count="5"
    />
    <text class="sn-demo__meta">itemHeight=32 + visibleItemCount=5：行更矮、可见行更少</text>
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
</style>
