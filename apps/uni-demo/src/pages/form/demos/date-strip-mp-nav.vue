<script setup lang="ts">
/** Demo: sn-date-strip — 导航按钮：show-nav 两侧翻页 + #prev / #next 自定义插槽 + pagechange。 */
import { ref } from 'vue';
import SnDateStrip from '@snui/uni-src/components/sn-date-strip/sn-date-strip.vue';

const start = new Date(2024, 5, 23).getTime();
const date = ref<number | number[] | null>(new Date(2024, 5, 27).getTime());
const pageLabel = ref('6 月 23 日 - 6 月 29 日');

const fmt = (ts: number) => {
  const d = new Date(ts);
  return `${d.getMonth() + 1} 月 ${d.getDate()} 日`;
};
const onPageChange = (e: { start: number; end: number }) => {
  pageLabel.value = `${fmt(e.start)} - ${fmt(e.end)}`;
};
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__meta">当前页：{{ pageLabel }}</text>
    <SnDateStrip
      v-model="date"
      :start-date="start"
      :count="7"
      show-nav
      show-lunar
      custom-class="sn-demo__strip"
      @pagechange="onPageChange"
    >
      <template #prev>
        <text class="sn-demo__nav">‹</text>
      </template>
      <template #next>
        <text class="sn-demo__nav">›</text>
      </template>
    </SnDateStrip>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}

.sn-demo__nav {
  font-size: 40rpx;
  line-height: 1;
  color: var(--sn-mp-color-text-secondary);
}
</style>
