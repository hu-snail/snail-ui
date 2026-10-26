<script setup lang="ts">
/** Demo: SnColorPicker — modes tabs. */
import { ref } from 'vue';
import { SnColorPicker } from '@snui/vue-web';
const color = ref('#2080f0');
</script>

<template>
  <SnColorPicker v-model="color" :modes="['rgb', 'hsl', 'hex']" />
</template>
