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
      value="犹如一位幽默风趣的魔术师，巧妙地将繁琐的信息变成了一个神秘的二维码"
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
.demo-col { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
</style>
