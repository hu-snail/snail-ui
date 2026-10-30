<script setup lang="ts">
/**
 * Demo: sn-pagination — simple mode.
 *
 * `simple` drops the numeric strip and keeps only "previous / page counter /
 * next", which suits narrow screens or flows that only need stepping rather
 * than jumping. `show-icon` makes both step buttons render the built-in
 * ChevronLeft / ChevronRight arrows.
 */
import { ref } from 'vue';
import SnPagination from '@snui/uni-src/components/sn-pagination/sn-pagination.vue';

const page = ref(3);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__group">
      <text class="sn-demo__group-title">Simple mode · 8 pages</text>
      <SnPagination v-model="page" :total-page="8" show-icon simple />
    </view>

    <view class="sn-demo__group">
      <text class="sn-demo__group-title">Simple mode · with counter</text>
      <SnPagination v-model="page" :total="48" :page-size="10" show-icon simple show-message />
    </view>

    <text class="sn-demo__meta">
      Page {{ page }}; simple mode shares the same icons and disable rules as the
      numeric-strip mode.
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
