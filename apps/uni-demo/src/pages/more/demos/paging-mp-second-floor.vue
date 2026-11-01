<script setup lang="ts">
/**
 * Demo: sn-paging (uni-end) — 下拉进入二楼 + 加载动画/配色胶囊切换。
 *
 * - secondFloorEnabled 开启：下拉越过阈值（默认 100px）松手滑入全屏二楼浮层，
 *   松手拦截刷新、不发 query
 * - 二楼内容无法滚动（或滚到底）时上滑可拉回列表；也可用 closeSecondFloor()
 * - sn-segmented 胶囊切换器实时切换 refresherLoadingType（加载圈形态）与
 *   refresherBackground（下拉区背景预设）
 */
import { ref } from 'vue';
import SnPaging from '@snui/uni-src/components/sn-paging/sn-paging.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import SnSegmented from '@snui/uni-src/components/sn-segmented/sn-segmented.vue';
import { ChevronUp, Sparkles } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import type { LoadingType } from '@snui/uni-src/components/sn-loading/sn-loading-types';

interface DemoRow {
  id: number;
  label: string;
}

const TOTAL = 24;
const PAGE_SIZE = 8;
const list = ref<DemoRow[]>([]);
const paging = ref<InstanceType<typeof SnPaging> | null>(null);
const floorVisits = ref(0);
const loadingType = ref<LoadingType>('circular');
const floorBackground = ref('#0b1220');

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
        second-floor-background="#0b1220"
        @query="query"
        @second-floor-change="onSecondFloorChange"
      >
        <view v-for="row in list" :key="row.id" class="paging-row">
          <text class="paging-row__label">{{ row.label }}</text>
        </view>
        <template #secondFloor>
          <view class="floor">
            <view class="floor__head">
              <SnIcon :icon="Sparkles" :size="18" class="floor__spark" />
              <text class="floor__title">欢迎来到二楼</text>
              <view class="floor__close" @click="paging?.closeSecondFloor()">
                <SnIcon :icon="ChevronUp" :size="14" />
                <text class="floor__close-text">回到列表</text>
              </view>
            </view>
            <view class="floor__body">
              <text class="floor__text">
                这里是二楼：下拉越过阈值松手即达，适合放活动入口、个性化面板或运营位。内容滚到底后继续上滑，浮层跟手拉回列表。
              </text>
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

.floor {
  box-sizing: border-box;
  min-height: 100%;
  padding: var(--sn-mp-spacing-6);
}

.floor__head {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--sn-mp-spacing-2);
}

.floor__spark {
  color: #38bdf8;
}

.floor__title {
  flex: 1;
  color: #e2e8f0;
  font-size: var(--sn-mp-font-size-lg);
  font-weight: 600;
  line-height: var(--sn-mp-font-line-height-normal);
}

.floor__close {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--sn-mp-spacing-1);
  padding: var(--sn-mp-spacing-1) var(--sn-mp-spacing-3);
  border: 2rpx solid rgba(226, 232, 240, 0.35);
  border-radius: var(--sn-mp-radius-full);
  color: #e2e8f0;
}

.floor__close-text {
  color: inherit;
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
}

.floor__body {
  margin-top: var(--sn-mp-spacing-5);
}

.floor__text {
  color: #94a3b8;
  font-size: var(--sn-mp-font-size-md);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
