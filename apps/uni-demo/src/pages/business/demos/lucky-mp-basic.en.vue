<script setup lang="ts">
/**
 * Demo: sn-lucky (uni-end) — Basic usage: the built-in button starts play(),
 * the host stops at a random index after a short delay.
 */
import { onBeforeUnmount, ref } from 'vue';
import SnLucky from '@snui/uni-src/components/sn-lucky/sn-lucky.vue';
import type { SnLuckyPrize } from '@snui/uni-src/components/sn-lucky/sn-lucky.vue';

const prizes: SnLuckyPrize[] = [
  { name: 'Grand Prize' },
  { name: 'Coupon' },
  { name: 'Points' },
  { name: 'Thanks' },
  { name: 'Red Packet' },
  { name: 'Gift' },
  { name: 'One More' },
  { name: 'Free Order' },
];

const luckyRef = ref<InstanceType<typeof SnLucky> | null>(null);
const result = ref('Tap the center button to play');
let settleTimer: ReturnType<typeof setTimeout> | null = null;

function onStart(): void {
  result.value = 'Spinning… (host decides asynchronously)';
  settleTimer = setTimeout(() => {
    luckyRef.value?.stop(Math.floor(Math.random() * prizes.length));
  }, 1200);
}

function onEnd(index: number): void {
  result.value = `end(${index}) → ${prizes[index]?.name ?? ''}`;
}

onBeforeUnmount(() => {
  if (settleTimer !== null) clearTimeout(settleTimer);
});
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnLucky ref="luckyRef" :prizes="prizes" :speed="60" @start="onStart" @end="onEnd" />
    <text class="sn-demo__meta">{{ result }}</text>
    <text class="sn-demo__meta">After start the host requests a result, then calls stop(index)</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-tertiary);
}
</style>
