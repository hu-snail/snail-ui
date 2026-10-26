<script setup lang="ts">
/**
 * Demo: sn-scratchcard (uni-end) — States and events: open fires once per
 * round, reset() starts a new one; two cards report state independently with
 * an open event log.
 */
import { ref } from 'vue';
import SnScratchcard from '@snui/uni-src/components/sn-scratchcard/sn-scratchcard.vue';

const cardARef = ref<InstanceType<typeof SnScratchcard> | null>(null);
const cardBRef = ref<InstanceType<typeof SnScratchcard> | null>(null);
const openedA = ref(false);
const openedB = ref(false);
const log = ref<string[]>([]);
let seq = 0;

function pushOpenLog(id: string): void {
  seq += 1;
  log.value.unshift(`#${seq} open: card ${id} revealed`);
  if (log.value.length > 5) log.value.pop();
}

function onOpenA(): void {
  openedA.value = true;
  pushOpenLog('A');
}

function onOpenB(): void {
  openedB.value = true;
  pushOpenLog('B');
}

function resetCard(id: 'A' | 'B'): void {
  if (id === 'A') {
    openedA.value = false;
    cardARef.value?.reset();
  } else {
    openedB.value = false;
    cardBRef.value?.reset();
  }
}
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="scratch-case">
      <text class="scratch-case__label">Card A · ratio=0.4 (easy)</text>
      <SnScratchcard
        ref="cardARef"
        :ratio="0.4"
        title="Scratch me"
        watermark-text="SNAIL"
        custom-style="width: 100%; height: 200rpx"
        @open="onOpenA"
      >
        <view class="prize-slot">
          <text class="prize-slot__text">Prize: a coupon</text>
        </view>
      </SnScratchcard>
      <text class="scratch-case__meta">
        State: {{ openedA ? 'opened (no more open this round)' : 'waiting for scratch' }}
      </text>
      <view class="scratch-case__btn" hover-class="scratch-case__btn--down" @tap="resetCard('A')">
        <text class="scratch-case__btn-text">Reset A</text>
      </view>
    </view>

    <view class="scratch-case">
      <text class="scratch-case__label">Card B · ratio=0.8 (hard)</text>
      <SnScratchcard
        ref="cardBRef"
        :ratio="0.8"
        title="Scratch me"
        watermark-text="SNAIL"
        custom-style="width: 100%; height: 200rpx"
        @open="onOpenB"
      >
        <view class="prize-slot">
          <text class="prize-slot__text">Better luck next time</text>
        </view>
      </SnScratchcard>
      <text class="scratch-case__meta">
        State: {{ openedB ? 'opened (no more open this round)' : 'waiting for scratch' }}
      </text>
      <view class="scratch-case__btn" hover-class="scratch-case__btn--down" @tap="resetCard('B')">
        <text class="scratch-case__btn-text">Reset B</text>
      </view>
    </view>

    <view class="scratch-log">
      <text v-for="(line, index) in log" :key="index" class="scratch-log__line">{{ line }}</text>
      <text v-if="log.length === 0" class="scratch-log__line">No open events yet</text>
    </view>
  </view>
</template>

<style scoped>
.scratch-case {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-2);
}

.scratch-case__label {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
  font-weight: var(--sn-mp-font-weight-semibold);
}

.scratch-case__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
}

.scratch-case__btn {
  align-self: flex-start;
  padding: 10rpx 32rpx;
  border-radius: 28rpx;
  background-color: var(--sn-mp-color-background-subtle);
}

.scratch-case__btn--down {
  opacity: 0.8;
}

.scratch-case__btn-text {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-xs);
}

.prize-slot {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.prize-slot__text {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-semibold);
}

.scratch-log {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-1);
  box-sizing: border-box;
  width: 100%;
  padding: var(--sn-mp-spacing-3);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-subtle);
}

.scratch-log__line {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
