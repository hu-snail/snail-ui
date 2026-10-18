<script setup lang="ts">
/** Demo: SnTitle + SnParagraph. */
</script>

<template>
  <div class="demo-col">
    <SnTitle :level="1">一级标题</SnTitle>
    <SnTitle :level="3">三级标题</SnTitle>
    <SnParagraph spacing="base">段落文本：SnParagraph 提供行距档位，默认渲染 p 元素。这里用 base 行距展示一段较长的说明文字，用于观察排版观感。</SnParagraph>
    <SnParagraph spacing="loose">loose 行距的段落，行间更松散，适合正文阅读场景。</SnParagraph>
  </div>
</template>

<style scoped>
.demo-col { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
</style>
