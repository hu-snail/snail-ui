<script setup lang="ts">
/**
 * Demo: sn-transition (uni-end) — built-in animation names.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-transition from its SFC source.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnTransition from '@snui/uni-src/components/sn-transition/sn-transition.vue'

const show = ref(true)
const names = ['fade', 'fade-up', 'zoom-in', 'slide-up'] as const
const name = ref<(typeof names)[number]>('fade')
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-transition-demo__row">
      <SnButton
        v-for="n in names"
        :key="n"
        size="small"
        @tap="name = n; show = true"
      >{{ n }}</SnButton>
    </view>

    <SnButton size="small" @tap="show = !show">{{ show ? '收起' : '展开' }}</SnButton>

    <SnTransition :show="show" :name="name" :duration="300">
      <view class="sn-transition-demo__box">
        <text class="sn-transition-demo__text">name = {{ name }}</text>
      </view>
    </SnTransition>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-transition-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}
.sn-transition-demo__box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 160rpx;
  border-radius: 16rpx;
  background-color: var(--sn-mp-color-background-soft);
}
.sn-transition-demo__text {
  font-size: 28rpx;
  color: var(--sn-mp-color-text-primary);
}
</style>
