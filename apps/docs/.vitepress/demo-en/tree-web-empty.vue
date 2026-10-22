<script setup lang="ts">
/** Demo: SnTree — empty data state with the empty slot. */
import { SnTree } from '@snui/vue-web'
</script>

<template>
  <div class="sn-demo">
    <SnTree :data="[]">
      <template #empty>
        <span class="sn-demo__empty">This folder is empty. Upload some files first</span>
      </template>
    </SnTree>
    <SnTree :data="[]" />
  </div>
</template>

<style scoped>
.sn-demo { display: flex; flex-direction: column; gap: 24px; max-width: 320px; }
.sn-demo__empty { color: var(--sn-web-color-text-tertiary); }
</style>
