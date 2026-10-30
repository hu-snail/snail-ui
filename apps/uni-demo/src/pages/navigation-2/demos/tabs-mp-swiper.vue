<script setup lang="ts">
/**
 * Demo: sn-tabs — 内容区原生 swiper（swipeable / duration / swiper-easing / swiper-height）。
 *
 * - `swipeable` 把内容区换成原生 `<swiper>`：手势横滑切页，每个 `sn-tab` 渲染为 `swiper-item`
 * - `duration` 同时是 swiper 的滑动时长（ms）
 * - `swiper-easing` 只接受 uni 支持的具名缓动；`default` 表示不下发
 * - `swiper-height` 给内容区定高（数字按 px，字符串原样转发）；不传沿用平台默认
 * - 滑到禁用页签会弹回已提交的页签，不触发切换
 */
import { ref } from 'vue';
import SnTabs from '@snui/uni-src/components/sn-tabs/sn-tabs.vue';
import SnTab from '@snui/uni-src/components/sn-tabs/sn-tab.vue';

const swipeActive = ref(0);
const easingActive = ref(0);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">swipeable + duration=400（在内容区左右滑动）</text>
    <SnTabs v-model="swipeActive" swipeable type="card" :duration="400" :swiper-height="240">
      <SnTab title="推荐" :name="0">
        <view class="sn-demo__pane"
          ><text class="sn-demo__pane-text">左右滑动内容区即可切换页签。</text></view
        >
      </SnTab>
      <SnTab title="关注" :name="1">
        <view class="sn-demo__pane"><text class="sn-demo__pane-text">第二页内容。</text></view>
      </SnTab>
      <SnTab title="热榜" :name="2">
        <view class="sn-demo__pane"><text class="sn-demo__pane-text">第三页内容。</text></view>
      </SnTab>
    </SnTabs>

    <text class="sn-demo__label">swiper-easing="easeInOutCubic" + tag 形态</text>
    <SnTabs
      v-model="easingActive"
      swipeable
      type="tag"
      active-theme="pill"
      swiper-easing="easeInOutCubic"
      :duration="500"
      :swiper-height="200"
    >
      <SnTab title="日" :name="0">
        <view class="sn-demo__pane"><text class="sn-demo__pane-text">按日统计</text></view>
      </SnTab>
      <SnTab title="周" :name="1">
        <view class="sn-demo__pane"><text class="sn-demo__pane-text">按周统计</text></view>
      </SnTab>
      <SnTab title="月" :name="2" disabled>
        <view class="sn-demo__pane"
          ><text class="sn-demo__pane-text">按月统计（禁用：滑到这里会弹回）</text></view
        >
      </SnTab>
    </SnTabs>

    <text class="sn-demo__meta">当前页签：{{ swipeActive }} / {{ easingActive }}</text>
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
