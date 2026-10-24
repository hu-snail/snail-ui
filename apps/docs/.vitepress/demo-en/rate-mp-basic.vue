<script setup lang="ts">
/** Demo: sn-rate — Basic sn-rate: `num` sets the icon count, tapping an icon writes `v-model`. */
import { ref } from 'vue'
import SnRate from '@snui/uni-src/components/sn-rate/sn-rate.vue'

const score = ref<number | null>(3)
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnRate v-model="score" />
    <text class="sn-demo__meta">Score: {{ score ?? 'not rated' }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
