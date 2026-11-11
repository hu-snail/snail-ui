<script setup lang="ts">
/** Demo: SnInputNumber — step snapping + stepStrictly grid. */
import { ref } from 'vue';
import { SnInputNumber } from '@snui/vue-web';
const stepped = ref(10);
const strict = ref(25);
</script>

<template>
  <div class="demo-row">
    <SnInputNumber v-model="stepped" :min="0" :max="100" :step="5" class="demo-field" />
    <SnInputNumber
      v-model="strict"
      :min="0"
      :max="100"
      :step="25"
      step-strictly
      class="demo-field"
    />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}
.demo-field {
  width: 160px;
}
</style>
