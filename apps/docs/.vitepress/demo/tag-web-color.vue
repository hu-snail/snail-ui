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
      <SnTag color="#fff7e6">浅底自动深字</SnTag>
      <SnTag color="#e8f7ff">浅底自动深字</SnTag>
    </div>
    <div class="demo-row">
      <SnTag :color="{ color: '#fff7e6', borderColor: '#ffa940', textColor: '#d46b08' }"
        >完整对象</SnTag
      >
      <SnTag round :color="{ color: '#e8f7ff', borderColor: '#3491fa', textColor: '#3491fa' }"
        >对象 + 胶囊</SnTag
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
