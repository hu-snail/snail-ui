<script setup lang="ts">
/** Demo: SnColorPicker — readonly. */
import { ref } from 'vue';
import { SnColorPicker } from '@snui/vue-web';
const b = ref('#18a058');
</script>

<template>
  <div class="demo-row">
    <SnColorPicker v-model="b" readonly />
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
