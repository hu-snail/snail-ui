<script setup lang="ts">
/** Demo: SnDatePicker — month / year modes. */
import { ref } from 'vue'
import { SnDatePicker } from '@snui/vue-web'
const month = ref<number | null>(null)
const year = ref<number | null>(null)
</script>

<template>
  <div class="demo-row">
    <SnDatePicker v-model="month" type="month" placeholder="选择月份" />
    <SnDatePicker v-model="year" type="year" placeholder="选择年份" />
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 12px; align-items: center; }
</style>
