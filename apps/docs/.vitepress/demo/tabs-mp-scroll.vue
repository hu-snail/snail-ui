<script setup lang="ts">
/**
 * Demo: sn-tabs — 滚动导航（slidableNum / slidable / showScrollbar）与颜色覆盖。
 *
 * - `slidable-num` 是自动开启滚动的页签数量阈值：页签数超过它时页签条横向滚动，
 *   未超过时页签均分整宽
 * - `slidable="always"` 强制开启滚动，不看阈值
 * - `show-scrollbar` 把 `scroll-view` 的滚动条显示出来
 * - `map-num` / `map-title` 是 wot-ui 导航地图浮层的契约位（uni 端未实现，见文档）
 * - `color` / `inactive-color` 内联覆盖激活 / 非激活文案颜色
 * - `custom-class` / `custom-style` 落在根节点
 */
import { ref } from 'vue'
import SnTabs from '@snui/uni-src/components/sn-tabs/sn-tabs.vue'
import SnTab from '@snui/uni-src/components/sn-tabs/sn-tab.vue'

const many = ['推荐', '关注', '热榜', '视频', '直播', '同城', '问答', '专栏']
const activeScroll = ref(0)
const activeFixed = ref(0)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">slidable-num=4，8 个页签超过阈值 → 横向滚动</text>
    <SnTabs
      v-model="activeScroll"
      :slidable-num="4"
      show-scrollbar
      color="var(--sn-mp-color-action-primary)"
      inactive-color="var(--sn-mp-color-text-tertiary)"
      custom-class="sn-demo__tabs"
    >
      <SnTab v-for="(title, index) in many" :key="title" :title="title" :name="index">
        {{ title }} 的内容
      </SnTab>
    </SnTabs>

    <text class="sn-demo__label">slidable="always"，3 个页签也强制滚动</text>
    <SnTabs
      v-model="activeFixed"
      slidable="always"
      :map-num="10"
      map-title="全部频道"
      custom-style="background-color: var(--sn-mp-color-background-subtle);"
    >
      <SnTab title="全部" :name="0">全部内容</SnTab>
      <SnTab title="待付款" :name="1">待付款内容</SnTab>
      <SnTab title="已完成" :name="2">已完成内容</SnTab>
    </SnTabs>

    <text class="sn-demo__meta">当前页签：{{ activeScroll }} / {{ activeFixed }}</text>
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
/* custom-class 落在 sn-tabs 根节点上，需要 :deep 穿透。 */
.sn-demo :deep(.sn-demo__tabs) {
  border-radius: var(--sn-mp-radius-sm);
}
</style>
