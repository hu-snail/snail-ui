<script setup lang="ts">
/**
 * Demo: sn-dialer (uni-end) — Sector colors: prizeBgColors / borderColor /
 * per-prize color override.
 */
import { ref } from 'vue';
import SnDialer from '@snui/uni-src/components/sn-dialer/sn-dialer.vue';
import type { SnDialerPrize } from '@snui/uni-src/components/sn-dialer/sn-dialer.vue';

const themePrizes: SnDialerPrize[] = [
  { id: 'a', name: 'Prize A' },
  { id: 'b', name: 'Prize B' },
  { id: 'c', name: 'Prize C' },
  { id: 'd', name: 'Prize D' },
];

const overridePrizes: SnDialerPrize[] = [
  { id: 'top', name: 'Jackpot', color: 'var(--sn-mp-color-feedback-warning-soft)' },
  { id: 'normal', name: 'Normal' },
];

const themeRef = ref<InstanceType<typeof SnDialer> | null>(null);
const overrideRef = ref<InstanceType<typeof SnDialer> | null>(null);

function spinToRandom(dialer: InstanceType<typeof SnDialer> | null, count: number): void {
  dialer?.run(Math.floor(Math.random() * count));
}
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">Custom sector colors + border</text>
    <view class="dialer-stage">
      <SnDialer
        ref="themeRef"
        :prize-list="themePrizes"
        :prize-bg-colors="[
          'var(--sn-mp-color-action-primary-soft)',
          'var(--sn-mp-color-background-surface)',
        ]"
        border-color="var(--sn-mp-color-action-primary)"
        @click="spinToRandom(themeRef, themePrizes.length)"
      />
    </view>

    <text class="sn-demo__title">Per-prize color override (wins over prizeBgColors)</text>
    <view class="dialer-stage">
      <SnDialer
        ref="overrideRef"
        :prize-list="overridePrizes"
        @click="spinToRandom(overrideRef, overridePrizes.length)"
      />
    </view>
    <text class="sn-demo__meta">Tap a pointer to spin each wheel</text>
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
