<script setup lang="ts">
/** Demo: SnSwitch — disabled / readonly / loading. */
import { ref } from 'vue';
import { SnSwitch } from '@snui/vue-web';
const v = ref(true);
</script>

<template>
  <div class="demo-row">
    <SnSwitch v-model="v" disabled />
    <SnSwitch :model-value="false" disabled />
    <SnSwitch v-model="v" readonly />
    <SnSwitch :model-value="false" loading />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 16px;
  align-items: center;
}
</style>
