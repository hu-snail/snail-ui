<script setup lang="ts">
/** Demo: SnTitle + SnParagraph. */
import { SnTitle, SnParagraph } from '@snui/vue-web';
</script>

<template>
  <div class="demo-col">
    <SnTitle :level="1">Heading level 1</SnTitle>
    <SnTitle :level="3">Heading level 3</SnTitle>
    <SnParagraph spacing="base"
      >Paragraph text: SnParagraph offers line-height presets and renders a p element by default.
      This longer text uses the base line height so you can judge the typesetting.</SnParagraph
    >
    <SnParagraph spacing="loose"
      >A paragraph with loose line height — the lines sit further apart, suited to body
      reading.</SnParagraph
    >
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}
</style>
