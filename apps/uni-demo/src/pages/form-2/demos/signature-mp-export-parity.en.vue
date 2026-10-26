<script setup lang="ts">
/**
 * Demo: sn-signature — export and pressure props.
 * fileType / quality / exportScale / pressure / maxWidth / minWidth / minSpeed are declared
 * for wd-signature parity. This build never rasterizes: the host applies the export trio
 * inside the confirm callback, and pressure simulation (speed → width) is not implemented,
 * so these props do not change the pad behaviour.
 */
import { ref } from 'vue';
import SnSignature from '@snui/uni-src/components/sn-signature/sn-signature.vue';

const strokes = ref(0);
const onConfirm = (result: { paths: unknown[] }) => {
  strokes.value = result.paths.length;
};
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title"
      >fileType / quality / exportScale (used by the host when exporting)</text
    >
    <SnSignature
      file-type="png"
      :quality="0.92"
      :export-scale="2"
      confirm-text="Export PNG"
      @confirm="onConfirm"
    />
    <text class="sn-demo__meta">Strokes: {{ strokes }}</text>

    <text class="sn-demo__title"
      >pressure / maxWidth / minWidth / minSpeed (pressure simulation is not implemented)</text
    >
    <SnSignature
      :pressure="true"
      :max-width="8"
      :min-width="2"
      :min-speed="0.5"
      :line-width="3"
      custom-class="sn-demo__pad"
      custom-style="border-radius: var(--sn-mp-radius-lg);"
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

.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}

.sn-demo__pad {
  border: 1rpx solid var(--sn-mp-color-border-default);
}
</style>
