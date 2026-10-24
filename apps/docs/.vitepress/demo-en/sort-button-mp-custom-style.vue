<script setup lang="ts">
/**
 * Demo: sn-sort-button — customClass / customStyle.
 *
 * `custom-class` is appended to the root node (alongside `sn-sort-button`) and
 * `custom-style` is the root inline style; together they can override padding,
 * fill and radius.
 */
import { ref } from 'vue'
import SnSortButton from '@snui/uni-src/components/sn-sort-button/sn-sort-button.vue'

const price = ref<1 | 0 | -1>(0)
const sales = ref<1 | 0 | -1>(1)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSortButton
      v-model="price"
      title="Price"
      custom-class="sn-demo__sort"
      custom-style="padding: 8rpx 24rpx; border-radius: var(--sn-mp-radius-full); background-color: var(--sn-mp-color-background-soft);"
    />
    <text class="sn-demo__meta">customClass + customStyle: the inline style supplies the pill fill, the class supplies the border</text>

    <SnSortButton
      v-model="sales"
      title="Sales"
      custom-class="sn-demo__sort"
      custom-style="padding: 8rpx 24rpx;"
      line
    />
    <text class="sn-demo__meta">The same customClass on top of line mode: the underline stays the component's, the frame comes from the class</text>

    <text class="sn-demo__meta">price {{ price }} / sales {{ sales }}</text>
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
/* custom-class lands on the sn-sort-button root, so :deep pierces the component boundary. */
.sn-demo :deep(.sn-demo__sort) {
  border: 2rpx solid var(--sn-mp-color-border-subtle);
}
</style>
