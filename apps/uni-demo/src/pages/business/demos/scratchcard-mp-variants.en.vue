<script setup lang="ts">
/**
 * Demo: sn-scratchcard (uni-end) — Variant matrix: cover color / ratio
 * threshold (0.3 vs 0.9) / watermark text, size and color / title size and
 * color. Cover colors are literals because canvas fillStyle does not resolve
 * CSS variables.
 */
import { ref } from 'vue';
import SnScratchcard from '@snui/uni-src/components/sn-scratchcard/sn-scratchcard.vue';

const easyRef = ref<InstanceType<typeof SnScratchcard> | null>(null);
const hardRef = ref<InstanceType<typeof SnScratchcard> | null>(null);
const greenRef = ref<InstanceType<typeof SnScratchcard> | null>(null);
const wmRef = ref<InstanceType<typeof SnScratchcard> | null>(null);
const titleRef = ref<InstanceType<typeof SnScratchcard> | null>(null);

function resetAll(): void {
  greenRef.value?.reset();
  easyRef.value?.reset();
  hardRef.value?.reset();
  wmRef.value?.reset();
  titleRef.value?.reset();
}
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">coverColor</text>
    <SnScratchcard
      ref="greenRef"
      title="One more"
      cover-color="#BFE3C0"
      custom-style="width: 100%; height: 180rpx"
    >
      <view class="prize-slot">
        <text class="prize-slot__text">Green cover</text>
      </view>
    </SnScratchcard>

    <text class="sn-demo__title">ratio threshold: 0.3 easy vs 0.9 hard</text>
    <view class="scratch-pair">
      <SnScratchcard
        ref="easyRef"
        title="Low ratio"
        :ratio="0.3"
        custom-style="width: 320rpx; height: 180rpx"
      >
        <view class="prize-slot">
          <text class="prize-slot__text">Opens at 30%</text>
        </view>
      </SnScratchcard>
      <SnScratchcard
        ref="hardRef"
        title="High ratio"
        :ratio="0.9"
        custom-style="width: 320rpx; height: 180rpx"
      >
        <view class="prize-slot">
          <text class="prize-slot__text">Opens at 90%</text>
        </view>
      </SnScratchcard>
    </view>

    <text class="sn-demo__title">watermark: text / size / color</text>
    <SnScratchcard
      ref="wmRef"
      title="Watermark"
      watermark-text="AUI DEMO"
      :watermark-size="18"
      watermark-color="rgba(255, 255, 255, 0.55)"
      custom-style="width: 100%; height: 180rpx"
    >
      <view class="prize-slot">
        <text class="prize-slot__text">Diagonal watermark</text>
      </view>
    </SnScratchcard>

    <text class="sn-demo__title">title size and color</text>
    <SnScratchcard
      ref="titleRef"
      title="Thanks for playing"
      :title-size="32"
      title-color="rgba(255, 255, 255, 0.92)"
      cover-color="#4C5BD4"
      custom-style="width: 100%; height: 180rpx"
    >
      <view class="prize-slot">
        <text class="prize-slot__text">Dark cover + white title</text>
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
