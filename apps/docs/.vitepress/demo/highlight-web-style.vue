<script setup lang="ts">
/** Demo: SnHighlight — custom mark style via highlight-style. */
import { SnHighlight } from '@snui/vue-web'

const text = 'Snail AUI 全量使用 TypeScript 编写，和你的 TypeScript 项目无缝衔接'
const patterns = ['Snail AUI', 'TypeScript']

const markStyle = {
  padding: '0 6px',
  borderRadius: '3px',
  display: 'inline-block',
  color: 'var(--sn-web-color-background-surface)',
  background: 'var(--sn-web-color-action-primary)',
}
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
