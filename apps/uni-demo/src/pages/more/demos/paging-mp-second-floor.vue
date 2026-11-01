<script setup lang="ts">
/**
 * Demo: sn-paging (uni-end) — 下拉进入二楼 + 自定义刷新区配色。
 *
 * - secondFloorEnabled 开启：下拉越过阈值（默认 100px）松手滑入二楼浮层，
 *   松手拦截刷新、不发 query
 * - #secondFloor 插槽渲染二楼内容（内部独立滚动）；secondFloorChange('go')
 *   时懒加载二楼数据，closeSecondFloor() 滑出返回列表
 * - refresherBackground / refresherTextColor / refresherIconColor 定制下拉区
 *   配色，secondFloorBackground 定制二楼背景
 */
import { ref } from 'vue';
import SnPaging from '@snui/uni-src/components/sn-paging/sn-paging.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { ChevronUp, Sparkles } from '@snui/uni-src/components/sn-icon/sn-icon-set';

interface DemoRow {
  id: number;
  label: string;
}

const TOTAL = 24;
const PAGE_SIZE = 8;
const list = ref<DemoRow[]>([]);
const paging = ref<InstanceType<typeof SnPaging> | null>(null);
const floorVisits = ref(0);

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
    <view class="floor-hint">
      <text class="floor-hint__text">深色下拉区 → 越拉越沉 → 越过阈值松手进入二楼（已进入 {{ floorVisits }} 次）</text>
    </view>
    <view class="paging-frame">
      <SnPaging
        ref="paging"
        v-model="list"
        :default-page-size="PAGE_SIZE"
        second-floor-enabled
        refresher-background="#0b1220"
        refresher-text-color="#e2e8f0"
        refresher-icon-color="#38bdf8"
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
                这里是二楼：下拉越过阈值松手即达，适合放活动入口、个性化面板或运营位。浮层滚动锁定在本层，不会穿透到列表。
              </text>
            </view>
          </view>
        </template>
      </SnPaging>
    </view>
  </view>
</template>

<style scoped>
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
