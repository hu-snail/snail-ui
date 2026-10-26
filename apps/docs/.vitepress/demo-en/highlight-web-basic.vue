<script setup lang="ts">
/** Demo: SnHighlight — basic keyword highlighting. */
import { SnHighlight } from '@snui/vue-web';

const text =
  'Snail AUI is a multi-end UI framework — schema-driven, written in TypeScript, and fast.';
const patterns = ['Snail AUI', 'Schema', 'TypeScript', 'fast'];
</script>

<template>
  <div class="sn-demo">
    <SnHighlight :text="text" :patterns="patterns" />
  </div>
</template>

<style scoped>
.sn-demo {
  color: var(--sn-web-color-text-primary);
  line-height: 1.8;
}
</style>
