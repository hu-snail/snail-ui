<script setup lang="ts">
/** Demo: SnQrCode — error correction level switching. */
import { ref } from 'vue'
import { SnQrCode, SnRadioButton, SnRadioGroup } from '@snui/vue-web'

const LEVELS = [
  { value: 'L', label: 'L' },
  { value: 'M', label: 'M' },
  { value: 'Q', label: 'Q' },
  { value: 'H', label: 'H' },
] as const

const errorCorrectionLevel = ref<'L' | 'M' | 'Q' | 'H'>('M')
</script>

<template>
  <div class="demo-col">
    <SnQrCode
      value="Like a witty magician, elegantly turning tedious information into a mysterious QR code"
      :error-correction-level="errorCorrectionLevel"
    />
    <SnRadioGroup v-model="errorCorrectionLevel">
      <SnRadioButton
        v-for="level in LEVELS"
        :key="level.value"
        :checked-value="level.value"
      >
        {{ level.label }}
      </SnRadioButton>
    </SnRadioGroup>
  </div>
</template>

<style scoped>
.demo-col { display: flex; flex-direction: column; gap: 24px; align-items: flex-start; }
</style>
