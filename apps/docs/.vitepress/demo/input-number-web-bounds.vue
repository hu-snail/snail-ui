<script setup lang="ts">
/** Demo: SnInputNumber — min / max bounds (out-of-range commits clamp). */
import { ref } from 'vue';
import { SnInputNumber } from '@snui/vue-web';
const v = ref(10);
</script>

<template>
  <div class="demo-row">
    <SnInputNumber v-model="v" :min="0" :max="100" class="demo-field" />
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
