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
/* H5 / WEB only — docs preview pins the fixed layer to the phone frame.
 * uni-app x App compiles this OUT: App-side `position: absolute` lays out in
 * the direct parent's content box (css/position) and the page class still
 * reaches the component root (style-isolation) — the rule would pin the
 * fullscreen fixed layer into the demo card and clip it (App overflow
 * defaults to hidden). */
/* #ifdef H5 || WEB */
.sn-dialog.sn-demo-contained {
  position: absolute;
}
/* #endif */
</style>
