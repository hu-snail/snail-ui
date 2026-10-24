<script setup lang="ts">
/** Demo: SnInput — status / error / warning visual states. */
import { reactive } from 'vue'
import { SnInput } from '@snui/vue-web'

const form = reactive({ default: 'Default', error: 'Invalid input', warning: 'Heads up' })
</script>

<template>
  <div class="sn-demo">
    <SnInput v-model="form.default" status="default" />
    <SnInput v-model="form.error" status="error" />
    <SnInput v-model="form.warning" status="warning" />
  </div>
</template>

<style scoped>
.sn-demo { display: flex; flex-direction: column; gap: 8px; max-width: 360px; }
</style>