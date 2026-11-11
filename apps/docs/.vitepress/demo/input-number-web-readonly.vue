<script setup lang="ts">
/** Demo: SnInputNumber — readonly (value visible, not editable). */
import { ref } from 'vue';
import { SnInputNumber } from '@snui/vue-web';
const v = ref(10);
</script>

<template>
  <div class="demo-row">
    <SnInputNumber v-model="v" readonly class="demo-field" />
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
  width: 130px;
}
</style>
