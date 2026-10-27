<script setup lang="ts">
/**
 * Demo: sn-lucky (uni-end) — Variant matrix: 4x4 grid / gutter and cellHeight /
 * speed interval / prize highlight color / custom button slot. Every start is
 * settled with a delayed stop.
 */
import { onBeforeUnmount, ref } from 'vue';
import SnLucky from '@snui/uni-src/components/sn-lucky/sn-lucky.vue';
import type { SnLuckyPrize } from '@snui/uni-src/components/sn-lucky/sn-lucky.vue';

const grid4Prizes: SnLuckyPrize[] = [
  { name: 'Grand Prize' },
  { name: 'Coupon' },
  { name: 'Points' },
  { name: 'Thanks' },
  { name: 'Red Packet' },
  { name: 'Gift' },
  { name: 'One More' },
  { name: 'Free Order' },
  { name: 'Add-on Voucher' },
  { name: 'Discount Voucher' },
  { name: 'Welcome Gift' },
  { name: 'Blind Box' },
];

const coloredPrizes: SnLuckyPrize[] = [
  { name: 'Jackpot', color: 'var(--sn-mp-color-feedback-warning-soft)' },
  { name: 'Coupon' },
  { name: 'Points' },
  { name: 'Thanks' },
  { name: 'Red Packet' },
  { name: 'Gift' },
  { name: 'One More' },
  { name: 'Free Order' },
];

const grid4Ref = ref<InstanceType<typeof SnLucky> | null>(null);
const bigCellRef = ref<InstanceType<typeof SnLucky> | null>(null);
const slowRef = ref<InstanceType<typeof SnLucky> | null>(null);
const slotRef = ref<InstanceType<typeof SnLucky> | null>(null);

const settleTimers: ReturnType<typeof setTimeout>[] = [];

/** After start the host decides asynchronously: stop at a random index in 1s. */
function scheduleStop(lucky: InstanceType<typeof SnLucky> | null, count: number): void {
  settleTimers.push(
    setTimeout(() => {
      lucky?.stop(Math.floor(Math.random() * count));
    }, 1000),
  );
}

onBeforeUnmount(() => {
  for (const timer of settleTimers) clearTimeout(timer);
});
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">rows=4 cols=4 (12 perimeter cells)</text>
    <SnLucky
      ref="grid4Ref"
      :prizes="grid4Prizes"
      :rows="4"
      :cols="4"
      :speed="50"
      @start="scheduleStop(grid4Ref, grid4Prizes.length)"
    />

    <text class="sn-demo__title">gutter="16rpx" + cell-height="150rpx"</text>
    <SnLucky
      ref="bigCellRef"
      :prizes="coloredPrizes"
      gutter="16rpx"
      cell-height="150rpx"
      :speed="60"
      @start="scheduleStop(bigCellRef, coloredPrizes.length)"
    />

    <text class="sn-demo__title">speed=120 (slow highlight) + prize color override</text>
    <SnLucky
      ref="slowRef"
      :prizes="coloredPrizes"
      :speed="120"
      @start="scheduleStop(slowRef, coloredPrizes.length)"
    />

    <text class="sn-demo__title">#button custom play button</text>
    <SnLucky
      ref="slotRef"
      :prizes="coloredPrizes"
      :speed="60"
      @start="scheduleStop(slotRef, coloredPrizes.length)"
    >
      <template #button="{ isPlaying }">
        <view class="lucky-button">
          <text class="lucky-button__text">{{ isPlaying ? 'Spinning' : 'Play' }}</text>
        </view>
      </template>
    </SnLucky>
    <text class="sn-demo__meta"
      >Tap each center button to play; stops randomly after 1s. Perimeter cells = 2(rows+cols) -
      4</text
    >
  </view>
</template>

<style scoped>
.lucky-button {
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100%;
  margin: 0 var(--sn-mp-spacing-2);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-feedback-danger);
}

.lucky-button__text {
  color: var(--sn-mp-color-text-on-primary);
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-semibold);
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
