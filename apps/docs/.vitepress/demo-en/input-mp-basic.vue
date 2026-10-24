<script setup lang="ts">
/** Demo: sn-input — basic v-model binding (uni-end). */
import { ref } from 'vue'
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue'

const value = ref('hello')
</script>

<template>
  <view class="sn-demo">
    <SnInput v-model="value" placeholder="Type something…" />
    <view class="sn-demo__meta">v-model = <text class="sn-demo__code">{{ value }}</text></view>
  </view>
</template>

<style scoped>
.sn-demo { display: flex; flex-direction: column; gap: 16rpx; max-width: 480rpx; }
.sn-demo__meta { font-size: 24rpx; color: var(--vp-c-text-2); }
.sn-demo__code { font-family: monospace; }
</style>