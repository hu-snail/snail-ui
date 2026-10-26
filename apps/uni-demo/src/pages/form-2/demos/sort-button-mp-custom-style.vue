<script setup lang="ts">
/**
 * Demo: sn-sort-button — customClass / customStyle。
 *
 * `custom-class` 追加在根节点上（和 `sn-sort-button` 并列），`custom-style`
 * 是根节点的内联样式；两者都可以覆盖内边距 / 底色 / 圆角。
 */
import { ref } from 'vue';
import SnSortButton from '@snui/uni-src/components/sn-sort-button/sn-sort-button.vue';

const price = ref<1 | 0 | -1>(0);
const sales = ref<1 | 0 | -1>(1);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSortButton
      v-model="price"
      title="价格"
      custom-class="sn-demo__sort"
      custom-style="padding: 8rpx 24rpx; border-radius: var(--sn-mp-radius-full); background-color: var(--sn-mp-color-background-soft);"
    />
    <text class="sn-demo__meta"
      >customClass + customStyle：圆角胶囊底色由内联样式给出，边框由类名给出</text
    >

    <SnSortButton
      v-model="sales"
      title="销量"
      custom-class="sn-demo__sort"
      custom-style="padding: 8rpx 24rpx;"
      line
    />
    <text class="sn-demo__meta"
      >同一 customClass 叠在 line 模式上：下划线仍是组件的，外框来自类名</text
    >

    <text class="sn-demo__meta">价格 {{ price }} / 销量 {{ sales }}</text>
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
/* custom-class 落在 sn-sort-button 根节点上，需要 :deep 穿透组件边界。 */
.sn-demo :deep(.sn-demo__sort) {
  border: 2rpx solid var(--sn-mp-color-border-subtle);
}
</style>
