<script setup lang="ts">
/** Demo: SnTable — small / medium / large size scale. */
import { SnTable } from '@snui/vue-web'
</script>

<template>
  <div class="sn-demo">
    <SnTable size="small">
      <thead>
        <tr><th>small</th><th>Col B</th></tr>
      </thead>
      <tbody>
        <tr><td>Content</td><td>Content</td></tr>
      </tbody>
    </SnTable>

    <SnTable size="medium">
      <thead>
        <tr><th>medium (default)</th><th>Col B</th></tr>
      </thead>
      <tbody>
        <tr><td>Content</td><td>Content</td></tr>
      </tbody>
    </SnTable>

    <SnTable size="large">
      <thead>
        <tr><th>large</th><th>Col B</th></tr>
      </thead>
      <tbody>
        <tr><td>Content</td><td>Content</td></tr>
      </tbody>
    </SnTable>
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;

  overflow-x: auto;
}
</style>
