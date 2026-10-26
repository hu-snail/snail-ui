<script setup lang="ts">
/**
 * Demo: sn-paging (uni-end) — App case: tabbed channel feed + detail page.
 *
 * Level 1: #top search bar + sn-tabs with three channels (switching a tab
 *          reloads the data source) + tappable feed rows that open the detail
 *          page, with a fixed action bar in #bottom
 * Level 2: an independent comment-list paging instance + back button; both
 *          pages are complete sn-paging cases
 * safe-area-inset-bottom: the bottom action bar container opts into safe-area
 * padding
 */
import { ref } from 'vue';
import SnPaging from '@snui/uni-src/components/sn-paging/sn-paging.vue';
import SnTabs from '@snui/uni-src/components/sn-tabs/sn-tabs.vue';
import SnTab from '@snui/uni-src/components/sn-tabs/sn-tab.vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

interface FeedRow {
  id: string;
  title: string;
}

interface ReplyRow {
  id: string;
  label: string;
}

const channels = [
  { name: 'For You', tag: 'hot' },
  { name: 'Following', tag: 'follow' },
  { name: 'Trending', tag: 'rank' },
];
const PAGE_SIZE = 8;

const page = ref<'home' | 'detail'>('home');
const activeChannel = ref(0);
const currentPost = ref('');

const feed = ref<FeedRow[]>([]);
const replies = ref<ReplyRow[]>([]);
const homePaging = ref<InstanceType<typeof SnPaging> | null>(null);
const detailPaging = ref<InstanceType<typeof SnPaging> | null>(null);

function channelTotal(tag: string): number {
  if (tag === 'rank') return 12;
  if (tag === 'follow') return 8;
  return 30;
}

function queryFeed(pageNo: number, pageSize: number): void {
  const tag = channels[activeChannel.value].tag;
  setTimeout(() => {
    const total = channelTotal(tag);
    const start = (pageNo - 1) * pageSize;
    const rows = Array.from({ length: Math.max(0, Math.min(pageSize, total - start)) }, (_, i) => ({
      id: `${tag}-${start + i + 1}`,
      title: `${channels[activeChannel.value].name} · feed item ${start + i + 1}`,
    }));
    homePaging.value?.completeByTotal(rows, total);
  }, 500);
}

function queryReplies(pageNo: number, pageSize: number): void {
  setTimeout(() => {
    const total = 23;
    const start = (pageNo - 1) * pageSize;
    const rows = Array.from({ length: Math.max(0, Math.min(pageSize, total - start)) }, (_, i) => ({
      id: `r-${start + i + 1}`,
      label: `Comment ${start + i + 1} on "${currentPost.value}"`,
    }));
    detailPaging.value?.completeByTotal(rows, total);
  }, 500);
}

function onChannelChange(payload: { index: number }): void {
  activeChannel.value = payload.index;
  homePaging.value?.reload();
}

function openDetail(row: FeedRow): void {
  currentPost.value = row.title;
  page.value = 'detail';
  detailPaging.value?.reload();
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <!-- Detail page: comment list (an independent paging instance) -->
    <view v-if="page === 'detail'" class="paging-frame">
      <SnPaging
        ref="detailPaging"
        v-model="replies"
        :default-page-size="PAGE_SIZE"
        @query="queryReplies"
      >
        <template #top>
          <view class="paging-detailbar">
            <SnButton size="small" @click="page = 'home'">Back</SnButton>
            <text class="paging-detailbar__title">Comments (23)</text>
          </view>
        </template>
        <view v-for="row in replies" :key="row.id" class="paging-row">
          <text class="paging-row__label">{{ row.label }}</text>
        </view>
      </SnPaging>
    </view>

    <!-- Home page: channel feed -->
    <view v-else class="paging-frame">
      <SnPaging
        ref="homePaging"
        v-model="feed"
        :default-page-size="PAGE_SIZE"
        safe-area-inset-bottom
        @query="queryFeed"
      >
        <template #top>
          <view class="paging-search">
            <text class="paging-search__text">Search what you like</text>
          </view>
          <SnTabs v-model="activeChannel" @change="onChannelChange">
            <SnTab v-for="channel in channels" :key="channel.tag" :title="channel.name" />
          </SnTabs>
        </template>

        <view v-for="row in feed" :key="row.id" class="paging-row" @click="openDetail(row)">
          <text class="paging-row__label">{{ row.title }}</text>
          <text class="paging-row__hint">Comments</text>
        </view>

        <template #bottom>
          <view class="paging-actions">
            <text class="paging-actions__text">#bottom action bar · safe-area aware</text>
          </view>
        </template>
      </SnPaging>
    </view>

    <text class="sn-demo__meta">
      {{
        page === 'home'
          ? 'Switching a channel = reload(); tap a row to open the detail page'
          : 'The detail page is a separate sn-paging instance; the home list keeps its state after going back'
      }}
    </text>
  </view>
</template>

<style scoped>
.paging-frame {
  box-sizing: border-box;
  height: 640rpx;
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-md);
  overflow: hidden;
}

.paging-search {
  box-sizing: border-box;
  width: calc(100% - 48rpx);
  margin: var(--sn-mp-spacing-2) var(--sn-mp-spacing-3) 0;
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-3);
  background-color: var(--sn-mp-color-background-subtle);
  border-radius: var(--sn-mp-radius-md);
}

.paging-search__text {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
}

.paging-detailbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--sn-mp-spacing-3);
  box-sizing: border-box;
  width: 100%;
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-3);
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle);
  background-color: var(--sn-mp-color-background-surface);
}

.paging-detailbar__title {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-medium);
  line-height: var(--sn-mp-font-line-height-normal);
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

.paging-row__hint {
  color: var(--sn-mp-color-action-primary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}

.paging-actions {
  box-sizing: border-box;
  width: 100%;
  padding: var(--sn-mp-spacing-3);
  border-top: 2rpx solid var(--sn-mp-color-border-subtle);
  background-color: var(--sn-mp-color-background-surface);
}

.paging-actions__text {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
