<script setup lang="ts">
/** Demo: sn-tour — 自定义文案、遮罩点击进入下一步。 */
import { ref } from 'vue'
import SnTour from '@snui/uni-src/components/sn-tour/sn-tour.vue'

const visible = ref(false)
const current = ref(0)
const steps = [
  { content: '点击遮罩也可以进入下一步。' },
  { content: '最后一步的按钮会变成「完成」。' },
]
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__button" @tap="visible = true">打开（可点遮罩前进）</text>
    <SnTour
      v-model="visible"
      v-model:current="current"
      :steps="steps"
      click-mask-next
      prev-text="上一步"
      next-text="继续"
      skip-text="不再提示"
      finish-text="完成"
      :border-radius="12"
    />
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
</style>
