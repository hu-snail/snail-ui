<script setup lang="ts">
/**
 * Demo: sn-backtop — real scrolling inside a scroll-view.
 *
 * The scroll distance comes from the scroll-view's @scroll event (real
 * scrolling); tapping the button scrolls it back through the scroll-top
 * binding. custom-class pins the fixed button inside the stage.
 */
import { nextTick, ref } from 'vue';
import SnBacktop from '@snui/uni-src/components/sn-backtop/sn-backtop.vue';

/** Live scroll distance of the scroll-view (px, reported by @scroll). */
const scrollTop = ref(0);
/** Written back into the scroll-view's scroll-top (programmatic scroll). */
const viewTop = ref(0);

function onScroll(event: { detail: { scrollTop: number } }): void {
  scrollTop.value = event.detail.scrollTop;
}

/** A scroll-view ignores an unchanged scroll-top: sync first, then reset. */
async function backToTop(): Promise<void> {
  viewTop.value = Math.round(scrollTop.value);
  await nextTick();
  viewTop.value = 0;
}

function toBottom(): void {
  viewTop.value = 2000;
}
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__stage">
      <scroll-view
        class="sn-demo__viewport"
        scroll-y
        :scroll-top="viewTop"
        @scroll="onScroll"
      >
        <view v-for="index in 24" :key="index" class="sn-demo__row">
          <text>Content block {{ index }}</text>
        </view>
      </scroll-view>
      <SnBacktop
        :scroll-top="scrollTop"
        :top="60"
        text="Top"
        :bottom="16"
        :right="16"
        custom-class="sn-demo-pinned"
        @click="backToTop"
      />
    </view>
    <text class="sn-demo__meta">
      Live scroll: {{ Math.round(scrollTop) }} px (threshold 60; pages default to 300)
    </text>
    <view class="sn-demo__actions">
      <text class="sn-demo__button" @tap="toBottom">Scroll to bottom</text>
    </view>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
  width: 100%;
}
.sn-demo__stage {
  position: relative;
  width: 100%;
}
.sn-demo__viewport {
  height: 400rpx;
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-subtle);
}
.sn-demo__row {
  padding: var(--sn-mp-spacing-3) var(--sn-mp-spacing-4);
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle);
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__meta {
  font-size: var(--sn-mp-font-size-xs);
  color: var(--sn-mp-color-text-tertiary);
}
.sn-demo__actions {
  display: flex;
  gap: var(--sn-mp-spacing-2);
}
.sn-demo__button {
  padding: var(--sn-mp-spacing-1) var(--sn-mp-spacing-3);
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-sm);
  font-size: var(--sn-mp-font-size-xs);
  color: var(--sn-mp-color-text-primary);
}
/* Docs-preview only — pin the fixed button inside the stage. */
.sn-demo__stage :deep(.sn-backtop.sn-demo-pinned) {
  position: absolute;
}
</style>
