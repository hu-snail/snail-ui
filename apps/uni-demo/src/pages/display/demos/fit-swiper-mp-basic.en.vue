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
  tone: number;
}

interface KongPage {
  title: string;
  items: KongItem[];
}

const pages: KongPage[] = [
  {
    title: 'Media',
    items: [
      { icon: 'star', label: 'Movies', tone: 1 },
      { icon: 'heart', label: 'Shows', tone: 2 },
      { icon: 'image', label: 'Albums', tone: 3 },
      { icon: 'camera', label: 'Camera', tone: 4 },
      { icon: 'bell', label: 'Alerts', tone: 5 },
      { icon: 'calendar', label: 'Events', tone: 6 },
      { icon: 'wallet', label: 'Wallet', tone: 7 },
      { icon: 'phone', label: 'Top-up', tone: 8 },
    ],
  },
  {
    title: 'Daily',
    items: [
      { icon: 'search', label: 'Search', tone: 1 },
      { icon: 'message-circle', label: 'Chats', tone: 2 },
      { icon: 'user', label: 'Member', tone: 3 },
      { icon: 'clock', label: 'History', tone: 4 },
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
    <SnFitSwiper v-model:current="current" :list="pages" :height="440" radius="16rpx" :indicator="{ type: 'slider' }">
      <template #default="{ page }">
        <view class="kong">
          <view v-for="item in itemsOf(page)" :key="item.label" class="kong__cell">
            <view :class="`kong__tile kong__tile--${item.tone}`">
              <SnIcon :icon="item.icon" :size="24" color="#ffffff" />
            </view>
            <text class="kong__label">{{ item.label }}</text>
          </view>
        </view>
      </template>
    </SnFitSwiper>
    <text class="sn-demo__caption">Page {{ current + 1 }} ({{ activeTitle }}) — height adapts on swipe, slider-rail indicator</text>
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

/* Gradient-diffuse tile palettes — showcase content, not theme tokens. */
.kong__tile {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88rpx;
  height: 88rpx;
  border-radius: 28rpx;
}

.kong__tile--1 { background: radial-gradient(120% 120% at 25% 20%, #6ea8ff 0%, #2b6bf3 60%, #1d4fd7 100%); }
.kong__tile--2 { background: radial-gradient(120% 120% at 25% 20%, #ffb26b 0%, #f5722e 60%, #e05a12 100%); }
.kong__tile--3 { background: radial-gradient(120% 120% at 25% 20%, #c084fc 0%, #8b5cf6 60%, #7c3aed 100%); }
.kong__tile--4 { background: radial-gradient(120% 120% at 25% 20%, #5eead4 0%, #14b8a6 60%, #0d9488 100%); }
.kong__tile--5 { background: radial-gradient(120% 120% at 25% 20%, #f9a8d4 0%, #ec4899 60%, #db2777 100%); }
.kong__tile--6 { background: radial-gradient(120% 120% at 25% 20%, #fcd34d 0%, #f59e0b 60%, #d97706 100%); }
.kong__tile--7 { background: radial-gradient(120% 120% at 25% 20%, #93c5fd 0%, #3b82f6 60%, #2563eb 100%); }
.kong__tile--8 { background: radial-gradient(120% 120% at 25% 20%, #86efac 0%, #22c55e 60%, #16a34a 100%); }

.kong__label {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
