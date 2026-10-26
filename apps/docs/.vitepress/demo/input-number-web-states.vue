<script setup lang="ts">
/** Demo: SnInputNumber — disabled / readonly / clearable. */
import { ref } from 'vue';
import { SnInputNumber } from '@snui/vue-web';
const v = ref(10);
</script>

<template>
  <div class="demo-col">
    <div class="demo-row">
      <SnInputNumber v-model="v" disabled class="demo-field" />
      <SnInputNumber v-model="v" readonly class="demo-field" />
    </div>
    <div class="demo-row">
      <SnInputNumber v-model="v" clearable class="demo-field" />
    </div>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}
.demo-row {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}
.demo-field {
  width: 130px;
}
</style>
