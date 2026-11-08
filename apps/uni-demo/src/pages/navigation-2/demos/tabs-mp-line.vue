<script setup lang="ts">
/**
 * Demo: sn-tabs — 底部条样式（line-theme）与禁用页签。
 *
 * - `line-theme` 切换底部条形态：normal 短条 / text 整块文字底 / underline 通栏下划线 / dot 圆点
 * - `line-width` / `line-height` 覆盖底部条尺寸（数字按 px，字符串原样转发）
 * - `sticky` 让页签条吸顶，`offset-top` 留出偏移
 * - `disabled` 阻止切换，点击只 emit `disabled`
 */
import { ref } from 'vue';
import SnTabs from '@snui/uni-src/components/sn-tabs/sn-tabs.vue';
import SnTab from '@snui/uni-src/components/sn-tabs/sn-tab.vue';

const normalActive = ref(0);
const underlineActive = ref(1);
const dotActive = ref(0);
const disabledActive = ref(0);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">line-theme="normal"（默认短条）</text>
    <SnTabs v-model="normalActive">
      <SnTab title="推荐" :name="0">推荐内容</SnTab>
      <SnTab title="关注" :name="1">关注内容</SnTab>
      <SnTab title="热榜" :name="2">热榜内容</SnTab>
    </SnTabs>

    <text class="sn-demo__label">line-theme="underline" + line-width=64 / line-height=6</text>
    <SnTabs
      v-model="underlineActive"
      line-theme="underline"
      :line-width="64"
      :line-height="6"
      animated
    >
      <SnTab title="日" :name="0">按日统计</SnTab>
      <SnTab title="周" :name="1">按周统计</SnTab>
      <SnTab title="月" :name="2">按月统计</SnTab>
    </SnTabs>

    <text class="sn-demo__label">line-theme="dot" + line-width="24rpx"（字符串原样转发）</text>
    <SnTabs v-model="dotActive" line-theme="dot" line-width="24rpx" line-height="24rpx">
      <SnTab title="日" :name="0">按日统计</SnTab>
      <SnTab title="周" :name="1">按周统计</SnTab>
      <SnTab title="月" :name="2">按月统计</SnTab>
    </SnTabs>

    <text class="sn-demo__label">sticky + offset-top=12，第三个页签 disabled</text>
    <SnTabs v-model="disabledActive" sticky :offset-top="12">
      <SnTab title="推荐" :name="0">推荐内容</SnTab>
      <SnTab title="关注" :name="1">关注内容</SnTab>
      <SnTab title="停用" :name="2" disabled>不可点击，点击只触发 disabled 事件</SnTab>
    </SnTabs>

    <text class="sn-demo__meta">
      当前页签：{{ normalActive }} / {{ underlineActive }} / {{ dotActive }} / {{ disabledActive }}
    </text>
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
