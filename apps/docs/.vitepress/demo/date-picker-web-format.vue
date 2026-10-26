<script setup lang="ts">
/** Demo: SnDatePicker — format tokens. */
import { ref } from 'vue'
import { SnDatePicker } from '@snui/vue-web'
const value = ref<number | null>(Date.now())
</script>

<template>
  <div class="demo-row">
    <SnDatePicker v-model="value" format="yyyy/MM/dd" />
    <SnDatePicker v-model="value" format="yyyy年MM月dd日" />
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
</style>
