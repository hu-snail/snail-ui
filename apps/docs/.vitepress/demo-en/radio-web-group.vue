<script setup lang="ts">
/** Demo: SnRadioGroup — options + slot, shared name. */
import { ref } from 'vue'
import { SnRadio, SnRadioGroup } from '@snui/vue-web'
const city = ref('Shanghai')
</script>

<template>
  <div class="demo-col">
    <SnRadioGroup v-model="city" name="city" :options="['Beijing', 'Shanghai', 'Guangzhou']" />
    <SnRadioGroup v-model="city" name="city">
      <SnRadio checked-value="Beijing" label="Beijing (slot)" />
      <SnRadio checked-value="Shanghai" label="Shanghai (slot)" />
    </SnRadioGroup>
    <pre class="demo-log">{{ city }}</pre>
  </div>
</template>

<style scoped>
.demo-col { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
.demo-log { margin: 0; padding: 8px 12px; background: var(--vp-c-bg-soft); border-radius: 6px; font-size: 12px; }
</style>
