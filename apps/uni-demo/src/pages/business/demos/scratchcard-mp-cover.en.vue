<script setup lang="ts">
/**
 * Demo: sn-scratchcard (uni-end) — Cover color: `coverColor` (literal value:
 * canvas fillStyle does not resolve CSS variables).
 */
import { ref } from 'vue';
import SnScratchcard from '@snui/uni-src/components/sn-scratchcard/sn-scratchcard.vue';

const greenRef = ref<InstanceType<typeof SnScratchcard> | null>(null);
const blueRef = ref<InstanceType<typeof SnScratchcard> | null>(null);

function resetAll(): void {
  greenRef.value?.reset();
  blueRef.value?.reset();
}
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">coverColor cover fill</text>
    <SnScratchcard
      ref="greenRef"
      title="Scratch again"
      cover-color="#BFE3C0"
      custom-style="width: 100%; height: 180rpx"
    >
      <view class="prize-slot">
        <text class="prize-slot__text">Green cover</text>
      </view>
    </SnScratchcard>
    <SnScratchcard
      ref="blueRef"
      title="Scratch for a surprise"
      cover-color="#4C5BD4"
      custom-style="width: 100%; height: 180rpx"
    >
      <view class="prize-slot">
        <text class="prize-slot__text">Deep-blue cover</text>
      </view>
    </SnScratchcard>

    <view class="scratch-actions">
      <view class="scratch-actions__btn" hover-class="scratch-actions__btn--down" @tap="resetAll">
        <text class="scratch-actions__btn-text">Reset all</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
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
