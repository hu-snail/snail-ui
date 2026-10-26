<script setup lang="ts">
/** Demo: SnCode — word-wrap soft-wraps overflowing lines. */
import { SnCode } from '@snui/vue-web';

const longLine = `function padEnd(string, length, chars) {
  const strLength = length ? stringSize(string) : 0
  return (length && strLength < length) ? (string + createPadding(length - strLength, chars)) : (string || '')
}`;
</script>

<template>
  <div class="sn-demo">
    <SnCode :code="longLine" language="javascript" word-wrap />
  </div>
</template>

<style scoped>
.sn-demo {
  color: var(--sn-web-color-text-primary);
}
</style>
