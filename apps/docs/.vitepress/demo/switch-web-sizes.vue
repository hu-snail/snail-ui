<script setup lang="ts">
/** Demo: SnSwitch — sizes. */
import { ref } from 'vue'
import { SnSwitch } from '@snui/vue-web'
const v = ref(true)
</script>

<template>
  <div class="demo-row">
    <SnSwitch v-for="s in ['small', 'medium', 'large']" :key="s" v-model="v" :size="s" />
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 16px; align-items: center; }
</style>
