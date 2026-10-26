<script setup lang="ts">
/**
 * Demo: sn-dialer (uni-end) — Basic usage: tap GO, host decides the index,
 * run(index) spins and done reports the result.
 */
import { ref } from 'vue';
import SnDialer from '@snui/uni-src/components/sn-dialer/sn-dialer.vue';
import type { SnDialerPrize } from '@snui/uni-src/components/sn-dialer/sn-dialer.vue';

const prizeList: SnDialerPrize[] = [
  { id: 'p1', name: 'Grand Prize' },
  { id: 'p2', name: 'Coupon' },
  { id: 'p3', name: 'Points' },
  { id: 'thanks', name: 'Thanks' },
  { id: 'p5', name: 'Gift' },
  { id: 'p6', name: 'One More' },
];

const dialerRef = ref<InstanceType<typeof SnDialer> | null>(null);
const result = ref('Tap GO to start');

function onClick(): void {
  // The host decides the winning index (from a backend call in real apps).
  const index = Math.floor(Math.random() * prizeList.length);
  dialerRef.value?.run(index);
}

function onDone(index: number): void {
  result.value = `done(${index}) → ${prizeList[index]?.name ?? ''}`;
}
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="dialer-stage">
      <SnDialer
        ref="dialerRef"
        :prize-list="prizeList"
        @click="onClick"
        @done="onDone"
      />
    </view>
    <text class="sn-demo__meta">{{ result }}</text>
    <text class="sn-demo__meta">The host owns the outcome: request it on click, then call run(index)</text>
  </view>
</template>

<style scoped>
.dialer-stage {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.sn-demo__meta {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-tertiary);
}
</style>
