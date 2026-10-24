<script setup lang="ts">
/** Demo: sn-textarea — 自动增高 / 只读 / 禁用 / 紧凑。 */
import { ref } from 'vue'
import SnTextarea from '@snui/uni-src/components/sn-textarea/sn-textarea.vue'

const grow = ref('这是一段会随内容增高的文本。')
const readonlyValue = ref('只读内容，可以选中但不能编辑。')
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">autoHeight</text>
    <SnTextarea v-model="grow" auto-height />

    <text class="sn-demo__title">readonly</text>
    <SnTextarea v-model="readonlyValue" readonly />

    <text class="sn-demo__title">disabled</text>
    <SnTextarea v-model="readonlyValue" disabled />

    <text class="sn-demo__title">compact（用于表单行内）</text>
    <SnTextarea v-model="grow" compact placeholder="紧凑模式：无边框、无背景" />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
</style>
