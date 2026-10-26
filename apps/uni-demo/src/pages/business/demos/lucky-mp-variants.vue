<script setup lang="ts">
/**
 * Demo: sn-lucky (uni-end) — 变体矩阵：4x4 网格 / gutter 与 cellHeight /
 * speed 步进间隔 / 奖品格高亮色 / 自定义按钮插槽。start 后统一延迟 stop。
 */
import { onBeforeUnmount, ref } from 'vue';
import SnLucky from '@snui/uni-src/components/sn-lucky/sn-lucky.vue';
import type { SnLuckyPrize } from '@snui/uni-src/components/sn-lucky/sn-lucky.vue';

const grid4Prizes: SnLuckyPrize[] = [
  { name: '一等奖' },
  { name: '优惠券' },
  { name: '积分' },
  { name: '谢谢参与' },
  { name: '红包' },
  { name: '实物奖' },
  { name: '再来一次' },
  { name: '免单券' },
  { name: '加购券' },
  { name: '满减券' },
  { name: '新人礼' },
  { name: '周边盲盒' },
];

const coloredPrizes: SnLuckyPrize[] = [
  { name: '大奖', color: 'var(--sn-mp-color-feedback-warning-soft)' },
  { name: '优惠券' },
  { name: '积分' },
  { name: '谢谢参与' },
  { name: '红包' },
  { name: '实物奖' },
  { name: '再来一次' },
  { name: '免单券' },
];

const grid4Ref = ref<InstanceType<typeof SnLucky> | null>(null);
const bigCellRef = ref<InstanceType<typeof SnLucky> | null>(null);
const slowRef = ref<InstanceType<typeof SnLucky> | null>(null);
const slotRef = ref<InstanceType<typeof SnLucky> | null>(null);

const settleTimers: ReturnType<typeof setTimeout>[] = [];

/** start 后宿主异步决定结果：统一延迟 1s 随机 stop。 */
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
    <text class="sn-demo__title">rows=4 cols=4（12 个周长奖品格）</text>
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

    <text class="sn-demo__title">speed=120（慢速高亮）+ 奖品 color 高亮覆盖</text>
    <SnLucky
      ref="slowRef"
      :prizes="coloredPrizes"
      :speed="120"
      @start="scheduleStop(slowRef, coloredPrizes.length)"
    />

    <text class="sn-demo__title">#button 自定义抽奖按钮</text>
    <SnLucky
      ref="slotRef"
      :prizes="coloredPrizes"
      :speed="60"
      @start="scheduleStop(slotRef, coloredPrizes.length)"
    >
      <template #button="{ isPlaying }">
        <view class="lucky-button">
          <text class="lucky-button__text">{{ isPlaying ? '旋转中' : '点我抽奖' }}</text>
        </view>
      </template>
    </SnLucky>
    <text class="sn-demo__meta">点击各自中间按钮起转，1s 后随机落定；周长格子数 = 2(rows+cols) - 4</text>
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
