<script setup lang="ts">
/** Demo: SnCarousel — vertical news ticker with autoplay. */
import { SnCarousel, SnCarouselItem } from '@snui/vue-web';

const news = [
  { date: '10-19', title: 'Double 11 campaign rules announced; presale opens Oct 24' },
  { date: '10-18', title: 'New merchant settlement system live; payment terms shortened to T+3' },
  {
    date: '10-17',
    title: 'Logistics upgrade: next-day delivery now covers the whole Yangtze River Delta',
  },
  { date: '10-16', title: 'Open platform adds 12 new Webhook event subscriptions' },
  {
    date: '10-15',
    title: 'Fall developer meetup registration open, with live streaming onsite and online',
  },
];
</script>

<template>
  <div class="demo-col">
    <SnCarousel
      draggable
      direction="vertical"
      autoplay
      :interval="3000"
      :show-dots="false"
      style="
        height: 200px;
        border-radius: 8px;
        border: 1px solid var(--sn-web-color-border);
        background: var(--sn-web-color-background-surface);
      "
    >
      <SnCarouselItem v-for="(n, i) in news" :key="n.date">
        <div class="news-row" :class="{ 'news-row--first': i === 0 }">
          <span class="news-date">{{ n.date }}</span>
          <span class="news-title">{{ n.title }}</span>
        </div>
      </SnCarouselItem>
    </SnCarousel>
    <p class="demo-hint">
      Scrolls one item up every 3 seconds; hover to pause, or press and drag vertically.
    </p>
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
