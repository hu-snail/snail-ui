<script setup lang="ts">
/** Demo: SnTag — closable. */
import { ref } from 'vue'
import { SnTag } from '@snui/vue-web'
const visible = ref(true)
</script>

<template>
  <div class="demo-row">
    <SnTag v-if="visible" closable @close="visible = false">Closable tag</SnTag>
    <SnTag v-if="!visible" size="small" @click="visible = true" style="cursor: pointer;">Closed — click to restore</SnTag>
    <SnTag closable type="primary">Task</SnTag>
    <SnTag closable type="success" disabled>Close disabled</SnTag>
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 8px; align-items: center; }
</style>
