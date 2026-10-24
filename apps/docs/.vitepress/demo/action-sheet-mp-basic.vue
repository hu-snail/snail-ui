<script setup lang="ts">
/**
 * Demo: sn-action-sheet (uni-end) — list rows with cancel button.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-action-sheet from its SFC source.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnActionSheet from '@snui/uni-src/components/sn-action-sheet/sn-action-sheet.vue'

const open = ref(false)
const picked = ref('—')

const actions = [
  { name: '分享给朋友', description: '发送到聊天或朋友圈' },
  { name: '保存到相册' },
  { name: '删除', disabled: true },
]
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @tap="open = true">打开动作面板</SnButton>
    <text class="sn-action-sheet-demo__meta">已选择：{{ picked }}</text>

    <SnActionSheet
      v-model="open"
      title="请选择操作"
      :actions="actions"
      cancel-text="取消"
      custom-class="sn-demo-contained"
      @select="picked = $event.item.name ?? ''"
    />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-action-sheet-demo__meta {
  font-size: 24rpx;
  color: var(--vp-c-text-2);
}
/* Docs-preview only — pin the fixed layer to the phone screen. */
.sn-action-sheet.sn-demo-contained {
  position: absolute;
}
</style>
