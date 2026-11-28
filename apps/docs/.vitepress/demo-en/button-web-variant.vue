<script setup lang="ts">
/** Demo: SnButton (Web) — text / ghost / dashed variant matrix × semantic types. */
import { SnButton } from '@snui/vue-web';

type ButtonType = 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error';

/** Variant group labels (API name in parens). */
const variants = [
  { key: 'text', label: 'Text (text)' },
  { key: 'ghost', label: 'Ghost (ghost)' },
  { key: 'dashed', label: 'Dashed (dashed)' },
] as const;

/** Semantic types shown in every group. */
const types: Array<{ key: ButtonType; label: string }> = [
  { key: 'default', label: 'Default button' },
  { key: 'primary', label: 'Primary button' },
  { key: 'success', label: 'Success button' },
  { key: 'info', label: 'Info button' },
  { key: 'warning', label: 'Warning button' },
  { key: 'error', label: 'Danger button' },
];
</script>

<template>
  <div class="sn-demo sn-demo--stack">
    <div v-for="variant in variants" :key="variant.key" class="sn-demo__group">
      <p class="sn-demo__label">{{ variant.label }}</p>
      <div class="sn-demo__row">
        <SnButton
          v-for="item in types"
          :key="item.key"
          :type="item.key"
          :text="variant.key === 'text'"
          :ghost="variant.key === 'ghost'"
          :dashed="variant.key === 'dashed'"
        >
          {{ variant.key === 'text' ? 'Button' : item.label }}
        </SnButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.sn-demo__group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
.sn-demo__label {
  margin: 0;
  font-size: 12px;
  color: var(--vp-c-text-2);
}
</style>
