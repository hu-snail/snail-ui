<script setup lang="ts">
/** Demo: SnInputNumber — buttonPlacement + sizes. */
import { ref } from 'vue';
import { SnInputNumber } from '@snui/vue-web';
const v = ref(1);
</script>

<template>
  <div class="demo-col">
    <div class="demo-row">
      <SnInputNumber v-model="v" size="mini" class="demo-field" />
      <SnInputNumber v-model="v" size="tiny" class="demo-field" />
      <SnInputNumber v-model="v" size="small" class="demo-field" />
    </div>
    <div class="demo-row">
      <SnInputNumber v-model="v" size="medium" class="demo-field" />
      <SnInputNumber v-model="v" size="large" class="demo-field" />
    </div>
    <div class="demo-row">
      <SnInputNumber v-model="v" button-placement="right" class="demo-field" />
      <SnInputNumber v-model="v" button-placement="both" class="demo-field" />
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
  flex-wrap: wrap;
  align-items: center;
}
.demo-field {
  width: 108px;
}
</style>
