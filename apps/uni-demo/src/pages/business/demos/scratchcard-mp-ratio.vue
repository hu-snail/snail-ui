<script setup lang="ts">
/**
 * Demo: sn-scratchcard (uni-end) — 刮开阈值：ratio（0.3 vs 0.9）。
 */
import { ref } from 'vue';
import SnScratchcard from '@snui/uni-src/components/sn-scratchcard/sn-scratchcard.vue';

const easyRef = ref<InstanceType<typeof SnScratchcard> | null>(null);
const hardRef = ref<InstanceType<typeof SnScratchcard> | null>(null);

function resetAll(): void {
  easyRef.value?.reset();
  hardRef.value?.reset();
}
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">ratio 阈值：0.3 一刮就开 vs 0.9 刮满才开</text>
    <view class="scratch-pair">
      <SnScratchcard
        ref="easyRef"
        title="低阈值"
        :ratio="0.3"
        custom-style="width: 320rpx; height: 180rpx"
      >
        <view class="prize-slot">
          <text class="prize-slot__text">30% 即揭示</text>
        </view>
      </SnScratchcard>
      <SnScratchcard
        ref="hardRef"
        title="高阈值"
        :ratio="0.9"
        custom-style="width: 320rpx; height: 180rpx"
      >
        <view class="prize-slot">
          <text class="prize-slot__text">90% 才揭示</text>
        </view>
      </SnScratchcard>
    </view>

    <view class="scratch-actions">
      <view class="scratch-actions__btn" hover-class="scratch-actions__btn--down" @tap="resetAll">
        <text class="scratch-actions__btn-text">全部重置</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.scratch-pair {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: var(--sn-mp-spacing-3);
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
  font-size: var(--sn-mp-font-size-sm);
}

.scratch-actions {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.scratch-actions__btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 14rpx 48rpx;
  border-radius: 32rpx;
  background-color: var(--sn-mp-color-background-subtle);
}

.scratch-actions__btn--down {
  opacity: 0.8;
}

.scratch-actions__btn-text {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-sm);
}

.sn-demo__title {
  font-size: var(--sn-mp-font-size-sm);
  font-weight: var(--sn-mp-font-weight-semibold);
  color: var(--sn-mp-color-text-secondary);
}
</style>
