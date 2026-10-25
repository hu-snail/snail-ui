<script setup lang="ts">
/**
 * Demo: sn-paging (uni-end) — 应用案例：tabs 频道流 + 二级页面。
 *
 * 一级页面：#top 搜索栏 + sn-tabs 三频道（切 tab 用 reload() 重置数据源）
 *          + 列表条目点击进入二级页面，#bottom 固定操作栏
 * 二级页面：独立评论列表分页 + 返回按钮；两页各是一个完整 sn-paging 案例
 * safe-area-inset-bottom 演示：底部操作栏容器开启安全区适配
 */
import { ref } from 'vue'
import SnPaging from '@snui/uni-src/components/sn-paging/sn-paging.vue'
import SnTabs from '@snui/uni-src/components/sn-tabs/sn-tabs.vue'
import SnTab from '@snui/uni-src/components/sn-tabs/sn-tab.vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'

interface FeedRow {
  id: string
  title: string
}

interface ReplyRow {
  id: string
  label: string
}

const channels = [
  { name: '推荐', tag: 'hot' },
  { name: '关注', tag: 'follow' },
  { name: '热榜', tag: 'rank' },
]
const PAGE_SIZE = 8

const page = ref<'home' | 'detail'>('home')
const activeChannel = ref(0)
const currentPost = ref('')

const feed = ref<FeedRow[]>([])
const replies = ref<ReplyRow[]>([])
const homePaging = ref<InstanceType<typeof SnPaging> | null>(null)
const detailPaging = ref<InstanceType<typeof SnPaging> | null>(null)

function channelTotal(tag: string): number {
  if (tag === 'rank') return 12
  if (tag === 'follow') return 8
  return 30
}

function queryFeed(pageNo: number, pageSize: number): void {
  const tag = channels[activeChannel.value].tag
  setTimeout(() => {
    const total = channelTotal(tag)
    const start = (pageNo - 1) * pageSize
    const rows = Array.from({ length: Math.max(0, Math.min(pageSize, total - start)) }, (_, i) => ({
      id: `${tag}-${start + i + 1}`,
      title: `${channels[activeChannel.value].name} · 信息流条目 ${start + i + 1}`,
    }))
    homePaging.value?.completeByTotal(rows, total)
  }, 500)
}

function queryReplies(pageNo: number, pageSize: number): void {
  setTimeout(() => {
    const total = 23
    const start = (pageNo - 1) * pageSize
    const rows = Array.from({ length: Math.max(0, Math.min(pageSize, total - start)) }, (_, i) => ({
      id: `r-${start + i + 1}`,
      label: `${currentPost.value} 的评论 ${start + i + 1}`,
    }))
    detailPaging.value?.completeByTotal(rows, total)
  }, 500)
}

function onChannelChange(payload: { index: number }): void {
  activeChannel.value = payload.index
  homePaging.value?.reload()
}

function openDetail(row: FeedRow): void {
  currentPost.value = row.title
  page.value = 'detail'
  detailPaging.value?.reload()
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <!-- 二级页面：评论列表（独立分页实例） -->
    <view v-if="page === 'detail'" class="paging-frame">
      <SnPaging ref="detailPaging" v-model="replies" :default-page-size="PAGE_SIZE" @query="queryReplies">
        <template #top>
          <view class="paging-detailbar">
            <SnButton size="small" @click="page = 'home'">返回</SnButton>
            <text class="paging-detailbar__title">评论（23）</text>
          </view>
        </template>
        <view v-for="row in replies" :key="row.id" class="paging-row">
          <text class="paging-row__label">{{ row.label }}</text>
        </view>
      </SnPaging>
    </view>

    <!-- 一级页面：频道信息流 -->
    <view v-else class="paging-frame">
      <SnPaging ref="homePaging" v-model="feed" :default-page-size="PAGE_SIZE" safe-area-inset-bottom @query="queryFeed">
        <template #top>
          <view class="paging-search">
            <text class="paging-search__text">搜索感兴趣的内容</text>
          </view>
          <SnTabs v-model="activeChannel" @change="onChannelChange">
            <SnTab v-for="channel in channels" :key="channel.tag" :title="channel.name" />
          </SnTabs>
        </template>

        <view v-for="row in feed" :key="row.id" class="paging-row" @click="openDetail(row)">
          <text class="paging-row__label">{{ row.title }}</text>
          <text class="paging-row__hint">查看评论</text>
        </view>

        <template #bottom>
          <view class="paging-actions">
            <text class="paging-actions__text">#bottom 固定操作栏 · 已适配安全区</text>
          </view>
        </template>
      </SnPaging>
    </view>

    <text class="sn-demo__meta">
      {{ page === 'home' ? '切频道 = reload() 重置；点条目进入二级页面' : '二级页面是独立的 sn-paging 实例，返回后一级列表状态保留' }}
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
