<script setup lang="ts">
/** Demo: sn-sort-button — Tri-state sort toggle: 1 ascending / 0 reset / -1 descending; by default it toggles between ascending and descending. */
import { ref, computed } from 'vue';
import SnSortButton from '@snui/uni-src/components/sn-sort-button/sn-sort-button.vue';

const direction = ref<1 | 0 | -1>(0);
const label = computed(() =>
  direction.value === 1 ? 'Ascending' : direction.value === -1 ? 'Descending' : 'Unsorted',
);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSortButton v-model="direction" title="Price" />
    <text class="sn-demo__meta">Direction: {{ label }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
