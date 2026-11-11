<script setup lang="ts">
/** Demo: SnQrCode — module shapes (square / dot / rounded). */
import { ref } from 'vue';
import { SnFlex, SnQrCode, SnRadioButton, SnRadioGroup } from '@snui/vue-web';

const shape = ref<'square' | 'dot' | 'rounded'>('dot');
const SHAPES = [
  { value: 'square', label: 'Square' },
  { value: 'dot', label: 'Dot (mini-program)' },
  { value: 'rounded', label: 'Rounded' },
] as const;
</script>

<template>
  <div class="demo-col">
    <SnFlex vertical>
      <SnRadioGroup v-model="shape" name="qr-shape">
        <SnRadioButton v-for="s in SHAPES" :key="s.value" :checked-value="s.value">
          {{ s.label }}
        </SnRadioButton>
      </SnRadioGroup>
      <SnQrCode value="https://snail.aui" :shape="shape" />
    </SnFlex>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
