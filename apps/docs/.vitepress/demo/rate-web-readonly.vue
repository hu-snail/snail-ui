<script setup lang="ts">
/** Demo: SnRate — readonly. */
import { ref } from 'vue';
import { SnRate } from '@snui/vue-web';
const v = ref(4);
</script>

<template>
  <div class="demo-row">
    <SnRate :model-value="v" readonly />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 24px;
  align-items: center;
}
</style>
