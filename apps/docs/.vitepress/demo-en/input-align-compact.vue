<script setup lang="ts">
/** Demo: SnInput — alignRight (amount), compact (nested inside FormItem), inputmode. */
import { ref } from 'vue'
import { SnInput } from '@snui/vue-web'

const amount = ref('12500.00')
const phone = ref('')
const search = ref('')
</script>

<template>
  <div class="sn-demo">
    <h4 class="sn-demo__title">alignRight (amount field)</h4>
    <SnInput v-model="amount" align-right type="number" />

    <h4 class="sn-demo__title">inputmode — soft-keyboard hint</h4>
    <SnInput v-model="phone" inputmode="tel" placeholder="Phone (tel keyboard)" />
    <SnInput v-model="search" inputmode="search" placeholder="Search (search keyboard)" />

    <h4 class="sn-demo__title">compact + border='bottom'</h4>
    <SnInput v-model="search" compact border="bottom" placeholder="Inline search row" />
  </div>
</template>

<style scoped>
.sn-demo { display: flex; flex-direction: column; gap: 12px; max-width: 360px; }
.sn-demo__title { margin: 8px 0 0; font-size: 13px; font-weight: 600; color: var(--vp-c-text-1); }
</style>