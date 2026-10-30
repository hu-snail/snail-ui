<script setup lang="ts">
/** Demo: sn-tabs — 基础页签 + v-model（索引与名称两种绑定方式）。 */
import { ref } from 'vue';
import SnTabs from '@snui/uni-src/components/sn-tabs/sn-tabs.vue';
import SnTab from '@snui/uni-src/components/sn-tabs/sn-tab.vue';

/** 索引绑定：`name` 省略时按注册顺序取下标。 */
const indexActive = ref(0);

/** 名称绑定：`name` 是字符串时 `v-model` 取名称。 */
const nameActive = ref('unpaid');
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">v-model 绑定索引</text>
    <SnTabs v-model="indexActive">
      <SnTab title="全部" :name="0">全部内容</SnTab>
      <SnTab title="待付款" :name="1">待付款内容</SnTab>
      <SnTab title="已完成" :name="2">已完成内容</SnTab>
    </SnTabs>

    <text class="sn-demo__label">v-model 绑定名称</text>
    <SnTabs v-model="nameActive">
      <SnTab title="全部" name="all">全部内容</SnTab>
      <SnTab title="待付款" name="unpaid">待付款内容</SnTab>
      <SnTab title="已完成" name="done">已完成内容</SnTab>
    </SnTabs>

    <text class="sn-demo__meta">当前页签：{{ indexActive }} / {{ nameActive }}</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-4);
  align-items: stretch;
  width: 100%;
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
