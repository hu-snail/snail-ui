<script setup lang="ts">
/**
 * Demo: sn-tabs — English shadow of tabs-mp-sticky.
 */
import { ref } from 'vue';
import SnTabs from '@snui/uni-src/components/sn-tabs/sn-tabs.vue';
import SnTab from '@snui/uni-src/components/sn-tabs/sn-tab.vue';

const stickyActive = ref(0);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnTabs v-model="stickyActive" sticky :offset-top="12">
      <SnTab title="For you" :name="0">For you content</SnTab>
      <SnTab title="Following" :name="1">Following content</SnTab>
      <SnTab title="Trending" :name="2">Trending content</SnTab>
    </SnTabs>

    <text class="sn-demo__meta">
      sticky + offset-top=12 pins the strip with an offset; active tab: {{ stickyActive }}
    </text>
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
