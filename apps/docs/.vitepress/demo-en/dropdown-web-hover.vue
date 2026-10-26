<script setup lang="ts">
/** Demo: SnDropdown — hover trigger. */
import { SnDropdown, SnText } from '@snui/vue-web'
const options = [
  { label: 'Refresh', key: 'refresh' },
  { label: 'Save as…', key: 'save-as' },
  { label: 'Delete', key: 'delete', disabled: true },
]
</script>

<template>
  <div class="demo-row">
    <SnDropdown trigger="hover" :options="options">
      <SnText style="cursor: pointer; text-decoration: underline;">Hover me (300ms close delay)</SnText>
    </SnDropdown>
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 16px; align-items: center; }
</style>
