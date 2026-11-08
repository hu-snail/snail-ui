<script setup lang="ts">
/**
 * Demo: sn-tabs — native swiper content area (`swipeable` / `duration` / `swiper-easing` / `swiper-height`).
 *
 * - `swipeable` swaps the content area for a native `<swiper>`: horizontal gestures page through the tabs, and each `sn-tab` renders as a `swiper-item`
 * - `duration` is also the swiper slide duration (ms)
 * - `swiper-easing` only accepts the named easings uni supports; `default` leaves it unset
 * - `swiper-height` fixes the content height (numbers are px, strings are forwarded verbatim); omit it to keep the platform default
 * - Swiping onto a disabled pane snaps back to the committed one and does not switch
 */
import { ref } from 'vue';
import SnTabs from '@snui/uni-src/components/sn-tabs/sn-tabs.vue';
import SnTab from '@snui/uni-src/components/sn-tabs/sn-tab.vue';

const swipeActive = ref(0);
const easingActive = ref(0);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">swipeable + duration=400 (drag the content area)</text>
    <SnTabs v-model="swipeActive" swipeable type="card" :duration="400" :swiper-height="240">
      <SnTab title="For you" :name="0">
        <view class="sn-demo__pane"
          ><text class="sn-demo__pane-text"
            >Drag the content area left or right to switch tabs.</text
          ></view
        >
      </SnTab>
      <SnTab title="Following" :name="1">
        <view class="sn-demo__pane"><text class="sn-demo__pane-text">Second pane.</text></view>
      </SnTab>
      <SnTab title="Trending" :name="2">
        <view class="sn-demo__pane"><text class="sn-demo__pane-text">Third pane.</text></view>
      </SnTab>
    </SnTabs>

    <text class="sn-demo__label">swiper-easing="easeInOutCubic" + tag form</text>
    <SnTabs
      v-model="easingActive"
      swipeable
      type="tag"
      active-theme="pill"
      swiper-easing="easeInOutCubic"
      :duration="500"
      :swiper-height="200"
    >
      <SnTab title="Day" :name="0">
        <view class="sn-demo__pane"><text class="sn-demo__pane-text">Daily stats</text></view>
      </SnTab>
      <SnTab title="Week" :name="1">
        <view class="sn-demo__pane"><text class="sn-demo__pane-text">Weekly stats</text></view>
      </SnTab>
      <SnTab title="Month" :name="2" disabled>
        <view class="sn-demo__pane"
          ><text class="sn-demo__pane-text"
            >Monthly stats (disabled: swiping here snaps back)</text
          ></view
        >
      </SnTab>
    </SnTabs>

    <text class="sn-demo__meta">Active tab: {{ swipeActive }} / {{ easingActive }}</text>
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
.sn-demo__pane {
  padding: var(--sn-mp-spacing-4);
}
.sn-demo__pane-text {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-md);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
