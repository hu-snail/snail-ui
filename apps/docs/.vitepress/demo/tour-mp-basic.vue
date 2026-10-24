<script setup lang="ts">
/** Demo: sn-tour — 分步引导。 */
import { ref } from 'vue'
import SnTour from '@snui/uni-src/components/sn-tour/sn-tour.vue'

const visible = ref(false)
const current = ref(0)
const steps = [
  { content: '这里是首页概览，展示你的核心数据。' },
  { content: '点击这里可以创建新的任务。' },
  { content: '在设置里可以调整主题与通知。' },
]
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__button" @tap="visible = true">开始引导</text>
    <text class="sn-demo__meta">当前步骤：{{ current + 1 }} / {{ steps.length }}</text>
    <SnTour v-model="visible" v-model:current="current" :steps="steps" />
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.sn-demo__button {
  align-self: flex-start;
  padding: 6px 12px;
  border: 1px solid var(--sn-mp-color-action-primary);
  border-radius: 8rpx;
  font-size: 24rpx;
  color: var(--sn-mp-color-action-primary);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
