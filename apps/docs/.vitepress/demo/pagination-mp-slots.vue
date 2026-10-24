<script setup lang="ts">
/**
 * Demo: sn-pagination — 单页隐藏、插槽自定义与根节点样式。
 *
 * - `hide-if-one-page` 在总页数为 1 时整个组件不渲染（`v-if` 直接挡掉根节点）
 * - `prev` / `size` / `next` / `message` 四个插槽作用域都拿到
 *   `{ modelValue, totalPageNum, total, pageSize }`
 * - `custom-class` / `custom-style` 落在根节点
 */
import { ref } from 'vue'
import SnPagination from '@snui/uni-src/components/sn-pagination/sn-pagination.vue'

const page = ref(1)
const singlePage = ref(1)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">hide-if-one-page（总页数 1 → 不渲染）</text>
    <SnPagination v-model="singlePage" :total-page="1" hide-if-one-page />
    <text class="sn-demo__meta">上面没有出现分页器即为生效</text>

    <text class="sn-demo__label">四个插槽自定义</text>
    <SnPagination
      v-model="page"
      :total="48"
      :page-size="10"
      show-message
      custom-class="sn-demo__pager"
      custom-style="padding: var(--sn-mp-spacing-2);"
    >
      <template #prev="{ modelValue }">
        <text class="sn-demo__slot" :class="{ 'sn-demo__slot--off': modelValue <= 1 }">‹ 上一页</text>
      </template>
      <template #size="{ modelValue, totalPageNum }">
        <text class="sn-demo__slot">{{ modelValue }} / {{ totalPageNum }}</text>
      </template>
      <template #next>
        <text class="sn-demo__slot">下一页 ›</text>
      </template>
      <template #message="{ total, pageSize }">
        <text class="sn-demo__meta">共 {{ total }} 条，每页 {{ pageSize }} 条</text>
      </template>
    </SnPagination>

    <text class="sn-demo__meta">当前第 {{ page }} 页</text>
  </view>
</template>

<style scoped>
.sn-demo__label {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
.sn-demo__slot {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-primary);
}
.sn-demo__slot--off {
  color: var(--sn-mp-color-text-disabled);
}
/* custom-class 落在 sn-pagination 根节点上，需要 :deep 穿透。 */
.sn-demo :deep(.sn-demo__pager) {
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-sm);
}
</style>
