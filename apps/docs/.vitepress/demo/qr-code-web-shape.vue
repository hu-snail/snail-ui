<script setup lang="ts">
/** Demo: SnQrCode — module shapes (square / dot / rounded). */
import { ref } from 'vue';
import { SnFlex, SnQrCode, SnRadioButton, SnRadioGroup } from '@snui/vue-web';

const shape = ref<'square' | 'dot' | 'rounded'>('dot');
const SHAPES = [
  { value: 'square', label: '方块' },
  { value: 'dot', label: '圆点（小程序码）' },
  { value: 'rounded', label: '圆角' },
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
