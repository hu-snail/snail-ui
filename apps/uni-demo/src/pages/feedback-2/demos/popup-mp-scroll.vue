<script setup lang="ts">
/**
 * Demo: sn-popup (uni-end) — lock-scroll / z-index / hide-when-close.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-popup from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnPopup from '@snui/uni-src/components/sn-popup/sn-popup.vue';

const scrollThrough = ref(false);
const keepNode = ref(false);
const leaving = ref(false);

const events = ref<string[]>([]);

function record(name: string): void {
  events.value = [...events.value.slice(-3), name];
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @tap="scrollThrough = true">
      lock-scroll=false（背景仍可滚动）
    </SnButton>
    <SnButton block @tap="keepNode = true"> hide-when-close=false（关闭后保留节点） </SnButton>
    <SnButton block @tap="leaving = true">z-index=200（高层级面板）</SnButton>

    <text v-if="events.length > 0" class="sn-demo__meta"> 动画事件：{{ events.join(' → ') }} </text>

    <SnPopup
      v-model="scrollThrough"
      position="bottom"
      round
      :lock-scroll="false"
      custom-class="sn-demo-contained"
    >
      <view class="sn-demo__body">
        <text class="sn-demo__title">lockScroll = false</text>
        <text class="sn-demo__text">遮罩不再拦截 touchmove，面板背后的页面可以继续滚动。</text>
        <SnButton type="primary" block @tap="scrollThrough = false">关闭</SnButton>
      </view>
    </SnPopup>

    <SnPopup
      v-model="keepNode"
      position="center"
      round
      :hide-when-close="false"
      custom-class="sn-demo-contained"
      @after-leave="record('after-leave')"
    >
      <view class="sn-demo__body">
        <text class="sn-demo__title">hideWhenClose = false</text>
        <text class="sn-demo__text"
          >关闭后节点仍在树上，只加 sn-popup--hidden（visibility: hidden）。</text
        >
        <SnButton type="primary" block @tap="keepNode = false">关闭</SnButton>
      </view>
    </SnPopup>

    <SnPopup
      v-model="leaving"
      position="right"
      round
      :z-index="200"
      custom-class="sn-demo-contained"
      @before-leave="record('before-leave')"
      @after-leave="record('after-leave')"
    >
      <view class="sn-demo__body">
        <text class="sn-demo__title">zIndex = 200</text>
        <text class="sn-demo__text">层级由 zIndex 决定，可与页面里其它浮层叠放。</text>
        <SnButton type="primary" block @tap="leaving = false">关闭</SnButton>
      </view>
    </SnPopup>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__body {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__title {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-lg);
  font-weight: var(--sn-mp-font-weight-semibold);
}
.sn-demo__text,
.sn-demo__meta {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* H5 / WEB only — docs preview pins the fixed layer to the phone frame.
 * uni-app x App compiles this OUT: App-side `position: absolute` lays out in
 * the direct parent's content box (css/position) and the page class still
 * reaches the component root (style-isolation) — the rule would pin the
 * fullscreen fixed layer into the demo card and clip it (App overflow
 * defaults to hidden). */
/* #ifdef H5 || WEB */
.sn-popup.sn-demo-contained {
  position: absolute;
}
/* #endif */
</style>
