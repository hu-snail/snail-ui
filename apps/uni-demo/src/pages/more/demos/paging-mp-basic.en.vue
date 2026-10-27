<script setup lang="ts">
/**
 * Demo: sn-paging (uni-end) — Basic usage: v-model + @query + completeByTotal.
 *
 * - The host issues the request inside @query and reports back with
 *   completeByTotal
 * - sn-paging aggregates paged data and pushes it back via v-model; rows are
 *   rendered through the default slot
 * - Pull-to-refresh and load-more-on-bottom are handled by the native
 *   scroll-view, with no gesture simulation inside the component
 */
import { ref } from 'vue';
import SnPaging from '@snui/uni-src/components/sn-paging/sn-paging.vue';

interface DemoRow {
  id: number;
  label: string;
}

const TOTAL = 35;
const PAGE_SIZE = 10;
const list = ref<DemoRow[]>([]);
const paging = ref<InstanceType<typeof SnPaging> | null>(null);

function query(pageNo: number, pageSize: number): void {
  setTimeout(() => {
    const start = (pageNo - 1) * pageSize;
    const rows: DemoRow[] = Array.from({ length: Math.min(pageSize, TOTAL - start) }, (_, i) => ({
      id: start + i + 1,
      label: `List item ${String(start + i + 1).padStart(2, '0')}`,
    }));
    paging.value?.completeByTotal(rows, TOTAL);
  }, 600);
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="paging-frame">
      <SnPaging ref="paging" v-model="list" :default-page-size="PAGE_SIZE" @query="query">
        <view v-for="row in list" :key="row.id" class="paging-row">
          <text class="paging-row__label">{{ row.label }}</text>
          <text class="paging-row__index">{{ row.id }} / {{ TOTAL }}</text>
        </view>
      </SnPaging>
    </view>
    <text class="sn-demo__meta"
      >Pull down to refresh, scroll to bottom for the next page; a short last page stops
      automatically</text
    >
  </view>
</template>

<style scoped>
.paging-frame {
  box-sizing: border-box;
  height: 560rpx;
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
  padding: var(--sn-mp-spacing-4);
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle);
  background-color: var(--sn-mp-color-background-surface);
}

.paging-row__label {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-md);
  line-height: var(--sn-mp-font-line-height-normal);
}

.paging-row__index {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
