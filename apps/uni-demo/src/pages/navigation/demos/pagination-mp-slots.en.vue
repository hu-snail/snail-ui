<script setup lang="ts">
/**
 * Demo: sn-pagination — English shadow of pagination-mp-slots.
 *
 * - the `prev` / `size` / `next` / `message` slots all receive
 *   `{ modelValue, totalPageNum, total, pageSize }`
 * - `custom-class` / `custom-style` land on the root node
 */
import { ref } from 'vue';
import SnPagination from '@snui/uni-src/components/sn-pagination/sn-pagination.vue';

const page = ref(1);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnPagination
      v-model="page"
      :total="48"
      :page-size="10"
      show-message
      custom-class="sn-demo__pager"
      custom-style="padding: var(--sn-mp-spacing-2);"
    >
      <template #prev="{ modelValue }">
        <text class="sn-demo__slot" :class="{ 'sn-demo__slot--off': modelValue <= 1 }">‹ Prev</text>
      </template>
      <template #size="{ modelValue, totalPageNum }">
        <text class="sn-demo__slot">{{ modelValue }} / {{ totalPageNum }}</text>
      </template>
      <template #next>
        <text class="sn-demo__slot">Next ›</text>
      </template>
      <template #message="{ total, pageSize }">
        <text class="sn-demo__meta">{{ total }} records, {{ pageSize }} per page</text>
      </template>
    </SnPagination>

    <text class="sn-demo__meta">Current page {{ page }}</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
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
/* custom-class lands on the sn-pagination root, so it needs :deep to reach. */
.sn-demo :deep(.sn-demo__pager) {
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-sm);
}
</style>
