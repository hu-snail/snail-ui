<script setup lang="ts">
/**
 * Demo: sn-pagination — basic page stepping (with step icons and counter).
 *
 * - `v-model` binds the current page, `total-page` sets the page count
 * - `show-icon` turns on the built-in previous / next chevrons
 * - `show-message` appends the "current / total" counter under the pager
 */
import { ref } from 'vue';
import SnPagination from '@snui/uni-src/components/sn-pagination/sn-pagination.vue';

const page = ref(3);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__group">
      <text class="sn-demo__group-title">Basic paging · 8 pages</text>
      <SnPagination v-model="page" :total-page="8" show-icon show-message />
    </view>
    <text class="sn-demo__meta">
      Page {{ page }} of 8; the chevrons inherit the button colour with the label.
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
  color: var(--sn-mp-color-text-tertiary);
}
</style>
