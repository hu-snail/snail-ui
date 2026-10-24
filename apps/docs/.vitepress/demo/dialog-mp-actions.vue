<script setup lang="ts">
/**
 * Demo: sn-dialog (uni-end) — custom action rows and beforeConfirm guard.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-dialog from its SFC source.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnDialog from '@snui/uni-src/components/sn-dialog/sn-dialog.vue'

const actionsOpen = ref(false)
const guardOpen = ref(false)
const lastAction = ref('—')

const actions = [
  { name: '复制链接' },
  { name: '保存到本地' },
  { name: '删除（禁用）', disabled: true },
]

function blockConfirm(): boolean {
  return false
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @tap="actionsOpen = true">自定义操作行</SnButton>
    <SnButton block @tap="guardOpen = true">beforeConfirm 拦截</SnButton>
    <text class="sn-dialog-demo__meta">上次操作：{{ lastAction }}</text>

    <SnDialog
      v-model="actionsOpen"
      title="更多操作"
      msg="自定义 actions 会替换默认的确认 / 取消按钮。"
      :actions="actions"
      custom-class="sn-demo-contained"
      @select="lastAction = `actions 选择：${$event.item.name}`"
    />

    <SnDialog
      v-model="guardOpen"
      type="confirm"
      title="需要二次校验"
      msg="beforeConfirm 返回 false 时弹框不会关闭。"
      :before-confirm="blockConfirm"
      custom-class="sn-demo-contained"
      @confirm="lastAction = 'guard 通过'"
    />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-dialog-demo__meta {
  font-size: 24rpx;
  color: var(--vp-c-text-2);
}
/* Docs-preview only — see dialog-mp-basic for the rationale. */
.sn-dialog.sn-demo-contained {
  position: absolute;
}
</style>
