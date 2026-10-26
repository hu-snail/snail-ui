<script setup lang="ts">
/** Demo: SnColorPicker — swatches. */
import { ref } from 'vue'
import { SnColorPicker } from '@snui/vue-web'
const color = ref('#f0a020')
</script>

<template>
  <SnColorPicker
    v-model="color"
    :swatches="['#18a058', '#2080f0', '#f0a020', '#d03050', '#722ed1', '#ffffff']"
  />
</template>
