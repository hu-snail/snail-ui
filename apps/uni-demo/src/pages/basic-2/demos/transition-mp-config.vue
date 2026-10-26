<script setup lang="ts">
/**
 * Demo: sn-transition (uni-end) — combined names, per-leg durations, destroy.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-transition from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnTransition from '@snui/uni-src/components/sn-transition/sn-transition.vue';

const combined = ref(true);
const perLeg = ref(true);
const keepAlive = ref(true);
const events = ref<string[]>([]);

function log(label: string): void {
  events.value = [...events.value.slice(-4), label];
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton size="small" @tap="combined = !combined">
      组合动画 fade + up（{{ combined ? '显示' : '隐藏' }}）
    </SnButton>
    <SnTransition :show="combined" :name="['fade', 'up']">
      <view class="sn-transition-demo__box">
        <text class="sn-transition-demo__text">name = ['fade', 'up']</text>
      </view>
    </SnTransition>

    <SnButton size="small" @tap="perLeg = !perLeg">进入 100ms / 离开 600ms</SnButton>
    <SnTransition
      :show="perLeg"
      name="fade"
      :duration="{ enter: 100, leave: 600 }"
      @before-enter="log('before-enter')"
      @after-enter="log('after-enter')"
      @before-leave="log('before-leave')"
      @after-leave="log('after-leave')"
    >
      <view class="sn-transition-demo__box">
        <text class="sn-transition-demo__text">per-leg duration</text>
      </view>
    </SnTransition>

    <SnButton size="small" @tap="keepAlive = !keepAlive"> destroy = false（保留节点） </SnButton>
    <SnTransition :show="keepAlive" name="zoom-in" :destroy="false">
      <view class="sn-transition-demo__box">
        <text class="sn-transition-demo__text">destroy = false</text>
      </view>
    </SnTransition>

    <text class="sn-transition-demo__meta">事件：{{ events.join(' → ') || '—' }}</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-transition-demo__box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120rpx;
  border-radius: 16rpx;
  background-color: var(--sn-mp-color-background-soft);
}
.sn-transition-demo__text {
  font-size: 26rpx;
  color: var(--sn-mp-color-text-primary);
}
.sn-transition-demo__meta {
  font-size: 22rpx;
  color: var(--vp-c-text-2);
}
</style>
