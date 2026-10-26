<script setup lang="ts">
/**
 * Demo: sn-dialog (uni-end) — alert / confirm / prompt.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-dialog from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnDialog from '@snui/uni-src/components/sn-dialog/sn-dialog.vue';

const alertOpen = ref(false);
const confirmOpen = ref(false);
const promptOpen = ref(false);
const promptValue = ref('');
const lastAction = ref('—');
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @tap="alertOpen = true">Alert 弹框</SnButton>
    <SnButton block @tap="confirmOpen = true">Confirm 弹框</SnButton>
    <SnButton block @tap="promptOpen = true">Prompt 弹框</SnButton>
    <text class="sn-dialog-demo__meta">上次操作：{{ lastAction }}</text>

    <SnDialog
      v-model="alertOpen"
      type="alert"
      title="操作提示"
      msg="这是一条仅需确认的提示信息。"
      confirm-button-text="我知道了"
      custom-class="sn-demo-contained"
      @confirm="lastAction = 'alert 确认'"
    />

    <SnDialog
      v-model="confirmOpen"
      type="confirm"
      title="删除确认"
      msg="删除后不可恢复，确定继续吗？"
      confirm-button-text="删除"
      cancel-button-text="再想想"
      custom-class="sn-demo-contained"
      @confirm="lastAction = 'confirm 确认'"
      @cancel="lastAction = 'confirm 取消'"
    />

    <SnDialog
      v-model="promptOpen"
      type="prompt"
      title="修改昵称"
      msg="请输入新的昵称（2-8 个字符）"
      v-model:input-value="promptValue"
      :input-validate="
        (v: string | number) =>
          (String(v).length >= 2 && String(v).length <= 8) || '长度需在 2-8 个字符之间'
      "
      show-err
      custom-class="sn-demo-contained"
      @confirm="lastAction = 'prompt 确认：' + promptValue"
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
/* Docs-preview only: the dialog root is `position: fixed`, which would cover the
 * whole docs page instead of the phone screen. Not needed in a real app. */
.sn-dialog.sn-demo-contained {
  position: absolute;
}
</style>
