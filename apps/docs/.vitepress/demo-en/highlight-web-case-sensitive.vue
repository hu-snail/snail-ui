<script setup lang="ts">
/** Demo: SnHighlight — case-sensitive matching. */
import { SnHighlight } from '@snui/vue-web'

const text = 'Snail AUI is written entirely in TypeScript and integrates seamlessly with your TypeScript projects'
const patterns = ['Snail AUI', 'typeScript']
</script>

<template>
  <div class="sn-demo">
    <p class="sn-demo__hint">
      <SnHighlight :text="text" :patterns="patterns" :case-sensitive="true" />
    </p>
    <p class="sn-demo__hint sn-demo__hint--muted">
      Comparison: with case-insensitivity, <SnHighlight :text="text" :patterns="patterns" /> both spellings match.
    </p>
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sn-demo__hint {
  margin: 0;
  color: var(--sn-web-color-text-primary);
  line-height: 1.8;
}

.sn-demo__hint--muted {
  color: var(--sn-web-color-text-tertiary);
  font-size: 13px;
}
</style>
