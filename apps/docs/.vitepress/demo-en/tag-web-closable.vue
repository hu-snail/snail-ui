<script setup lang="ts">
/** Demo: SnTag — closable + custom close-icon slot. */
import { ref } from 'vue';
import { CircleX } from 'lucide-vue-next';
import { SnIcon, SnTag } from '@snui/vue-web';

const visible = ref(true);
</script>

<template>
  <div class="demo-col">
    <div class="demo-row">
      <SnTag v-if="visible" closable @close="visible = false">Closable tag</SnTag>
      <SnTag v-if="!visible" size="small" style="cursor: pointer" @click="visible = true"
        >Closed — click to restore</SnTag
      >
      <SnTag closable type="primary">Task</SnTag>
      <SnTag closable disabled type="success">Close disabled</SnTag>
      <SnTag closable loading>Cannot close while loading</SnTag>
    </div>
    <div class="demo-row">
      <SnTag closable round type="info">
        <template #close-icon><SnIcon :icon="CircleX" /></template>
        Custom close icon
      </SnTag>
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
