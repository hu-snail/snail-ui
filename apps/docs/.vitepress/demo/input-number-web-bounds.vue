<script setup lang="ts">
/** Demo: SnInputNumber — bounds / step / stepStrictly. */
import { ref } from 'vue'
import { SnInputNumber } from '@snui/vue-web'
const a = ref(10)
const b = ref(25)
</script>

<template>
  <div class="demo-row">
    <SnInputNumber v-model="a" :min="0" :max="100" :step="5" />
    <SnInputNumber v-model="b" :min="0" :max="100" :step="25" step-strictly />
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
</style>
