<script setup lang="ts">
/**
 * Demo: sn-tabs — English shadow of tabs-mp-line.
 */
import { ref } from 'vue';
import SnTabs from '@snui/uni-src/components/sn-tabs/sn-tabs.vue';
import SnTab from '@snui/uni-src/components/sn-tabs/sn-tab.vue';

const normalActive = ref(0);
const underlineActive = ref(1);
const dotActive = ref(0);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">line-theme="normal" (default short bar)</text>
    <SnTabs v-model="normalActive">
      <SnTab title="For you" :name="0">For you content</SnTab>
      <SnTab title="Following" :name="1">Following content</SnTab>
      <SnTab title="Trending" :name="2">Trending content</SnTab>
    </SnTabs>

    <text class="sn-demo__label">line-theme="underline" + line-width=64 / line-height=6</text>
    <SnTabs
      v-model="underlineActive"
      line-theme="underline"
      :line-width="64"
      :line-height="6"
      animated
    >
      <SnTab title="Day" :name="0">Daily stats</SnTab>
      <SnTab title="Week" :name="1">Weekly stats</SnTab>
      <SnTab title="Month" :name="2">Monthly stats</SnTab>
    </SnTabs>

    <text class="sn-demo__label"
      >line-theme="dot" + line-width="24rpx" (string forwarded verbatim)</text
    >
    <SnTabs v-model="dotActive" line-theme="dot" line-width="24rpx" line-height="24rpx">
      <SnTab title="Day" :name="0">Daily stats</SnTab>
      <SnTab title="Week" :name="1">Weekly stats</SnTab>
      <SnTab title="Month" :name="2">Monthly stats</SnTab>
    </SnTabs>

    <text class="sn-demo__meta">
      Active tab: {{ normalActive }} / {{ underlineActive }} / {{ dotActive }}
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
