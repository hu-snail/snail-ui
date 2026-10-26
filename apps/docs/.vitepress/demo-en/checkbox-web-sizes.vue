<script setup lang="ts">
/** Demo: SnCheckbox — five sizes. */
import { ref } from 'vue'
import { SnCheckbox } from '@snui/vue-web'
const v = ref(false)
</script>

<template>
  <div class="demo-row">
    <SnCheckbox v-for="s in ['mini', 'tiny', 'small', 'medium', 'large']" :key="s" v-model="v" :size="s" :label="s" />
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; }
</style>
