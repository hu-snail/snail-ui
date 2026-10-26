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
      lock-scroll=false (page behind still scrolls)
    </SnButton>
    <SnButton block @tap="keepNode = true">
      hide-when-close=false (node kept after close)
    </SnButton>
    <SnButton block @tap="leaving = true">z-index=200 (high layer)</SnButton>

    <text v-if="events.length > 0" class="sn-demo__meta">
      Animation events: {{ events.join(' → ') }}
    </text>

    <SnPopup
      v-model="scrollThrough"
      position="bottom"
      round
      :lock-scroll="false"
      custom-class="sn-demo-contained"
    >
      <view class="sn-demo__body">
        <text class="sn-demo__title">lockScroll = false</text>
        <text class="sn-demo__text">
          The scrim no longer intercepts touchmove, so the page behind the panel keeps scrolling.
        </text>
        <SnButton type="primary" block @tap="scrollThrough = false">Close</SnButton>
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
        <text class="sn-demo__text">
          The node stays in the tree after closing and only gains sn-popup--hidden (visibility:
          hidden).
        </text>
        <SnButton type="primary" block @tap="keepNode = false">Close</SnButton>
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
        <text class="sn-demo__text">
          The stacking level comes from zIndex, so it can sit above other layers on the page.
        </text>
        <SnButton type="primary" block @tap="leaving = false">Close</SnButton>
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
/* Docs-preview only: keep the fixed-position popup inside the phone screen. */
.sn-popup.sn-demo-contained {
  position: absolute;
}
</style>
