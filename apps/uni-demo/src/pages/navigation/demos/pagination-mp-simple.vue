<script setup lang="ts">
/**
 * Demo: sn-pagination — 简单模式（simple）。
 *
 * `simple` 去掉中间页码条，只保留「上一页 / 当前页计数 / 下一页」三段，
 * 适合窄屏或只需要步进、不需要跳页的场景。`show-icon` 让两侧按钮渲染内置
 * 的 ChevronLeft / ChevronRight 箭头。
 */
import { ref } from 'vue';
import SnPagination from '@snui/uni-src/components/sn-pagination/sn-pagination.vue';

const page = ref(3);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__group">
      <text class="sn-demo__group-title">简单模式 · 8 页</text>
      <SnPagination v-model="page" :total-page="8" show-icon simple />
    </view>

    <view class="sn-demo__group">
      <text class="sn-demo__group-title">简单模式 · 带计数文字</text>
      <SnPagination v-model="page" :total="48" :page-size="10" show-icon simple show-message />
    </view>

    <text class="sn-demo__meta">
      当前第 {{ page }} 页；simple 与普通模式的翻页按钮共用同一套图标与禁用规则。
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
