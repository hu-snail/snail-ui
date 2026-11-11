<script setup lang="ts">
/**
 * Demo: sn-pagination — English shadow of pagination-mp-hide-on-one-page.
 */
import { ref } from 'vue';
import SnPagination from '@snui/uni-src/components/sn-pagination/sn-pagination.vue';

const singlePage = ref(1);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnPagination v-model="singlePage" :total-page="1" hide-if-one-page />
    <text class="sn-demo__meta">No pager above means the prop took effect (one page → not rendered)</text>
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
</style>
