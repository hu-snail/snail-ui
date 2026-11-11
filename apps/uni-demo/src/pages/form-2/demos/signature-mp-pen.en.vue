<script setup lang="ts">
/** Demo: sn-signature — pen look: `penColor` overrides the stroke color and `lineWidth` sets the width. */
import SnSignature from '@snui/uni-src/components/sn-signature/sn-signature.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSignature :line-width="4" pen-color="var(--sn-mp-color-action-primary)" />
  </view>
</template>
