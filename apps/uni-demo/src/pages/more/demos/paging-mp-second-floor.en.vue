<script setup lang="ts">
/**
 * Demo: sn-paging (uni-end) — second floor + custom refresher colors (EN).
 *
 * - secondFloorEnabled on: releasing past the threshold (100px) slides in the
 *   second-floor overlay and never fires a refresh query
 * - #secondFloor slot renders the floor content (own scroll area); data can
 *   be lazy-loaded on secondFloorChange('go'), closeSecondFloor() slides out
 * - refresherBackground / refresherTextColor / refresherIconColor theme the
 *   pull area; secondFloorBackground themes the overlay
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
    <view class="floor-hint">
      <text class="floor-hint__text">
        Dark pull area → resists while pulling → release past the threshold to enter the second
        floor (visited {{ floorVisits }} times)
      </text>
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
              <text class="floor__title">Welcome to the second floor</text>
              <view class="floor__close" @click="paging?.closeSecondFloor()">
                <SnIcon :icon="ChevronUp" :size="14" />
                <text class="floor__close-text">Back to list</text>
              </view>
            </view>
            <view class="floor__body">
              <text class="floor__text">
                This is the second floor: pull past the threshold and release to land here — a good
                spot for campaigns, personal panels or promo blocks. Scroll gestures stay locked in
                this layer and never leak to the list behind.
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
