<script setup lang="ts">
/**
 * Demo: sn-fit-swiper (uni-end) — custom indicator through the #indicator
 * scoped slot (receives { current, total }); positioning stays with the
 * component.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-fit-swiper from its SFC
 * source.
 */
import SnFitSwiper from '@snui/uni-src/components/sn-fit-swiper/sn-fit-swiper.vue';

interface CardPage {
  lines: number;
}

const pages: CardPage[] = [{ lines: 2 }, { lines: 4 }, { lines: 1 }];

/** Narrow the generic page row back to the demo page shape. */
function linesOf(page: unknown): number {
  return (page as CardPage).lines;
}
</script>

<template>
  <view class="sn-demo">
    <SnFitSwiper :list="pages" :height="320" radius="16rpx">
      <template #default="{ page }">
        <view class="board">
          <view v-for="line in linesOf(page)" :key="line" class="board__line" />
        </view>
      </template>
      <template #indicator="{ current, total }">
        <view class="pager">
          <text class="pager__text">第 {{ current + 1 }} / {{ total }} 页</text>
        </view>
      </template>
    </SnFitSwiper>
  </view>
</template>

<style scoped>
.board {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding: 32rpx 24rpx;
}

.board__line {
  height: 88rpx;
  border-radius: 16rpx;
  background-color: var(--sn-mp-color-action-primary-soft);
}

.pager {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8rpx 24rpx;
  border-radius: 999rpx;
  background-color: var(--sn-mp-color-action-primary);
}

.pager__text {
  color: var(--sn-mp-color-text-on-primary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
