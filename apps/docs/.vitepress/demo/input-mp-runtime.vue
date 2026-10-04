<script setup lang="ts">
/** Demo: sn-input — MP-only runtime attrs (confirm-type / hold-keyboard / adjust-position / cursor / selection-* / placeholder-style). */
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue'
import { ref } from 'vue'

const search = ref('')
const text = ref('预选区域示例')
const styled = ref('')
</script>

<template>
  <view class="sn-input-demo">
    <text class="sn-input-demo__title">confirmType (软键盘右下按钮文案)</text>
    <SnInput v-model="search" confirm-type="search" placeholder="搜索 (search 按钮)" />
    <SnInput v-model="search" confirm-type="send" placeholder="发送 (send 按钮)" />
    <SnInput v-model="search" confirm-type="go" placeholder="前往 (go 按钮)" />

    <text class="sn-input-demo__title">holdKeyboard / adjustPosition / alwaysEmbed</text>
    <SnInput v-model="search" hold-keyboard adjust-position placeholder="失焦保留键盘 + 自动滚动" />

    <text class="sn-input-demo__title">cursor + selection-start / selection-end</text>
    <SnInput v-model="text" :cursor="5" selection-start="2" selection-end="8" />

    <text class="sn-input-demo__title">placeholderStyle (内联样式注入占位符)</text>
    <SnInput
      v-model="styled"
      placeholder-style="color: #ef4444; font-style: italic;"
      placeholder="红色斜体占位符"
    />
  </view>
</template>

<style scoped>
.sn-input-demo { display: flex; flex-direction: column; gap: 16rpx; max-width: 600rpx; }
.sn-input-demo__title { margin-top: 16rpx; font-size: 26rpx; font-weight: 600; color: var(--vp-c-text-1); }
</style>