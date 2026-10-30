<script setup lang="ts">
/**
 * Demo: sn-tabs — composed with sn-paging: every pane hosts its own paged list.
 *
 * - pane content belongs to the host (sn-tabs only renders the strip and the panel
 *   container), so dropping `sn-paging` in works: pull-to-refresh and load-more ride
 *   its native `scroll-view`
 * - `sn-tab` defaults to `lazy`, so a pane mounts on first activation — and the paged
 *   list fires its first query only when that tab is first opened
 * - the host owns the pane height (`paging-frame`), because sn-paging needs a definite
 *   scroll box
 */
import { ref } from 'vue';
import SnTabs from '@snui/uni-src/components/sn-tabs/sn-tabs.vue';
import SnTab from '@snui/uni-src/components/sn-tabs/sn-tab.vue';
import SnPaging from '@snui/uni-src/components/sn-paging/sn-paging.vue';

interface DemoRow {
  id: number;
  label: string;
}

/** Totals for the two channels; 8 rows a page, so a short page ends the sequence. */
const FOR_YOU_TOTAL = 25;
const FOLLOWING_TOTAL = 12;

const active = ref(0);
const forYouList = ref<DemoRow[]>([]);
const followingList = ref<DemoRow[]>([]);
const forYouPaging = ref<InstanceType<typeof SnPaging> | null>(null);
const followingPaging = ref<InstanceType<typeof SnPaging> | null>(null);

/** Build one page: ids start at 1 and a short page means the last one. */
function buildPage(noun: string, total: number, pageNo: number, pageSize: number): DemoRow[] {
  const start = (pageNo - 1) * pageSize;
  const remaining = Math.max(total - start, 0);
  return Array.from({ length: Math.min(pageSize, remaining) }, (_, i) => ({
    id: start + i + 1,
    label: `${noun} ${String(start + i + 1).padStart(2, '0')}`,
  }));
}

function queryForYou(pageNo: number, pageSize: number): void {
  setTimeout(() => {
    forYouPaging.value?.completeByTotal(
      buildPage('Feed item', FOR_YOU_TOTAL, pageNo, pageSize),
      FOR_YOU_TOTAL,
    );
  }, 500);
}

function queryFollowing(pageNo: number, pageSize: number): void {
  setTimeout(() => {
    followingPaging.value?.completeByTotal(
      buildPage('Follow item', FOLLOWING_TOTAL, pageNo, pageSize),
      FOLLOWING_TOTAL,
    );
  }, 500);
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnTabs v-model="active" type="card">
      <SnTab title="For you" :name="0">
        <view class="paging-frame">
          <SnPaging
            ref="forYouPaging"
            v-model="forYouList"
            :default-page-size="8"
            @query="queryForYou"
          >
            <view v-for="row in forYouList" :key="row.id" class="paging-row">
              <text class="paging-row__label">{{ row.label }}</text>
              <text class="paging-row__index">{{ row.id }} / {{ FOR_YOU_TOTAL }}</text>
            </view>
          </SnPaging>
        </view>
      </SnTab>

      <SnTab title="Following" :name="1">
        <view class="paging-frame">
          <SnPaging
            ref="followingPaging"
            v-model="followingList"
            :default-page-size="8"
            @query="queryFollowing"
          >
            <view v-for="row in followingList" :key="row.id" class="paging-row">
              <text class="paging-row__label">{{ row.label }}</text>
              <text class="paging-row__index">{{ row.id }} / {{ FOLLOWING_TOTAL }}</text>
            </view>
          </SnPaging>
        </view>
      </SnTab>
    </SnTabs>

    <text class="sn-demo__meta">
      Active tab: {{ active }}; each pane pages independently and queries only when first opened
    </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-4);
  align-items: stretch;
}
.paging-frame {
  box-sizing: border-box;
  height: 520rpx;
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-md);
  overflow: hidden;
}
.paging-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  padding: var(--sn-mp-spacing-3) var(--sn-mp-spacing-4);
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle);
  background-color: var(--sn-mp-color-background-surface);
}
.paging-row__label {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-md);
}
.paging-row__index {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
