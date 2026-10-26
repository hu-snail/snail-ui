<script setup lang="ts">
/** Demo: sn-collapse — 查看更多模式（收起显示 2 行）。 */
import { ref } from 'vue';
import SnCollapse from '@snui/uni-src/components/sn-collapse/sn-collapse.vue';
import SnCollapseItem from '@snui/uni-src/components/sn-collapse/sn-collapse-item.vue';

const expanded = ref(false);
const longText =
  'AUI 是一套 AI 原生的多端 UI 框架。它以 Schema 为唯一事实来源，' +
  '通过 Protocol、Runtime、Renderer 三层分离，让同一份界面描述可以运行在' +
  'Web、小程序与原生 App 上。组件只负责渲染与交互，业务状态由宿主 AppBridge 提供。';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCollapse v-model="expanded" viewmore :line-num="2">
      <SnCollapseItem name="intro" title="组件介绍">{{ longText }}</SnCollapseItem>
    </SnCollapse>
    <text class="sn-demo__meta">expanded = {{ expanded }}</text>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
