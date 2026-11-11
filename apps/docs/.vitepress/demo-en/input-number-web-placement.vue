<script setup lang="ts">
/** Demo: SnInputNumber — stepper button placement (left / both / right). */
import { ref } from 'vue';
import { SnInputNumber } from '@snui/vue-web';
const v = ref(2);
</script>

<template>
  <div class="demo-row">
    <SnInputNumber v-model="v" button-placement="left" class="demo-field" />
    <SnInputNumber v-model="v" button-placement="both" class="demo-field" />
    <SnInputNumber v-model="v" button-placement="right" class="demo-field" />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}
.demo-field {
  width: 140px;
}
</style>
