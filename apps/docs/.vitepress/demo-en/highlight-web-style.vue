<script setup lang="ts">
/** Demo: SnHighlight — custom mark style via highlight-style. */
import { SnHighlight } from '@snui/vue-web';

const text =
  'Snail AUI is written entirely in TypeScript and integrates seamlessly with your TypeScript projects';
const patterns = ['Snail AUI', 'TypeScript'];

const markStyle = {
  padding: '0 6px',
  borderRadius: '3px',
  display: 'inline-block',
  color: 'var(--sn-web-color-background-surface)',
  background: 'var(--sn-web-color-action-primary)',
};
</script>

<template>
  <div class="sn-demo">
    <SnHighlight :text="text" :patterns="patterns" :highlight-style="markStyle" />
  </div>
</template>

<style scoped>
.sn-demo {
  color: var(--sn-web-color-text-primary);
  line-height: 2.2;
}
</style>
