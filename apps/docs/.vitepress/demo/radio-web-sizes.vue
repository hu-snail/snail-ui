<script setup lang="ts">
/** Demo: SnRadio — five sizes. */
import { ref } from 'vue'
import { SnRadio } from '@snui/vue-web'
const v = ref('x')
</script>

<template>
  <div class="demo-row">
    <SnRadio v-for="s in ['mini', 'tiny', 'small', 'medium', 'large']" :key="s" v-model="v" :size="s" checked-value="x" :label="s" />
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; }
</style>
