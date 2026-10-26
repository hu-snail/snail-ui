<script setup lang="ts">
/** Demo: sn-signature — 按钮文案：confirmText / clearText / revokeText / restoreText，以及 undoText / redoText 覆盖。 */
import SnSignature from '@snui/uni-src/components/sn-signature/sn-signature.vue';

const onConfirm = (_result: unknown) => {
  // 宿主在这里拿笔画几何做导出 / 上传。
};
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">confirmText / clearText</text>
    <SnSignature confirm-text="保存签名" clear-text="重写" @confirm="onConfirm" />

    <text class="sn-demo__title">enableHistory + revokeText / restoreText</text>
    <SnSignature
      enable-history
      confirm-text="保存签名"
      clear-text="重写"
      revoke-text="撤一笔"
      restore-text="再画一笔"
      @confirm="onConfirm"
    />

    <text class="sn-demo__title"
      >undoText / redoText（同时设置时覆盖 revokeText / restoreText）</text
    >
    <SnSignature
      enable-history
      undo-text="撤回"
      redo-text="恢复"
      confirm-text="保存签名"
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
