<script setup lang="ts">
/**
 * Demo: sn-tabs — 与 sn-paging 组合：每个页签面板承载一个分页列表。
 *
 * - 页签面板内容是宿主自己的（sn-tabs 只渲染导航条与面板容器），所以面板里
 *   直接放 `sn-paging` 即可：下拉刷新、触底翻页都由它的原生 `scroll-view` 承担
 * - `sn-tab` 默认 `lazy`：面板首次激活后才渲染，因此分页列表的首次请求也只在
 *   首次切到该页签时发出
 * - 面板高度由宿主给（`paging-frame` 固定高），sn-paging 需要确定的滚动盒
 */
import { ref } from 'vue';
import SnTabs from '@snui/uni-src/components/sn-tabs/sn-tabs.vue';
import SnTab from '@snui/uni-src/components/sn-tabs/sn-tab.vue';
import SnPaging from '@snui/uni-src/components/sn-paging/sn-paging.vue';

interface DemoRow {
  id: number;
  label: string;
}

/** 两个频道的总条数；每页 8 条，末页不足即判停。 */
const FOR_YOU_TOTAL = 25;
const FOLLOWING_TOTAL = 12;

const active = ref(0);
const forYouList = ref<DemoRow[]>([]);
const followingList = ref<DemoRow[]>([]);
const forYouPaging = ref<InstanceType<typeof SnPaging> | null>(null);
const followingPaging = ref<InstanceType<typeof SnPaging> | null>(null);

/** 组装一页数据：序号从 1 起，不足一页即末页。 */
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
      buildPage('推荐条目', FOR_YOU_TOTAL, pageNo, pageSize),
      FOR_YOU_TOTAL,
    );
  }, 500);
}

function queryFollowing(pageNo: number, pageSize: number): void {
  setTimeout(() => {
    followingPaging.value?.completeByTotal(
      buildPage('关注条目', FOLLOWING_TOTAL, pageNo, pageSize),
      FOLLOWING_TOTAL,
    );
  }, 500);
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnTabs v-model="active" type="card">
      <SnTab title="推荐" :name="0">
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

      <SnTab title="关注" :name="1">
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

    <text class="sn-demo__meta">当前页签：{{ active }}；每个面板独立分页，首次激活才发请求</text>
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
