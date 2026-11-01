<script setup lang="ts">
/**
 * Demo: sn-paging (uni-end) — 下拉进入二楼 + 加载动画/配色胶囊切换。
 *
 * - secondFloorEnabled 开启：下拉越过阈值（默认 100px）松手即滑入全屏二楼
 *   （松手拦截刷新、不发 query；uni-h5 松手补发的 pulling 事件由组件锁存兜底）
 * - 二楼内容无法滚动（或滚到底）时上滑可拉回列表；也可用 closeSecondFloor()
 * - sn-segmented 胶囊切换器实时切换 refresherLoadingType（加载圈形态）与
 *   refresherBackground（下拉区背景预设）
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

/** 二楼九宫格内容：循环 8 个图标与底色，凑 16 个「小程序」入口。 */
const FLOOR_ICONS = [Home, Star, Heart, Bell, Camera, Mail, MessageCircle, Calendar];const FLOOR_COLORS = [
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
  label: `小程序${i + 1}`,
  icon: FLOOR_ICONS[i % FLOOR_ICONS.length],
  color: FLOOR_COLORS[i % FLOOR_COLORS.length],
}));

const loadingTypeOptions = [
  { label: '圆环', value: 'circular' },
  { label: '放射', value: 'spinner' },
  { label: '圆点', value: 'dots' },
  { label: '波浪', value: 'wave' },
];

const backgroundOptions = [
  { label: '深空', value: '#0b1220' },
  { label: '靛蓝', value: '#1e1b4b' },
  { label: '松绿', value: '#14342b' },
];

function query(pageNo: number, pageSize: number): void {
  setTimeout(() => {
    const start = (pageNo - 1) * pageSize;
    const rows: DemoRow[] = Array.from({ length: Math.min(pageSize, TOTAL - start) }, (_, i) => ({
      id: start + i + 1,
      label: `条目 ${start + i + 1}`,
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
        下拉越过阈值松手进入全屏二楼；二楼内上滑（内容到底后）可拉回列表（已进入 {{ floorVisits }} 次）
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
            <text class="floor__title">我的小程序</text>
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
                <text class="floor__back-text">回到首页</text>
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

/* 二楼：全屏深色面板（截屏样式）——标题 + 4 列图标网格 + 底部回到首页。 */
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
