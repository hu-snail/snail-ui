<script setup lang="ts">
/**
 * Demo: sn-tabs — switch animation (`animated` / `duration`) and the sticky offset.
 *
 * - `animated` transitions the active bar and turns on `scroll-with-animation`, so the selected item slides into view
 * - `duration` sets the transition length (ms); in swiper mode it is also the content slide duration
 * - `sticky` + `offset-top` pin the strip and leave an offset
 * - `line-width` / `line-height` size the bar inline (numbers are px, strings are forwarded verbatim)
 */
import { ref } from 'vue';
import SnTabs from '@snui/uni-src/components/sn-tabs/sn-tabs.vue';
import SnTab from '@snui/uni-src/components/sn-tabs/sn-tab.vue';

const animatedActive = ref(0);
const stickyActive = ref(0);
const lineActive = ref(0);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">animated + duration=600 (bar transition + scroll animation)</text>
    <SnTabs v-model="animatedActive" animated :duration="600">
      <SnTab title="For you" :name="0">For you content</SnTab>
      <SnTab title="Following" :name="1">Following content</SnTab>
      <SnTab title="Trending" :name="2">Trending content</SnTab>
    </SnTabs>

    <text class="sn-demo__label">sticky + offset-top=12</text>
    <SnTabs v-model="stickyActive" sticky :offset-top="12">
      <SnTab title="For you" :name="0">For you content</SnTab>
      <SnTab title="Following" :name="1">Following content</SnTab>
      <SnTab title="Trending" :name="2">Trending content</SnTab>
    </SnTabs>

    <text class="sn-demo__label">line-width=64 / line-height=8 with line-theme=underline</text>
    <SnTabs v-model="lineActive" line-theme="underline" :line-width="64" :line-height="8" animated>
      <SnTab title="Day" :name="0">Daily stats</SnTab>
      <SnTab title="Week" :name="1">Weekly stats</SnTab>
      <SnTab title="Month" :name="2">Monthly stats</SnTab>
    </SnTabs>

    <text class="sn-demo__meta"
      >Active tab: {{ animatedActive }} / {{ stickyActive }} / {{ lineActive }}</text
    >
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
