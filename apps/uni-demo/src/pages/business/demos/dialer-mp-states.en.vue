<script setup lang="ts">
/**
 * Demo: sn-dialer (uni-end) — States and events: the full click → mock
 * request → run(index) → done flow; pointer taps during a spin are ignored
 * (built-in re-entry guard).
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
const phase = ref<'idle' | 'requesting' | 'spinning' | 'done'>('idle');
const result = ref('Idle: tap GO to start');

function onClick(): void {
  // Mock the host requesting the winning index; repeated run calls during a
  // spin are ignored by the component.
  phase.value = 'requesting';
  result.value = 'click fired: requesting the winning index…';
  setTimeout(() => {
    const index = Math.floor(Math.random() * prizeList.length);
    phase.value = 'spinning';
    dialerRef.value?.run(index);
  }, 500);
}

function onDone(index: number): void {
  phase.value = 'done';
  result.value = `done(${index}): ${prizeList[index]?.name ?? ''}`;
}

function runToFirst(): void {
  if (phase.value === 'requesting' || phase.value === 'spinning') return;
  phase.value = 'spinning';
  result.value = 'Host-pinned landing run(0)';
  dialerRef.value?.run(0);
}
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="dialer-stage">
      <SnDialer ref="dialerRef" :prize-list="prizeList" @click="onClick" @done="onDone" />
    </view>
    <text class="sn-demo__meta">Phase: {{ phase }} · {{ result }}</text>
    <view class="dialer-actions">
      <view class="dialer-actions__btn" hover-class="dialer-actions__btn--down" @tap="runToFirst">
        <text class="dialer-actions__btn-text">Pin landing run(0)</text>
      </view>
    </view>
    <text class="sn-demo__meta">
      Tapping the pointer mid-spin never double-spins; run is called only after the response
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
