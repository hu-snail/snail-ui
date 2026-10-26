<script setup lang="ts">
/** Demo: SnHighlight — custom mark element via highlight-tag. */
import { SnHighlight } from '@snui/vue-web'

const text = 'Snail AUI 是一个多端 UI 框架，它主打 Schema 驱动，用 TypeScript 编写，快。'
const patterns = ['Snail AUI', 'Schema', 'TypeScript', '快']
</script>

<template>
  <div class="sn-demo">
    <SnHighlight
      :text="text"
      highlight-tag="span"
      :patterns="patterns"
      highlight-style="text-decoration: underline"
    />
  </div>
</template>

<style scoped>
.sn-demo {
  color: var(--sn-web-color-text-primary);
  line-height: 1.8;
}
</style>
