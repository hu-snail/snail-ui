<script setup lang="ts">
/**
 * Demo: sn-tabs — animation, swipe gesture, active-bar sizing and sticky offset.
 *
 * - `animated` transitions the active bar; `duration` sets the length in ms
 * - `swipeable` enables the gesture on the panel area: a horizontal drag past
 *   40px steps to the neighbouring tab
 * - `line-width` / `line-height` size the active bar inline (numbers are px,
 *   strings are forwarded verbatim)
 * - `sticky` + `offset-top` pin the strip and leave an offset
 * - `line-theme="dot"` / `"text"` only change the bar geometry; the colour still
 *   comes from tokens
 */
import { ref } from 'vue'
import SnTabs from '@snui/uni-src/components/sn-tabs/sn-tabs.vue'
import SnTab from '@snui/uni-src/components/sn-tabs/sn-tab.vue'

const swipeActive = ref(0)
const lineActive = ref(0)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">animated + duration=600 + swipeable (drag the panel)</text>
    <SnTabs v-model="swipeActive" animated :duration="600" swipeable sticky :offset-top="12">
      <SnTab title="For you" :name="0">Drag this panel left or right to switch tabs.</SnTab>
      <SnTab title="Following" :name="1">Second pane.</SnTab>
      <SnTab title="Trending" :name="2">Third pane.</SnTab>
    </SnTabs>

    <text class="sn-demo__label">line-width=64 / line-height=8 with line-theme=underline</text>
    <SnTabs
      v-model="lineActive"
      line-theme="underline"
      :line-width="64"
      :line-height="8"
      animated
    >
      <SnTab title="Day" :name="0">Daily stats</SnTab>
      <SnTab title="Week" :name="1">Weekly stats</SnTab>
      <SnTab title="Month" :name="2">Monthly stats</SnTab>
    </SnTabs>

    <text class="sn-demo__label">line-theme=dot with line-width="24rpx" (forwarded verbatim)</text>
    <SnTabs v-model="lineActive" line-theme="dot" line-width="24rpx" line-height="24rpx">
      <SnTab title="Day" :name="0">Daily stats</SnTab>
      <SnTab title="Week" :name="1">Weekly stats</SnTab>
      <SnTab title="Month" :name="2">Monthly stats</SnTab>
    </SnTabs>

    <text class="sn-demo__meta">Active tab: {{ swipeActive }} / {{ lineActive }}</text>
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
</style>
