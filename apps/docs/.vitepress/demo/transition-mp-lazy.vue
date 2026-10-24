<script setup lang="ts">
/**
 * Demo: sn-transition (uni-end) — `lazy-render` + `disable-touch-move`。
 *
 * `lazy-render` 默认 false：组件挂载时就渲染默认插槽，只是 `destroy` 为 true 时
 * 用 `display: none` 隐藏。置 true 后，插槽内容要等到第一次 `show=true` 才真正
 * 渲染（首屏省一次子树构建），之后即使收起也保持已渲染。
 *
 * `disable-touch-move` 打开后在根节点拦截 touchmove 的默认行为，防止面板后面的
 * 页面跟着滚动 —— 移动端弹层常用。文档站用一段可滚动区域演示：开启拦截时下方
 * 滚动区不会跟着拖动。
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnTransition from '@snui/uni-src/components/sn-transition/sn-transition.vue'

/** lazy-render=true 的实例：首屏不渲染插槽。 */
const lazyShown = ref(false)
const lazyEntered = ref(false)

/** lazy-render=false 的对照实例。 */
const eagerShown = ref(false)

/** disable-touch-move 的实例。 */
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
      lazy-render=true：插槽第一次 show 之前不渲染，之后一直保留（下方状态从「未渲染」变
      「已渲染」）
    </text>
    <view class="sn-demo__row">
      <SnButton size="small" @tap="toggleLazy">
        {{ lazyShown ? '收起' : '展开' }}
      </SnButton>
      <text class="sn-demo__state">
        插槽状态：{{ lazyEntered ? '已渲染' : '未渲染' }}
      </text>
    </view>
    <SnTransition :show="lazyShown" name="fade" lazy-render @after-enter="markEntered">
      <view class="sn-demo-box">
        <text class="sn-demo-box__text">lazy-render=true</text>
      </view>
    </SnTransition>

    <text class="sn-demo__meta">
      lazy-render=false（默认）：挂载即渲染插槽，收起时靠 destroy 的 display: none 隐藏
    </text>
    <view class="sn-demo__row">
      <SnButton size="small" @tap="toggleEager">
        {{ eagerShown ? '收起' : '展开' }}
      </SnButton>
    </view>
    <SnTransition :show="eagerShown" name="fade">
      <view class="sn-demo-box">
        <text class="sn-demo-box__text">lazy-render=false</text>
      </view>
    </SnTransition>

    <text class="sn-demo__meta">
      disable-touch-move：展开时根节点拦截 touchmove，面板后的滚动区不再跟着滚
    </text>
    <view class="sn-demo__row">
      <SnButton size="small" @tap="toggleGuarded">
        {{ guardedShown ? '收起' : '展开' }}
      </SnButton>
    </view>
    <SnTransition :show="guardedShown" name="slide-up" disable-touch-move>
      <view class="sn-demo-box sn-demo-box--tall">
        <text class="sn-demo-box__text">disable-touch-move=true</text>
        <text class="sn-demo-box__hint">在这个面板上拖动，下方的滚动区不会动</text>
      </view>
    </SnTransition>

    <scroll-view class="sn-demo__scroller" scroll-y>
      <view v-for="index in 12" :key="index" class="sn-demo__scroll-row">
        <text class="sn-demo__scroll-text">背景滚动区 {{ index }}</text>
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
