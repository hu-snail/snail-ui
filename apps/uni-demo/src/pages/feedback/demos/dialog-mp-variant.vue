<script setup lang="ts">
/**
 * Demo: sn-dialog (uni-end) — status icon, theme="text" and vertical actions.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-dialog from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnDialog from '@snui/uni-src/components/sn-dialog/sn-dialog.vue';

const successOpen = ref(false);
const warningOpen = ref(false);
const textThemeOpen = ref(false);
const verticalOpen = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="success" block @tap="successOpen = true">成功图标</SnButton>
    <SnButton type="warning" block @tap="warningOpen = true">警告图标 + 自定义色</SnButton>
    <SnButton block @tap="textThemeOpen = true">文本按钮（theme=&quot;text&quot;）</SnButton>
    <SnButton block @tap="verticalOpen = true"
      >竖排按钮（action-layout=&quot;vertical&quot;）</SnButton
    >

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

    <SnDialog
      v-model="textThemeOpen"
      type="confirm"
      theme="text"
      title="退出登录"
      msg="退出后需要重新登录才能继续使用。"
      confirm-button-text="退出"
      cancel-button-text="取消"
      custom-class="sn-demo-contained"
    />

    <SnDialog
      v-model="verticalOpen"
      type="confirm"
      action-layout="vertical"
      title="保存草稿"
      msg="你可以保存为草稿稍后继续编辑。"
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
/* Docs-preview only — see dialog-mp-basic for the rationale. */
.sn-dialog.sn-demo-contained {
  position: absolute;
}
</style>
