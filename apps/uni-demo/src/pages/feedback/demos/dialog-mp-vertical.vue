<script setup lang="ts">
/**
 * Demo: sn-dialog (uni-end) — actionLayout="vertical" stacks the buttons with
 * the confirm action on top.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-dialog from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnDialog from '@snui/uni-src/components/sn-dialog/sn-dialog.vue';

const open = ref(false);
const picked = ref('—');
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @tap="open = true">垂直按钮对话框</SnButton>
    <text class="sn-dialog-demo__meta">结果：{{ picked }}</text>

    <SnDialog
      v-model="open"
      type="confirm"
      title="对话框标题"
      msg="告知当前状态、信息和解决方法"
      action-layout="vertical"
      custom-class="sn-demo-contained"
      @confirm="picked = '确认'"
      @cancel="picked = '取消'"
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
/* Docs-preview only — pin the fixed layer to the phone screen. */
.sn-dialog.sn-demo-contained {
  position: absolute;
}
</style>
