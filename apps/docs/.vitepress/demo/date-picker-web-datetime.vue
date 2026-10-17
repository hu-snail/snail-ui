<script setup lang="ts">
/** Demo: SnDatePicker — datetime mode. */
import { ref } from 'vue'
import { SnDatePicker } from '@snui/vue-web'
const value = ref<number | null>(Date.now())
</script>

<template>
  <SnDatePicker v-model="value" type="datetime" />
</template>
