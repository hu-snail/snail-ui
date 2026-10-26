<script setup lang="ts">
/** Demo: sn-pagination — button variants, icons and total-derived pages. */
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
      prev-text="Previous"
      next-text="Next"
    />
    <SnPagination v-model="page" :total-page="3" button-variant="dashed" />
    <text class="sn-demo__meta">total=95 / pageSize=10 → 10 pages; dashed variant</text>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
