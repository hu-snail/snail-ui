<script setup lang="ts">
/** Demo: sn-signature — button labels: confirmText / clearText / revokeText / restoreText, plus the undoText / redoText overrides. */
import SnSignature from '@snui/uni-src/components/sn-signature/sn-signature.vue'

const onConfirm = (_result: unknown) => {
  // The host exports / uploads the stroke geometry here.
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">confirmText / clearText</text>
    <SnSignature confirm-text="Save signature" clear-text="Redraw" @confirm="onConfirm" />

    <text class="sn-demo__title">enableHistory + revokeText / restoreText</text>
    <SnSignature
      enable-history
      confirm-text="Save signature"
      clear-text="Redraw"
      revoke-text="Undo stroke"
      restore-text="Redo stroke"
      @confirm="onConfirm"
    />

    <text class="sn-demo__title">undoText / redoText (win over revokeText / restoreText when both are set)</text>
    <SnSignature
      enable-history
      undo-text="Undo"
      redo-text="Redo"
      confirm-text="Save signature"
      @confirm="onConfirm"
    />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
</style>
