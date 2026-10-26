<script setup lang="ts">
/** Demo: SnText — style modifiers. */
import { SnText } from '@snui/vue-web';
</script>

<template>
  <div class="demo-col">
    <SnText strong>Bold text</SnText>
    <SnText italic>Italic text</SnText>
    <SnText underline>Underlined text</SnText>
    <SnText delete>Strikethrough text</SnText>
    <SnText code>const a = 1</SnText>
    <SnText disabled>Disabled text</SnText>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
}
</style>
