<script setup lang="ts">
/** Demo: sn-pagination — basic page stepping. */
import { ref } from 'vue'
import SnPagination from '@snui/uni-src/components/sn-pagination/sn-pagination.vue'

const page = ref(1)
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnPagination v-model="page" :total-page="8" show-message />
    <text class="sn-demo__meta">Current page: {{ page }}</text>
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
