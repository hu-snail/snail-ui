<script setup lang="ts">
/** Demo: SnInput — all 4 size presets. */
import { reactive } from 'vue'
import { SnInput } from '@snui/vue-web'

const form = reactive({ tiny: 'Tiny', small: 'Small', medium: 'Medium', large: 'Large' })
</script>

<template>
  <div class="sn-demo">
    <SnInput v-model="form.tiny" size="tiny" placeholder="Tiny" />
    <SnInput v-model="form.small" size="small" placeholder="Small" />
    <SnInput v-model="form.medium" size="medium" placeholder="Medium" />
    <SnInput v-model="form.large" size="large" placeholder="Large" />
  </div>
</template>

<style scoped>
.sn-demo { display: flex; flex-direction: column; gap: 8px; max-width: 360px; }
</style>