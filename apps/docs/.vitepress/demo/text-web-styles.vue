<script setup lang="ts">
/** Demo: SnText — style modifiers. */
import { SnText } from '@snui/vue-web'
</script>

<template>
  <div class="demo-col">
    <SnText strong>加粗文本</SnText>
    <SnText italic>斜体文本</SnText>
    <SnText underline>下划线文本</SnText>
    <SnText delete>删除线文本</SnText>
    <SnText code>const a = 1</SnText>
    <SnText disabled>禁用文本</SnText>
  </div>
</template>

<style scoped>
.demo-col { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
</style>
