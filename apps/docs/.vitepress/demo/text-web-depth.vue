<script setup lang="ts">
/** Demo: SnText — depth scale. */
</script>

<template>
  <div class="demo-col">
    <SnText depth="1">depth 1 次级文本</SnText>
    <SnText depth="2">depth 2 更浅</SnText>
    <SnText depth="3">depth 3 最浅</SnText>
  </div>
</template>

<style scoped>
.demo-col { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
</style>
