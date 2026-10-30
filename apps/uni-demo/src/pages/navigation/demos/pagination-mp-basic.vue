<script setup lang="ts">
/**
 * Demo: sn-pagination — 基础翻页（含翻页图标与计数）。
 *
 * - `v-model` 绑定当前页码，`total-page` 指定总页数
 * - `show-icon` 打开上一页 / 下一页的内置箭头图标
 * - `show-message` 在分页器下方追加「当前页 / 总页数」计数
 */
import { ref } from 'vue';
import SnPagination from '@snui/uni-src/components/sn-pagination/sn-pagination.vue';

const page = ref(3);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__group">
      <text class="sn-demo__group-title">基础翻页 · 8 页</text>
      <SnPagination v-model="page" :total-page="8" show-icon show-message />
    </view>
    <text class="sn-demo__meta">当前第 {{ page }} 页 / 共 8 页；箭头图标随文字一起继承按钮颜色。</text>
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
  color: var(--sn-mp-color-text-tertiary);
}
</style>
