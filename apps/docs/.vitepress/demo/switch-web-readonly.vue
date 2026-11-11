<script setup lang="ts">
/** Demo: SnSwitch — readonly. */
import { ref } from 'vue';
import { SnSwitch } from '@snui/vue-web';
const v = ref(true);
</script>

<template>
  <div class="demo-row">
    <SnSwitch v-model="v" readonly />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 16px;
  align-items: center;
}
</style>
