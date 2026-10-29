<script setup lang="ts">
/**
 * Demo: sn-fit-swiper (uni-end) — built-in indicator styles (dots /
 * dots-bar / fraction) on pages of different heights.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-fit-swiper from its SFC
 * source.
 */
import SnFitSwiper from '@snui/uni-src/components/sn-fit-swiper/sn-fit-swiper.vue';

interface RowPage {
  rows: number;
}

const pages: RowPage[] = [{ rows: 3 }, { rows: 1 }, { rows: 2 }];

/** Narrow the generic page row back to the demo page shape. */
function rowsOf(page: unknown): number {
  return (page as RowPage).rows;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnFitSwiper :list="pages" :height="300" :indicator="{ type: 'dots' }">
      <template #default="{ page }">
        <view class="sheet">
          <view v-for="row in rowsOf(page)" :key="row" class="sheet__row" />
        </view>
      </template>
    </SnFitSwiper>
    <SnFitSwiper :list="pages" :height="300" :indicator="{ type: 'dots-bar' }">
      <template #default="{ page }">
        <view class="sheet">
          <view v-for="row in rowsOf(page)" :key="row" class="sheet__row" />
        </view>
      </template>
    </SnFitSwiper>
    <SnFitSwiper :list="pages" :height="300" :indicator="{ type: 'fraction' }">
      <template #default="{ page }">
        <view class="sheet">
          <view v-for="row in rowsOf(page)" :key="row" class="sheet__row" />
        </view>
      </template>
    </SnFitSwiper>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.sheet {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding: 32rpx 24rpx;
}

.sheet__row {
  height: 96rpx;
  border-radius: 16rpx;
  background-color: var(--sn-mp-color-background-elevated);
  border: 2rpx solid var(--sn-mp-color-border-default);
}
</style>
