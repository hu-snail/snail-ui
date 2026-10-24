<script setup lang="ts">
/**
 * Demo: sn-tabs — 动画、手势滑动、底部条尺寸与吸顶偏移。
 *
 * - `animated` 开启底部条过渡，`duration` 控制时长（ms）
 * - `swipeable` 打开面板区的手势切换：横向拖动超过 40px 切到相邻页签
 * - `line-width` / `line-height` 内联设置底部条尺寸（数字按 px，字符串原样转发）
 * - `sticky` + `offset-top` 让页签条吸顶并留出偏移
 * - `line-theme="dot"` / `"text"` 只改底部条几何，颜色仍走令牌
 */
import { ref } from 'vue'
import SnTabs from '@snui/uni-src/components/sn-tabs/sn-tabs.vue'
import SnTab from '@snui/uni-src/components/sn-tabs/sn-tab.vue'

const swipeActive = ref(0)
const lineActive = ref(0)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">animated + duration=600 + swipeable（在面板区左右拖动）</text>
    <SnTabs v-model="swipeActive" animated :duration="600" swipeable sticky :offset-top="12">
      <SnTab title="推荐" :name="0">左右拖动这块面板可以切换页签。</SnTab>
      <SnTab title="关注" :name="1">第二页内容。</SnTab>
      <SnTab title="热榜" :name="2">第三页内容。</SnTab>
    </SnTabs>

    <text class="sn-demo__label">line-width=64 / line-height=8，line-theme=underline</text>
    <SnTabs
      v-model="lineActive"
      line-theme="underline"
      :line-width="64"
      :line-height="8"
      animated
    >
      <SnTab title="日" :name="0">按日统计</SnTab>
      <SnTab title="周" :name="1">按周统计</SnTab>
      <SnTab title="月" :name="2">按月统计</SnTab>
    </SnTabs>

    <text class="sn-demo__label">line-theme=dot，line-width="24rpx"（字符串原样转发）</text>
    <SnTabs v-model="lineActive" line-theme="dot" line-width="24rpx" line-height="24rpx">
      <SnTab title="日" :name="0">按日统计</SnTab>
      <SnTab title="周" :name="1">按周统计</SnTab>
      <SnTab title="月" :name="2">按月统计</SnTab>
    </SnTabs>

    <text class="sn-demo__meta">当前页签：{{ swipeActive }} / {{ lineActive }}</text>
  </view>
</template>

<style scoped>
.sn-demo__label {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
