<script setup lang="ts">
/** Demo: SnTag — checkable with per-type checked colors. */
import { ref } from 'vue';
import { SnTag } from '@snui/vue-web';

const picked = ref(true);
</script>

<template>
  <div class="demo-col">
    <div class="demo-row">
      <SnTag v-model:checked="picked" checkable>Checkable: {{ picked }}</SnTag>
      <SnTag :checked="false" checkable>Unchecked</SnTag>
      <SnTag :checked="true" checkable type="primary">Checked state</SnTag>
    </div>
    <div class="demo-row">
      <SnTag :checked="true" checkable type="success">Success</SnTag>
      <SnTag :checked="true" checkable type="warning">Warning</SnTag>
      <SnTag :checked="true" checkable type="error">Error</SnTag>
      <SnTag :checked="true" checkable round type="info">Pill checked</SnTag>
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
}
</style>
