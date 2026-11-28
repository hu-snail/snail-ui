<script setup lang="ts">
/** Demo: SnInputNumber — the both-placement hover plate only paints on mouse-over (default buttonHoverBackground). */
import { ref } from 'vue';
import { SnInputNumber } from '@snui/vue-web';
const v = ref(2);
</script>

<template>
  <div class="demo-row">
    <SnInputNumber v-model="v" button-placement="both" class="demo-field" />
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
