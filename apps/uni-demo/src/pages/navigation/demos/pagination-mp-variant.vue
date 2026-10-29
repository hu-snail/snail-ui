<script setup lang="ts">
/** Demo: sn-pagination — 按钮风格、图标与 total 推导。 */
import { ref } from 'vue';
import SnPagination from '@snui/uni-src/components/sn-pagination/sn-pagination.vue';

const page = ref(3);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnPagination
      v-model="page"
      :total="95"
      :page-size="10"
      button-variant="base"
      show-icon
      prev-text="上一页"
      next-text="下一页"
    />
    <text class="sn-demo__label">简单模式（simple）</text>
    <SnPagination v-model="page" :total-page="8" simple />
    <text class="sn-demo__label">禁用（disabled）</text>
    <SnPagination v-model="page" :total-page="8" disabled />
    <text class="sn-demo__meta">total=95 / pageSize=10 → 10 页；dashed / simple / disabled</text>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.sn-demo__label {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
