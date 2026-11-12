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
    <SnButton type="primary" block @tap="alertOpen = true">Alert dialog</SnButton>
    <SnButton block @tap="confirmOpen = true">Confirm dialog</SnButton>
    <SnButton block @tap="promptOpen = true">Prompt dialog</SnButton>
    <text class="sn-dialog-demo__meta">Last action: {{ lastAction }}</text>

    <SnDialog
      v-model="alertOpen"
      type="alert"
      title="Heads up"
      msg="This notice only needs an acknowledgement."
      confirm-button-text="Got it"
      custom-class="sn-demo-contained"
      @confirm="lastAction = 'alert confirmed'"
    />

    <SnDialog
      v-model="confirmOpen"
      type="confirm"
      title="Delete item"
      msg="This cannot be undone. Continue?"
      confirm-button-text="Delete"
      cancel-button-text="Keep it"
      custom-class="sn-demo-contained"
      @confirm="lastAction = 'confirm confirmed'"
      @cancel="lastAction = 'confirm cancelled'"
    />

    <SnDialog
      v-model="promptOpen"
      type="prompt"
      title="Edit nickname"
      msg="Enter a new nickname (2-8 characters)"
      v-model:input-value="promptValue"
      :input-validate="
        (v: string | number) =>
          (String(v).length >= 2 && String(v).length <= 8) ||
          'Length must be between 2 and 8 characters'
      "
      show-err
      custom-class="sn-demo-contained"
      @confirm="lastAction = 'prompt confirmed: ' + promptValue"
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
