<script setup lang="ts">
/** Demo: sn-signature — undo / redo: `enableHistory` renders the undo / redo buttons; the pad owns its own history stack. */
import SnSignature from '@snui/uni-src/components/sn-signature/sn-signature.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSignature enable-history />
  </view>
</template>
