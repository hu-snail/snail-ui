<script setup lang="ts">
/**
 * Demo: sn-tabs — 导航形态（type）与选中态（active-theme）。
 *
 * - `type="line"` 下划线形态（默认），选中项靠底部条与文字加粗
 * - `type="card"` 卡片分段：整条嵌进浅色容器，选中项抬到面板底色
 * - `type="tag"` 独立胶囊：每个标签自带描边，选中项由 active-theme 强调
 * - `active-theme="text"` 仅文字强调（含底部条）
 * - `active-theme="fill"` 选中项浅色圆角底
 * - `active-theme="pill"` 选中项实心胶囊底（文字反色）
 */
import { ref } from 'vue';
import SnTabs from '@snui/uni-src/components/sn-tabs/sn-tabs.vue';
import SnTab from '@snui/uni-src/components/sn-tabs/sn-tab.vue';

const lineActive = ref(0);
const cardActive = ref(1);
const tagActive = ref(2);
const fillActive = ref(0);
const pillActive = ref(1);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">type="line"（默认）+ active-theme="text"</text>
    <SnTabs v-model="lineActive">
      <SnTab title="全部" :name="0">全部订单</SnTab>
      <SnTab title="待付款" :name="1">待付款订单</SnTab>
      <SnTab title="已完成" :name="2">已完成订单</SnTab>
    </SnTabs>

    <text class="sn-demo__label">type="card" 卡片分段</text>
    <SnTabs v-model="cardActive" type="card">
      <SnTab title="日" :name="0">按日统计</SnTab>
      <SnTab title="周" :name="1">按周统计</SnTab>
      <SnTab title="月" :name="2">按月统计</SnTab>
    </SnTabs>

    <text class="sn-demo__label">type="tag" + active-theme="pill"</text>
    <SnTabs v-model="tagActive" type="tag" active-theme="pill">
      <SnTab title="推荐" :name="0">推荐内容</SnTab>
      <SnTab title="关注" :name="1">关注内容</SnTab>
      <SnTab title="热榜" :name="2">热榜内容</SnTab>
    </SnTabs>

    <text class="sn-demo__label">type="line" + active-theme="fill"</text>
    <SnTabs v-model="fillActive" active-theme="fill">
      <SnTab title="全部" :name="0">全部消息</SnTab>
      <SnTab title="未读" :name="1">未读消息</SnTab>
      <SnTab title="已读" :name="2">已读消息</SnTab>
    </SnTabs>

    <text class="sn-demo__label">type="tag" + active-theme="fill"</text>
    <SnTabs v-model="pillActive" type="tag" active-theme="fill">
      <SnTab title="北京" :name="0">北京天气</SnTab>
      <SnTab title="上海" :name="1">上海天气</SnTab>
      <SnTab title="广州" :name="2">广州天气</SnTab>
    </SnTabs>

    <text class="sn-demo__meta">
      当前页签：{{ lineActive }} / {{ cardActive }} / {{ tagActive }} / {{ fillActive }} /
      {{ pillActive }}
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
