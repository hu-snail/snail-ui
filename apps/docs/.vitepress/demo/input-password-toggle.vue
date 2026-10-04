<script setup lang="ts">
/** Demo: SnInput — showPassword toggles type=password between 'password' and 'text'. */
import { ref } from 'vue'
import { SnInput } from '@snui/vue-web'

const secret = ref('initial-secret-123')
</script>

<template>
  <div class="sn-demo">
    <SnInput v-model="secret" type="password" show-password placeholder="Password with toggle" />
    <span class="sn-demo__hint">Click 👁 to reveal / 🙈 to hide.</span>
  </div>
</template>

<style scoped>
.sn-demo { display: flex; flex-direction: column; gap: 8px; max-width: 360px; }
.sn-demo__hint { font-size: 12px; color: var(--vp-c-text-2); }
</style>