<script setup lang="ts">
/** Demo: sn-rate — `allowHalf` selects half stars; `clearable` clears back to null on re-tap; `activeColor` accepts a per-icon array; readonly blocks taps. */
import { ref } from 'vue'
import SnRate from '@snui/uni-src/components/sn-rate/sn-rate.vue'

const half = ref<number | null>(2.5)
const clearable = ref<number | null>(4)
const colored = ref<number | null>(3)
const readonly = ref<number | null>(4)
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnRate v-model="half" allow-half />
    <text class="sn-demo__meta">Half score: {{ half ?? 'not rated' }}</text>
    <SnRate v-model="clearable" clearable />
    <text class="sn-demo__meta">Clearable: {{ clearable ?? 'not rated' }}</text>
    <SnRate v-model="colored" :active-color="['var(--sn-mp-color-feedback-danger)', 'var(--sn-mp-color-feedback-warning)']" />
    <SnRate v-model="readonly" readonly />
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
