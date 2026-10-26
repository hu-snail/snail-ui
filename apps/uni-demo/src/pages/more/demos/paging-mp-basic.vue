<script setup lang="ts">
/**
 * Demo: sn-paging (uni-end) — 基础用法：v-model + @query + completeByTotal。
 *
 * - 宿主在 @query 里发请求，拿到数据后用 completeByTotal 汇报
 * - sn-paging 聚合分页数据并经 v-model 推回宿主，列表行由默认插槽渲染
 * - 下拉刷新与触底加载由原生 scroll-view 承担，组件内无手势模拟
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
      label: `列表条目 ${String(start + i + 1).padStart(2, '0')}`,
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
    <text class="sn-demo__meta">下拉刷新、滚到底自动翻页；末页不足 10 条自动判停</text>
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
