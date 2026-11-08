<script setup lang="ts">
/**
 * Demo: sn-tabs — nav form (`type`) and active emphasis (`active-theme`).
 *
 * - `type="line"` underline look (default): the active item leans on the bottom bar plus bolder text
 * - `type="card"` card segment: the strip sits in a subtle container and the active item lifts to the panel surface
 * - `type="tag"` standalone pills: every tab carries its own outline, the active one is emphasised by `active-theme`
 * - `active-theme="text"` text emphasis only (bottom bar included)
 * - `active-theme="fill"` soft rounded background on the active item
 * - `active-theme="pill"` solid pill background with inverted text
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
    <text class="sn-demo__label">type="line" (default) + active-theme="text"</text>
    <SnTabs v-model="lineActive">
      <SnTab title="All" :name="0">All orders</SnTab>
      <SnTab title="Unpaid" :name="1">Unpaid orders</SnTab>
      <SnTab title="Completed" :name="2">Completed orders</SnTab>
    </SnTabs>

    <text class="sn-demo__label">type="card" card segment</text>
    <SnTabs v-model="cardActive" type="card">
      <SnTab title="Day" :name="0">Daily stats</SnTab>
      <SnTab title="Week" :name="1">Weekly stats</SnTab>
      <SnTab title="Month" :name="2">Monthly stats</SnTab>
    </SnTabs>

    <text class="sn-demo__label">type="tag" + active-theme="pill"</text>
    <SnTabs v-model="tagActive" type="tag" active-theme="pill">
      <SnTab title="For you" :name="0">For you content</SnTab>
      <SnTab title="Following" :name="1">Following content</SnTab>
      <SnTab title="Trending" :name="2">Trending content</SnTab>
    </SnTabs>

    <text class="sn-demo__label">type="line" + active-theme="fill"</text>
    <SnTabs v-model="fillActive" active-theme="fill">
      <SnTab title="All" :name="0">All messages</SnTab>
      <SnTab title="Unread" :name="1">Unread messages</SnTab>
      <SnTab title="Read" :name="2">Read messages</SnTab>
    </SnTabs>

    <text class="sn-demo__label">type="tag" + active-theme="fill"</text>
    <SnTabs v-model="pillActive" type="tag" active-theme="fill">
      <SnTab title="Beijing" :name="0">Beijing weather</SnTab>
      <SnTab title="Shanghai" :name="1">Shanghai weather</SnTab>
      <SnTab title="Guangzhou" :name="2">Guangzhou weather</SnTab>
    </SnTabs>

    <text class="sn-demo__meta">
      Active tab: {{ lineActive }} / {{ cardActive }} / {{ tagActive }} / {{ fillActive }} /
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
