<script setup lang="ts">
/**
 * Demo: sn-fit-swiper (uni-end) — King Kong grid pages with different row
 * counts; the container height re-fits on swipe.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-fit-swiper from its SFC
 * source. Per AGENTS.md §113, icons come from the SnIcon catalog.
 */
import SnFitSwiper from '@snui/uni-src/components/sn-fit-swiper/sn-fit-swiper.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { computed, ref } from 'vue';

interface KongItem {
  icon: string;
  label: string;
}

interface KongPage {
  title: string;
  items: KongItem[];
}

const pages: KongPage[] = [
  {
    title: '影娱',
    items: [
      { icon: 'star', label: '电影' },
      { icon: 'heart', label: '追剧' },
      { icon: 'image', label: '相册' },
      { icon: 'camera', label: '拍摄' },
      { icon: 'bell', label: '提醒' },
      { icon: 'calendar', label: '日程' },
      { icon: 'wallet', label: '钱包' },
      { icon: 'phone', label: '充值' },
    ],
  },
  {
    title: '出行',
    items: [
      { icon: 'search', label: '搜索' },
      { icon: 'message-circle', label: '消息' },
      { icon: 'user', label: '会员' },
      { icon: 'clock', label: '足迹' },
    ],
  },
];

const current = ref(0);

/** Narrow the generic page row back to the demo page shape. */
function itemsOf(page: unknown): KongItem[] {
  return (page as KongPage).items;
}

const activeTitle = computed(() => {
  const active = pages[current.value];
  return active ? active.title : '';
});
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnFitSwiper v-model:current="current" :list="pages" :height="440" radius="16rpx">
      <template #default="{ page }">
        <view class="kong">
          <view v-for="item in itemsOf(page)" :key="item.label" class="kong__cell">
            <view class="kong__tile">
              <SnIcon :icon="item.icon" :size="22" />
            </view>
            <text class="kong__label">{{ item.label }}</text>
          </view>
        </view>
      </template>
    </SnFitSwiper>
    <text class="sn-demo__caption">当前第 {{ current + 1 }} 页（{{ activeTitle }}）— 两页行数不同，滑动时高度自适应</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.sn-demo__caption {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}

.kong {
  display: flex;
  flex-wrap: wrap;
  background-color: var(--sn-mp-color-background-elevated);
  border-radius: 16rpx;
  padding: 24rpx 8rpx 8rpx;
}

.kong__cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  width: 25%;
  margin-bottom: 24rpx;
}

.kong__tile {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88rpx;
  height: 88rpx;
  border-radius: 28rpx;
  background-color: var(--sn-mp-color-action-primary);
}

.kong__label {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
