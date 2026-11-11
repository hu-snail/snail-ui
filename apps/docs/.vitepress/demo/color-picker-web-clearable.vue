<script setup lang="ts">
/** Demo: SnColorPicker — clearable. */
import { ref } from 'vue';
import { SnColorPicker } from '@snui/vue-web';
const a = ref('#2080f0');
</script>

<template>
  <div class="demo-row">
    <SnColorPicker v-model="a" clearable />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}
</style>
