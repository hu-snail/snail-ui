<script setup lang="ts">
/** Demo: SnCarousel — vertical news ticker with autoplay. */
import { SnCarousel, SnCarouselItem } from '@snui/vue-web'

const news = [
  { date: '10-19', title: '平台双十一活动规则公布，预售 10 月 24 日开启' },
  { date: '10-18', title: '新版商家结算系统上线，账期缩短至 T+3' },
  { date: '10-17', title: '物流时效升级：长三角地区次日达全覆盖' },
  { date: '10-16', title: '开放平台新增 12 个 Webhook 事件订阅' },
  { date: '10-15', title: '秋季开发者沙龙报名开启，线下线上同步直播' },
]
</script>

<template>
  <div class="demo-col">
    <SnCarousel
      draggable
      direction="vertical"
      autoplay
      :interval="3000"
      :show-dots="false"
      style="height: 200px; border-radius: 8px; border: 1px solid var(--sn-web-color-border); background: var(--sn-web-color-background-surface)"
    >
      <SnCarouselItem v-for="(n, i) in news" :key="n.date">
        <div class="news-row" :class="{ 'news-row--first': i === 0 }">
          <span class="news-date">{{ n.date }}</span>
          <span class="news-title">{{ n.title }}</span>
        </div>
      </SnCarouselItem>
    </SnCarousel>
    <p class="demo-hint">每 3 秒向上滚动一条，鼠标悬停暂停，也可以按住上下拖拽。</p>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.news-row {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 100%;
  padding: 0 24px;
  border-bottom: 1px solid var(--sn-web-color-border);
  font-size: 14px;
}
.news-row--first {
  border-top: none;
}
.news-date {
  flex-shrink: 0;
  color: var(--sn-web-color-text-tertiary);
  font-variant-numeric: tabular-nums;
}
.news-title {
  color: var(--sn-web-color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.demo-hint {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
