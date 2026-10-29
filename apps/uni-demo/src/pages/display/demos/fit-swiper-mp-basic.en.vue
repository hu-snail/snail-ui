<script setup lang="ts">
/**
 * Demo: sn-fit-swiper (uni-end) — English shadow of fit-swiper-mp-basic.
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
    title: 'Media',
    items: [
      { icon: 'star', label: 'Movies' },
      { icon: 'heart', label: 'Shows' },
      { icon: 'image', label: 'Albums' },
      { icon: 'camera', label: 'Camera' },
      { icon: 'bell', label: 'Alerts' },
      { icon: 'calendar', label: 'Events' },
      { icon: 'wallet', label: 'Wallet' },
      { icon: 'phone', label: 'Top-up' },
    ],
  },
  {
    title: 'Daily',
    items: [
      { icon: 'search', label: 'Search' },
      { icon: 'message-circle', label: 'Chats' },
      { icon: 'user', label: 'Member' },
      { icon: 'clock', label: 'History' },
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
    <text class="sn-demo__caption">Page {{ current + 1 }} ({{ activeTitle }}) — different row counts per page, height adapts on swipe</text>
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
