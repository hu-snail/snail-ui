<script setup lang="ts">
/**
 * Demo: sn-dialer (uni-end) — 状态与事件：click → 模拟请求 → run(index) →
 * done 的完整流程反馈；旋转期间指针点击被忽略（组件内置防重入）。
 */
import { ref } from 'vue';
import SnDialer from '@snui/uni-src/components/sn-dialer/sn-dialer.vue';
import type { SnDialerPrize } from '@snui/uni-src/components/sn-dialer/sn-dialer.vue';

const prizeList: SnDialerPrize[] = [
  { id: 'p1', name: '一等奖' },
  { id: 'p2', name: '优惠券' },
  { id: 'p3', name: '积分' },
  { id: 'thanks', name: '谢谢参与' },
  { id: 'p5', name: '实物奖' },
  { id: 'p6', name: '再来一次' },
];

const dialerRef = ref<InstanceType<typeof SnDialer> | null>(null);
const phase = ref<'idle' | 'requesting' | 'spinning' | 'done'>('idle');
const result = ref('待机：点击 GO 开始');

function onClick(): void {
  // 模拟宿主请求中奖结果；旋转期间组件会忽略重复 run。
  phase.value = 'requesting';
  result.value = 'click 已触发：请求中奖索引…';
  setTimeout(() => {
    const index = Math.floor(Math.random() * prizeList.length);
    phase.value = 'spinning';
    dialerRef.value?.run(index);
  }, 500);
}

function onDone(index: number): void {
  phase.value = 'done';
  result.value = `done(${index})：${prizeList[index]?.name ?? ''}`;
}

function runToFirst(): void {
  if (phase.value === 'requesting' || phase.value === 'spinning') return;
  phase.value = 'spinning';
  result.value = '宿主指定索引 run(0)';
  dialerRef.value?.run(0);
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
    <text class="sn-demo__meta">阶段：{{ phase }} · {{ result }}</text>
    <view class="dialer-actions">
      <view class="dialer-actions__btn" hover-class="dialer-actions__btn--down" @tap="runToFirst">
        <text class="dialer-actions__btn-text">指定落点 run(0)</text>
      </view>
    </view>
    <text class="sn-demo__meta">
      旋转中再点指针不会重复旋转（spinning 防重入）；run 在请求返回后才调用
    </text>
  </view>
</template>

<style scoped>
.dialer-stage {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.dialer-actions {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: var(--sn-mp-spacing-2);
}

.dialer-actions__btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 14rpx 40rpx;
  border-radius: 32rpx;
  background-color: var(--sn-mp-color-background-subtle);
}

.dialer-actions__btn--down {
  opacity: 0.8;
}

.dialer-actions__btn-text {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-sm);
}

.sn-demo__meta {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-tertiary);
}
</style>
