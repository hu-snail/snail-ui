<script setup lang="ts">
/**
 * Demo: sn-rate — space / icon / activeIcon / iconPrefix / block。
 *
 * `icon` / `active-icon` 是注册表名字（这里先注册 Heart），`icon-prefix` 只是
 * 对齐用的信息字段，`space` 控制图标间距（数字按 rpx 设计值 ×2），`block` 把
 * 图标撑满整行宽度。
 */
import { ref } from 'vue'
import SnRate from '@snui/uni-src/components/sn-rate/sn-rate.vue'
import { registerSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry'
import { Heart } from '@snui/uni-src/components/sn-icon/sn-icon-set'

registerSnIcons({ Heart })

const wide = ref<number | null>(2)
const hearts = ref<number | null>(3)
const block = ref<number | null>(4)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnRate v-model="wide" :space="16" :size="40" />
    <text class="sn-demo__meta">space=16（rpx ×2 间距）+ size=40</text>

    <SnRate
      v-model="hearts"
      icon="Heart"
      active-icon="Heart"
      icon-prefix="demo-icon"
      color="var(--sn-mp-color-text-tertiary)"
      active-color="var(--sn-mp-color-feedback-danger)"
    />
    <text class="sn-demo__meta">icon / activeIcon 走注册表（Heart），iconPrefix 仅为对齐保留</text>

    <SnRate v-model="block" block />
    <text class="sn-demo__meta">block：图标均分整行宽度</text>
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
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
