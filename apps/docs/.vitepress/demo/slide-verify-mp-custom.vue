<script setup lang="ts">
/** Demo: sn-slide-verify — text / successText 覆盖内置文案；backgroundColor / activeBackgroundColor 覆盖轨道色；disabled 拦掉拖动。 */
import { ref } from 'vue'
import SnSlideVerify from '@snui/uni-src/components/sn-slide-verify/sn-slide-verify.vue'

// 无额外状态。
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSlideVerify
      text="按住滑块，拖到最右侧"
      success-text="验证完成"
      background-color="var(--sn-mp-color-background-soft)"
      active-background-color="var(--sn-mp-color-feedback-success-soft)"
    />
    <SnSlideVerify disabled />
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
