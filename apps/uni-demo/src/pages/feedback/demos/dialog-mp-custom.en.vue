<script setup lang="ts">
/**
 * Demo: sn-dialog (uni-end) — selector / root-portal / custom-style.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-dialog from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnDialog from '@snui/uni-src/components/sn-dialog/sn-dialog.vue';

const open = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @tap="open = true">custom-style on the panel</SnButton>

    <text class="sn-demo__meta">
      custom-style lands on the panel node (extra padding and a min-width here); selector /
      root-portal are declared for the function API and wot-ui parity and have no effect in the
      component form.
    </text>

    <SnDialog
      v-model="open"
      type="alert"
      title="Custom panel"
      msg="custom-style is appended to the inner panel node and stacks with the component's own layout styles."
      confirm-button-text="Got it"
      selector="sn-demo-dialog"
      :root-portal="true"
      custom-style="padding: var(--sn-mp-spacing-5); min-width: 480rpx;"
      custom-class="sn-demo-contained"
      @confirm="open = false"
    />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* Docs preview only — pin the fixed layer to the phone frame. The uni-demo-x
 * generated copy strips this rule in gen-x.mjs (vapor ignores style-level
 * conditional compilation, so the App side must not ship it). */
.sn-dialog.sn-demo-contained {
  position: absolute;
}
</style>
