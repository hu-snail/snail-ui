<script setup lang="ts">
/** Demo: sn-textarea — 字数统计 / 清空 / 错误态。 */
import { ref } from 'vue'
import SnTextarea from '@snui/uni-src/components/sn-textarea/sn-textarea.vue'

const limited = ref('snail-aui 的 uni 端文本域')
const clearable = ref('点右侧 × 清空这段文字')
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">showWordLimit + maxlength</text>
    <SnTextarea v-model="limited" :maxlength="60" show-word-limit />

    <text class="sn-demo__title">clearable</text>
    <SnTextarea v-model="clearable" clearable />

    <text class="sn-demo__title">error</text>
    <SnTextarea v-model="clearable" error placeholder="内容不合规时由表单驱动 error" />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
</style>
