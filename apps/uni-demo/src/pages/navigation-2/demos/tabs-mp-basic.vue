<script setup lang="ts">
/** Demo: sn-tabs — 基础页签 + v-model。 */
import { ref } from 'vue';
import SnTabs from '@snui/uni-src/components/sn-tabs/sn-tabs.vue';
import SnTab from '@snui/uni-src/components/sn-tabs/sn-tab.vue';

const active = ref(0);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnTabs v-model="active">
      <SnTab title="全部" :name="0">全部内容</SnTab>
      <SnTab title="待付款" :name="1">待付款内容</SnTab>
      <SnTab title="已完成" :name="2">已完成内容</SnTab>
    </SnTabs>
    <text class="sn-demo__meta">当前页签：{{ active }}</text>
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
