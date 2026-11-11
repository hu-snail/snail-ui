<script setup lang="ts">
/** Demo: sn-sort-button — underline: `line` adds an underline to the label. */
import { ref } from 'vue';
import SnSortButton from '@snui/uni-src/components/sn-sort-button/sn-sort-button.vue';

const a = ref<1 | 0 | -1>(1);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSortButton v-model="a" title="Sales" line />
    <text class="sn-demo__meta">line: the label is underlined</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
