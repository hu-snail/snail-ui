<script setup lang="ts">
/**
 * Demo: sn-dialog (uni-end) — status icon and its color.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-dialog from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnDialog from '@snui/uni-src/components/sn-dialog/sn-dialog.vue';

const successOpen = ref(false);
const warningOpen = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="success" block @tap="successOpen = true">成功图标</SnButton>
    <SnButton type="warning" block @tap="warningOpen = true">警告图标 + 自定义色</SnButton>

    <SnDialog
      v-model="successOpen"
      type="alert"
      icon="success"
      title="提交成功"
      msg="我们已收到你的申请，将在 1 个工作日内处理。"
      custom-class="sn-demo-contained"
    />

    <SnDialog
      v-model="warningOpen"
      type="alert"
      icon="warning"
      icon-color="var(--sn-mp-color-feedback-warning)"
      title="额度不足"
      msg="当前可用额度不足以完成本笔支付。"
      custom-class="sn-demo-contained"
    />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
/* Docs preview only — pin the fixed layer to the phone frame. The uni-demo-x
 * generated copy strips this rule in gen-x.mjs (vapor ignores style-level
 * conditional compilation, so the App side must not ship it). */
.sn-dialog.sn-demo-contained {
  position: absolute;
}
</style>
