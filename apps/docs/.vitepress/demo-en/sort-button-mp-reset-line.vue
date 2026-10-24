<script setup lang="ts">
/** Demo: sn-sort-button — `allowReset` puts 0 back into the cycle; `descFirst` starts with descending; `line` adds an underline. */
import { ref } from 'vue'
import SnSortButton from '@snui/uni-src/components/sn-sort-button/sn-sort-button.vue'

const a = ref<1 | 0 | -1>(0)
const b = ref<1 | 0 | -1>(0)
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSortButton v-model="a" title="Sales" allow-reset line />
    <SnSortButton v-model="b" title="Rating" desc-first allow-reset />
    <text class="sn-demo__meta">Sales: {{ a }} / Rating: {{ b }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
