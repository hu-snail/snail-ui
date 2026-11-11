<script setup lang="ts">
/**
 * Demo: sn-tabs — 吸顶（sticky）。
 *
 * `sticky` + `offset-top` 让页签条吸顶并留出偏移。
 */
import { ref } from 'vue';
import SnTabs from '@snui/uni-src/components/sn-tabs/sn-tabs.vue';
import SnTab from '@snui/uni-src/components/sn-tabs/sn-tab.vue';

const stickyActive = ref(0);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnTabs v-model="stickyActive" sticky :offset-top="12">
      <SnTab title="推荐" :name="0">推荐内容</SnTab>
      <SnTab title="关注" :name="1">关注内容</SnTab>
      <SnTab title="热榜" :name="2">热榜内容</SnTab>
    </SnTabs>

    <text class="sn-demo__meta">sticky + offset-top=12：页签条吸顶并留出偏移；当前页签：{{ stickyActive }}</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
  align-items: stretch;
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
