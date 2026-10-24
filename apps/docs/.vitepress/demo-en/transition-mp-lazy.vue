<script setup lang="ts">
/**
 * Demo: sn-transition (uni-end) — `lazy-render` + `disable-touch-move`.
 *
 * `lazy-render` defaults to false: the default slot renders at mount and is only
 * hidden with `display: none` (because `destroy` is true). With true, the slot
 * content renders the first time `show` turns true — one subtree build saved on
 * first paint — and stays rendered afterwards.
 *
 * `disable-touch-move` makes the root node swallow touchmove's default action so
 * the page behind a panel cannot scroll along — the usual mobile sheet
 * requirement. The demo pairs it with a scroll area below: while the guard is on,
 * dragging over the panel does not scroll that area.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnTransition from '@snui/uni-src/components/sn-transition/sn-transition.vue'

/** lazy-render=true instance: nothing renders on first paint. */
const lazyShown = ref(false)
const lazyEntered = ref(false)

/** lazy-render=false control instance. */
const eagerShown = ref(false)

/** disable-touch-move instance. */
const guardedShown = ref(false)

function toggleLazy(): void {
  lazyShown.value = !lazyShown.value
}

function toggleEager(): void {
  eagerShown.value = !eagerShown.value
}

function toggleGuarded(): void {
  guardedShown.value = !guardedShown.value
}

function markEntered(): void {
  lazyEntered.value = true
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta">
      lazy-render=true: the slot does not render before the first show, and stays rendered
      afterwards (the state below flips from "not rendered" to "rendered")
    </text>
    <view class="sn-demo__row">
      <SnButton size="small" @tap="toggleLazy">
        {{ lazyShown ? 'Collapse' : 'Expand' }}
      </SnButton>
      <text class="sn-demo__state">
        Slot state: {{ lazyEntered ? 'rendered' : 'not rendered' }}
      </text>
    </view>
    <SnTransition :show="lazyShown" name="fade" lazy-render @after-enter="markEntered">
      <view class="sn-demo-box">
        <text class="sn-demo-box__text">lazy-render=true</text>
      </view>
    </SnTransition>

    <text class="sn-demo__meta">
      lazy-render=false (default): the slot renders at mount and hides via destroy's display: none
    </text>
    <view class="sn-demo__row">
      <SnButton size="small" @tap="toggleEager">
        {{ eagerShown ? 'Collapse' : 'Expand' }}
      </SnButton>
    </view>
    <SnTransition :show="eagerShown" name="fade">
      <view class="sn-demo-box">
        <text class="sn-demo-box__text">lazy-render=false</text>
      </view>
    </SnTransition>

    <text class="sn-demo__meta">
      disable-touch-move: while expanded the root swallows touchmove, so the scroll area behind
      stops following the finger
    </text>
    <view class="sn-demo__row">
      <SnButton size="small" @tap="toggleGuarded">
        {{ guardedShown ? 'Collapse' : 'Expand' }}
      </SnButton>
    </view>
    <SnTransition :show="guardedShown" name="slide-up" disable-touch-move>
      <view class="sn-demo-box sn-demo-box--tall">
        <text class="sn-demo-box__text">disable-touch-move=true</text>
        <text class="sn-demo-box__hint">Drag on this panel and the scroll area below stays put</text>
      </view>
    </SnTransition>

    <scroll-view class="sn-demo__scroller" scroll-y>
      <view v-for="index in 12" :key="index" class="sn-demo__scroll-row">
        <text class="sn-demo__scroll-text">Background scroll area {{ index }}</text>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: stretch;
  width: 100%;
}
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  align-items: center;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
.sn-demo__state {
  color: var(--sn-mp-color-action-primary);
  font-size: var(--sn-mp-font-size-xs);
}
.sn-demo-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  height: 120rpx;
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-soft);
}
.sn-demo-box--tall {
  height: 200rpx;
}
.sn-demo-box__text {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-primary);
}
.sn-demo-box__hint {
  font-size: var(--sn-mp-font-size-xs);
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__scroller {
  height: 240rpx;
  border: 2rpx dashed var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-md);
}
.sn-demo__scroll-row {
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-3);
}
.sn-demo__scroll-text {
  font-size: var(--sn-mp-font-size-xs);
  color: var(--sn-mp-color-text-secondary);
}
</style>
