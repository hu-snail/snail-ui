<script setup lang="ts">
/**
 * Demo: sn-fit-swiper (uni-end) — built-in indicator styles (dots / dots-bar
 * / fraction / slider rail) on King Kong grid pages with different heights.
 * Gradient-diffuse tiles with white sn-icons.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-fit-swiper from its SFC
 * source. Per AGENTS.md §113, icons come from the SnIcon catalog.
 */
import SnFitSwiper from '@snui/uni-src/components/sn-fit-swiper/sn-fit-swiper.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';

interface KongItem {
  icon: string;
  label: string;
  tone: number;
}

interface KongPage {
  items: KongItem[];
}

const ICONS = ['star', 'heart', 'image', 'camera', 'bell', 'calendar', 'wallet', 'phone', 'search', 'user', 'clock', 'message-circle', 'file', 'download', 'edit', 'settings'];
const LABELS = ['电影', '追剧', '相册', '拍摄', '提醒', '日程', '钱包', '充值', '搜索', '会员', '足迹', '消息', '文档', '下载', '笔记', '设置'];

const pages: KongPage[] = [8, 4, 6].map((count) => ({
  items: Array.from({ length: count }, (_, i) => ({
    icon: ICONS[i % ICONS.length]!,
    label: LABELS[i % LABELS.length]!,
    tone: (i % 8) + 1,
  })),
}));

/** Narrow the generic page row back to the demo page shape. */
function itemsOf(page: unknown): KongItem[] {
  return (page as KongPage).items;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnFitSwiper :list="pages" :height="440" :indicator="{ type: 'dots' }">
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
    <SnFitSwiper :list="pages" :height="440" :indicator="{ type: 'dots-bar' }">
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
    <SnFitSwiper :list="pages" :height="440" :indicator="{ type: 'fraction' }">
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
    <SnFitSwiper :list="pages" :height="440" :indicator="{ type: 'slider' }">
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
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
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
