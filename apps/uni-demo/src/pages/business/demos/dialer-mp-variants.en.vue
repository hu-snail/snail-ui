<script setup lang="ts">
/**
 * Demo: sn-dialer (uni-end) — Variant matrix: size / sector palette /
 * per-prize color override / custom pointer slot / turns and duration.
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
  { id: 'normal', name: 'Standard' },
];

const smallRef = ref<InstanceType<typeof SnDialer> | null>(null);
const themeRef = ref<InstanceType<typeof SnDialer> | null>(null);
const overrideRef = ref<InstanceType<typeof SnDialer> | null>(null);
const quickRef = ref<InstanceType<typeof SnDialer> | null>(null);

function spinToRandom(dialer: InstanceType<typeof SnDialer> | null, count: number): void {
  dialer?.run(Math.floor(Math.random() * count));
}
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">size="420rpx" (small)</text>
    <view class="dialer-stage">
      <SnDialer
        ref="smallRef"
        :prize-list="themePrizes"
        size="420rpx"
        @click="spinToRandom(smallRef, themePrizes.length)"
      />
    </view>

    <text class="sn-demo__title">Custom sector palette + border</text>
    <view class="dialer-stage">
      <SnDialer
        ref="themeRef"
        :prize-list="themePrizes"
        size="420rpx"
        :prize-bg-colors="[
          'var(--sn-mp-color-action-primary-soft)',
          'var(--sn-mp-color-background-surface)',
        ]"
        border-color="var(--sn-mp-color-action-primary)"
        @click="spinToRandom(themeRef, themePrizes.length)"
      />
    </view>

    <text class="sn-demo__title">Per-prize color override (beats prizeBgColors)</text>
    <view class="dialer-stage">
      <SnDialer
        ref="overrideRef"
        :prize-list="overridePrizes"
        size="420rpx"
        @click="spinToRandom(overrideRef, overridePrizes.length)"
      />
    </view>

    <text class="sn-demo__title">Custom pointer slot + turns=8 / duration=1.2</text>
    <view class="dialer-stage">
      <SnDialer
        ref="quickRef"
        :prize-list="themePrizes"
        size="420rpx"
        :turns="8"
        :duration="1.2"
        @click="spinToRandom(quickRef, themePrizes.length)"
      >
        <template #pointer>
          <view class="pointer-go">
            <text class="pointer-go__text">Start</text>
          </view>
        </template>
      </SnDialer>
    </view>
    <text class="sn-demo__meta">Tap each pointer for a random landing; 2-12 prizes all work</text>
  </view>
</template>

<style scoped>
.dialer-stage {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.pointer-go {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: var(--sn-mp-color-feedback-success);
}

.pointer-go__text {
  color: var(--sn-mp-color-text-on-primary);
  font-size: var(--sn-mp-font-size-sm);
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
