<script setup lang="ts">
/** Demo: SnQrCode — module shapes + multi-color palette. */
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
    <SnFlex>
      <SnQrCode value="https://snail.aui" shape="dot" />
      <SnQrCode
        value="https://snail.aui"
        shape="rounded"
        :colors="['#18a058', '#2080f0', '#f0a020', '#d03050', '#722ed1']"
      />
      <SnQrCode
        value="https://snail.aui"
        shape="dot"
        :colors="['#18a058', '#36ad6a', '#5acea7', '#2080f0']"
      />
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
