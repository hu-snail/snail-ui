<script setup lang="ts">
/** Demo: SnTag — custom colors (n-tag `color` string | object). */
import { SnTag } from '@snui/vue-web';

/** Saturated custom colors — text auto-picks white for contrast. */
const saturated = [
  '#f53f3f',
  '#f77234',
  '#f7ba1e',
  '#00b42a',
  '#14c9c9',
  '#3491fa',
  '#722ed1',
  '#f5319d',
];
</script>

<template>
  <div class="demo-col">
    <div class="demo-row">
      <SnTag v-for="c in saturated" :key="c" :color="c" closable>{{ c }}</SnTag>
    </div>
    <div class="demo-row">
      <SnTag color="#fff7e6">Auto dark text on light bg</SnTag>
      <SnTag color="#e8f7ff">Auto dark text on light bg</SnTag>
    </div>
    <div class="demo-row">
      <SnTag :color="{ color: '#fff7e6', borderColor: '#ffa940', textColor: '#d46b08' }"
        >Full color object</SnTag
      >
      <SnTag round :color="{ color: '#e8f7ff', borderColor: '#3491fa', textColor: '#3491fa' }"
        >Object + pill</SnTag
      >
    </div>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}
.demo-row {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}
</style>
