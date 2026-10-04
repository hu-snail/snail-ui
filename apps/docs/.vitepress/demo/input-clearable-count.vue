<script setup lang="ts">
/** Demo: SnInput — clearable + showCount. */
import { reactive } from 'vue'
import { SnInput } from '@snui/vue-web'

const form = reactive({
  clearable: 'click × to clear me',
  counter: 'hel',
})
</script>

<template>
  <div class="sn-demo">
    <h4 class="sn-demo__title">Clearable</h4>
    <SnInput v-model="form.clearable" clearable placeholder="Type then click ×" />
    <h4 class="sn-demo__title">Counter (max 10)</h4>
    <SnInput v-model="form.counter" :maxlength="10" show-count />
  </div>
</template>

<style scoped>
.sn-demo { display: flex; flex-direction: column; gap: 12px; max-width: 360px; }
.sn-demo__title { margin: 8px 0 0; font-size: 13px; font-weight: 600; color: var(--vp-c-text-1); }
</style>