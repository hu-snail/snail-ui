<script setup lang="ts">
/**
 * Demo: sn-paging (uni-end) — second floor + capsule switchers (EN).
 *
 * - secondFloorEnabled on: releasing past the threshold (100px) slides in the
 *   fullscreen second floor (release intercepts the refresh; uni-h5's
 *   synthetic release echo is neutralized by the component's arming latch)
 * - The floor can be dragged back by swiping up (content at bottom or not
 *   scrollable); closeSecondFloor() works programmatically
 * - sn-segmented capsules switch refresherLoadingType (spinner shape) and
 *   refresherBackground (pull-area background presets) live
 */
import { ref } from 'vue';
import SnPaging from '@snui/uni-src/components/sn-paging/sn-paging.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import SnSegmented from '@snui/uni-src/components/sn-segmented/sn-segmented.vue';
import {
  Bell,
  Calendar,
  Camera,
  Heart,
  Home,
  Mail,
  MessageCircle,
  Star,
} from '@snui/uni-src/components/sn-icon/sn-icon-set';
import type { LoadingType } from '@snui/uni-src/components/sn-loading/sn-loading-types';

interface DemoRow {
  id: number;
  label: string;
}

interface FloorApp {
  label: string;
  icon: (typeof FLOOR_ICONS)[number];
  color: string;
}

const TOTAL = 24;
const PAGE_SIZE = 8;
const list = ref<DemoRow[]>([]);
const paging = ref<InstanceType<typeof SnPaging> | null>(null);
const floorVisits = ref(0);
const loadingType = ref<LoadingType>('circular');
const floorBackground = ref('#0b1220');

/** Second-floor grid: 8 icons + colors cycled into 16 "mini program" tiles. */
const FLOOR_ICONS = [Home, Star, Heart, Bell, Camera, Mail, MessageCircle, Calendar];
const FLOOR_COLORS = [
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#06b6d4',
  '#ef4444',
  '#6366f1',
];
const floorApps: FloorApp[] = Array.from({ length: 16 }, (_, i) => ({
  label: `App ${i + 1}`,
  icon: FLOOR_ICONS[i % FLOOR_ICONS.length],
  color: FLOOR_COLORS[i % FLOOR_COLORS.length],
}));

const loadingTypeOptions = [
  { label: 'Circular', value: 'circular' },
  { label: 'Spinner', value: 'spinner' },
  { label: 'Dots', value: 'dots' },
  { label: 'Wave', value: 'wave' },
];

const backgroundOptions = [
  { label: 'Deep', value: '#0b1220' },
  { label: 'Indigo', value: '#1e1b4b' },
  { label: 'Pine', value: '#14342b' },
];

function query(pageNo: number, pageSize: number): void {
  setTimeout(() => {
    const start = (pageNo - 1) * pageSize;
    const rows: DemoRow[] = Array.from({ length: Math.min(pageSize, TOTAL - start) }, (_, i) => ({
      id: start + i + 1,
      label: `Item ${start + i + 1}`,
    }));
    paging.value?.completeByTotal(rows, TOTAL);
  }, 400);
}

function onSecondFloorChange(phase: 'go' | 'close'): void {
  if (phase === 'go') floorVisits.value += 1;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="floor-controls">
      <SnSegmented v-model="loadingType" :options="loadingTypeOptions" />
      <SnSegmented v-model="floorBackground" :options="backgroundOptions" />
    </view>
    <view class="floor-hint">
      <text class="floor-hint__text">
        Pull past the threshold and release to enter the fullscreen second floor; swipe up inside
        (content at its bottom) to drag it back (visited {{ floorVisits }} times)
      </text>
    </view>
    <view class="paging-frame">
      <SnPaging
        ref="paging"
        v-model="list"
        :default-page-size="PAGE_SIZE"
        second-floor-enabled
        :refresher-background="floorBackground"
        refresher-text-color="#e2e8f0"
        refresher-icon-color="#38bdf8"
        :refresher-loading-type="loadingType"
        second-floor-background="#121a2b"
        @query="query"
        @second-floor-change="onSecondFloorChange"
      >
        <view v-for="row in list" :key="row.id" class="paging-row">
          <text class="paging-row__label">{{ row.label }}</text>
        </view>
        <template #secondFloor>
          <view class="floor">
            <text class="floor__title">My Mini Programs</text>
            <view class="floor__grid">
              <view v-for="app in floorApps" :key="app.label" class="floor__item">
                <view class="floor__item-icon" :style="{ background: app.color }">
                  <SnIcon :icon="app.icon" :size="22" color="#ffffff" />
                </view>
                <text class="floor__item-label">{{ app.label }}</text>
              </view>
            </view>
            <view class="floor__footer">
              <view class="floor__back" @click="paging?.closeSecondFloor()">
                <text class="floor__back-text">Back to Home</text>
              </view>
            </view>
          </view>
        </template>
      </SnPaging>
    </view>
  </view>
</template>

<style scoped>
.floor-controls {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-2);
}

.floor-hint {
  padding: 0 var(--sn-mp-spacing-1);
}

.floor-hint__text {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
}

.paging-frame {
  box-sizing: border-box;
  height: 520rpx;
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-md);
  overflow: hidden;
}

.paging-row {
  box-sizing: border-box;
  width: 100%;
  padding: var(--sn-mp-spacing-4);
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle);
  background-color: var(--sn-mp-color-background-surface);
}

.paging-row__label {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-md);
  line-height: var(--sn-mp-font-line-height-normal);
}

/* Second floor: fullscreen dark panel — title + 4-column icon grid + bottom
 * back bar. */
.floor {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: 120rpx 40rpx calc(48rpx + env(safe-area-inset-bottom));
}

.floor__title {
  color: #f1f5f9;
  font-size: var(--sn-mp-font-size-xl);
  font-weight: 600;
  line-height: var(--sn-mp-font-line-height-normal);
  text-align: center;
}

.floor__grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 72rpx;
}

.floor__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  width: 25%;
  margin-bottom: 48rpx;
}

.floor__item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 104rpx;
  height: 104rpx;
  border-radius: 32rpx;
}

.floor__item-label {
  margin-top: 14rpx;
  color: rgba(241, 245, 249, 0.82);
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
}

.floor__footer {
  margin-top: auto;
  padding-top: 56rpx;
}

.floor__back {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  height: 96rpx;
  border-radius: var(--sn-mp-radius-full);
  background: rgba(148, 163, 184, 0.16);
}

.floor__back-text {
  color: #e2e8f0;
  font-size: var(--sn-mp-font-size-md);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
