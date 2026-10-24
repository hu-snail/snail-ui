<script setup lang="ts">
/**
 * Demo: sn-count-to (uni-end) — number roll-up.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-count-to from its SFC source.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnCountTo from '@snui/uni-src/components/sn-count-to/sn-count-to.vue'

const round = ref(0)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnCountTo :end-val="2024" :duration="2000" />
    <SnCountTo :start-val="100" :end-val="10000" prefix="¥" suffix=" from" />
    <SnCountTo :start-val="0" :end-val="99.5" :decimals="2" suffix="%" />
    <SnCountTo :key="round" :start-val="0" :end-val="88888" separator=" " />

    <SnButton size="small" @tap="round += 1">Replay</SnButton>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
