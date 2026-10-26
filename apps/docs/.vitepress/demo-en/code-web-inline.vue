<script setup lang="ts">
/** Demo: SnCode — inline rendering inside a sentence. */
import { SnCode } from '@snui/vue-web'
</script>

<template>
  <div class="sn-demo sn-code-demo">
    <p>
      The config option <SnCode code='{"mode": "strict"}' language="json" inline /> enables strict mode.
    </p>
    <p>
      The command <SnCode code="pnpm snui lint" inline /> checks all component directories.
    </p>
  </div>
</template>

<style scoped>
.sn-code-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
  color: var(--sn-web-color-text-primary);
}
</style>
