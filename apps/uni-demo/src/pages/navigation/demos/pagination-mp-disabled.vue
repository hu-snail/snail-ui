<script setup lang="ts">
/**
 * Demo: sn-pagination — 禁用态（整控件禁用 + 边界禁用）。
 *
 * - `disabled` 冻结整个分页器：根节点带 `sn-pagination--disabled`，页码与
 *   翻页按钮统一切到禁用文字色，点击不触发 `change`
 * - 边界禁用：第 1 页时上一页按钮、最后一页时下一页按钮自带禁用样式
 * - `show-icon` 保留内置箭头，禁用时图标随文字一起变灰
 */
import { ref } from 'vue';
import SnPagination from '@snui/uni-src/components/sn-pagination/sn-pagination.vue';

const frozenPage = ref(3);
/** 落在第 1 页 → 上一页按钮进入边界禁用。 */
const firstPage = ref(1);
/** 落在最后一页 → 下一页按钮进入边界禁用。 */
const lastPage = ref(8);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__group">
      <text class="sn-demo__group-title">整控件禁用（disabled）</text>
      <SnPagination v-model="frozenPage" :total-page="8" show-icon disabled />
    </view>

    <view class="sn-demo__group">
      <text class="sn-demo__group-title">边界禁用 · 第 1 页</text>
      <SnPagination v-model="firstPage" :total-page="8" show-icon />
    </view>

    <view class="sn-demo__group">
      <text class="sn-demo__group-title">边界禁用 · 第 8 页</text>
      <SnPagination v-model="lastPage" :total-page="8" show-icon />
    </view>

    <text class="sn-demo__meta">
      禁用按钮用 --sn-mp-color-text-disabled 文字与 --sn-mp-color-background-subtle
      底色；越界点击被拦住，不触发 change。
    </text>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
  width: 100%;
}
.sn-demo__group {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
  padding: var(--sn-mp-spacing-3);
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-surface);
}
.sn-demo__group-title {
  font-size: var(--sn-mp-font-size-xs);
  font-weight: var(--sn-mp-font-weight-medium);
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__meta {
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
  color: var(--sn-mp-color-text-tertiary);
}
</style>
