<script setup lang="ts">
/**
 * Demo: sn-dialer (uni-end) — Spin params: turns / duration.
 */
import { ref } from 'vue';
import SnDialer from '@snui/uni-src/components/sn-dialer/sn-dialer.vue';
import type { SnDialerPrize } from '@snui/uni-src/components/sn-dialer/sn-dialer.vue';

const prizes: SnDialerPrize[] = [
  { id: 'a', name: 'Prize A' },
  { id: 'b', name: 'Prize B' },
  { id: 'c', name: 'Prize C' },
  { id: 'd', name: 'Prize D' },
];

const slowRef = ref<InstanceType<typeof SnDialer> | null>(null);
const quickRef = ref<InstanceType<typeof SnDialer> | null>(null);

function spinToRandom(dialer: InstanceType<typeof SnDialer> | null, count: number): void {
  dialer?.run(Math.floor(Math.random() * count));
}
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">Default (turns=6 / duration=3s)</text>
    <view class="dialer-stage">
      <SnDialer ref="slowRef" :prize-list="prizes" @click="spinToRandom(slowRef, prizes.length)" />
    </view>

    <text class="sn-demo__title">turns=8 / duration=1.2 (quick pace)</text>
    <view class="dialer-stage">
      <SnDialer
        ref="quickRef"
        :prize-list="prizes"
        :turns="8"
        :duration="1.2"
        @click="spinToRandom(quickRef, prizes.length)"
      />
    </view>
    <text class="sn-demo__meta">Tap the pointer to spin and compare turns / duration</text>
  </view>
</template>

<style scoped>
.dialer-stage {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.sn-demo__title {
  font-size: var(--sn-mp-font-size-sm);
  font-weight: var(--sn-mp-font-weight-semibold);
  color: var(--sn-mp-color-text-secondary);
}

.sn-demo__meta {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-tertiary);
}
</style>
