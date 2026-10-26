<script setup lang="ts">
/**
 * Demo: sn-dialer (uni-end) — 变体矩阵：尺寸 / 扇区配色 / 单奖品色覆盖 /
 * 自定义指针插槽 / 圈数与时长。
 */
import { ref } from 'vue';
import SnDialer from '@snui/uni-src/components/sn-dialer/sn-dialer.vue';
import type { SnDialerPrize } from '@snui/uni-src/components/sn-dialer/sn-dialer.vue';

const themePrizes: SnDialerPrize[] = [
  { id: 'a', name: '奖品 A' },
  { id: 'b', name: '奖品 B' },
  { id: 'c', name: '奖品 C' },
  { id: 'd', name: '奖品 D' },
];

const overridePrizes: SnDialerPrize[] = [
  { id: 'top', name: '大奖', color: 'var(--sn-mp-color-feedback-warning-soft)' },
  { id: 'normal', name: '普通奖' },
];

const smallRef = ref<InstanceType<typeof SnDialer> | null>(null);
const themeRef = ref<InstanceType<typeof SnDialer> | null>(null);
const overrideRef = ref<InstanceType<typeof SnDialer> | null>(null);
const quickRef = ref<InstanceType<typeof SnDialer> | null>(null);

function spinToRandom(
  dialer: InstanceType<typeof SnDialer> | null,
  count: number,
): void {
  dialer?.run(Math.floor(Math.random() * count));
}
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">size="420rpx"（小盘）</text>
    <view class="dialer-stage">
      <SnDialer
        ref="smallRef"
        :prize-list="themePrizes"
        size="420rpx"
        @click="spinToRandom(smallRef, themePrizes.length)"
      />
    </view>

    <text class="sn-demo__title">自定义扇区配色 + 描边</text>
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

    <text class="sn-demo__title">单奖品 color 覆盖（优先于 prizeBgColors）</text>
    <view class="dialer-stage">
      <SnDialer
        ref="overrideRef"
        :prize-list="overridePrizes"
        size="420rpx"
        @click="spinToRandom(overrideRef, overridePrizes.length)"
      />
    </view>

    <text class="sn-demo__title">自定义指针插槽 + turns=8 / duration=1.2</text>
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
    <text class="sn-demo__meta">每个转盘点击指针即随机落定；2-12 个奖品均可</text>
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
