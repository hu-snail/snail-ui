<script setup lang="ts">
/**
 * Demo: sn-tabs — 切换动画（animated / duration）与吸顶偏移。
 *
 * - `animated` 开启底部条过渡，同时把 `scroll-with-animation` 打开（选中项平滑滚进可视区）
 * - `duration` 控制过渡时长（ms），swiper 模式下同时是内容区滑动时长
 * - `sticky` + `offset-top` 让页签条吸顶并留出偏移
 * - `line-width` / `line-height` 内联设置底部条尺寸（数字按 px，字符串原样转发）
 */
import { ref } from 'vue';
import SnTabs from '@snui/uni-src/components/sn-tabs/sn-tabs.vue';
import SnTab from '@snui/uni-src/components/sn-tabs/sn-tab.vue';

const animatedActive = ref(0);
const stickyActive = ref(0);
const lineActive = ref(0);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">animated + duration=600（底部条过渡 + 滚动动画）</text>
    <SnTabs v-model="animatedActive" animated :duration="600">
      <SnTab title="推荐" :name="0">推荐内容</SnTab>
      <SnTab title="关注" :name="1">关注内容</SnTab>
      <SnTab title="热榜" :name="2">热榜内容</SnTab>
    </SnTabs>

    <text class="sn-demo__label">sticky + offset-top=12</text>
    <SnTabs v-model="stickyActive" sticky :offset-top="12">
      <SnTab title="推荐" :name="0">推荐内容</SnTab>
      <SnTab title="关注" :name="1">关注内容</SnTab>
      <SnTab title="热榜" :name="2">热榜内容</SnTab>
    </SnTabs>

    <text class="sn-demo__label">line-width=64 / line-height=8，line-theme=underline</text>
    <SnTabs v-model="lineActive" line-theme="underline" :line-width="64" :line-height="8" animated>
      <SnTab title="日" :name="0">按日统计</SnTab>
      <SnTab title="周" :name="1">按周统计</SnTab>
      <SnTab title="月" :name="2">按月统计</SnTab>
    </SnTabs>

    <text class="sn-demo__meta"
      >当前页签：{{ animatedActive }} / {{ stickyActive }} / {{ lineActive }}</text
    >
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-4);
  align-items: stretch;
}
.sn-demo__label {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
