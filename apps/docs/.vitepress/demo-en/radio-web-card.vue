<script setup lang="ts">
/** Demo: SnRadio — card variant with custom card content + corner tick. */
import { ref } from 'vue';
import { SnRadio, SnRadioGroup } from '@snui/vue-web';

const plan = ref('pro');
</script>

<template>
  <SnRadioGroup v-model="plan" variant="card" class="demo-cards">
    <SnRadio checked-value="basic">
      <template #card="{ checked }">
        <span class="demo-card__title">Basic</span>
        <span class="demo-card__price">¥0</span>
        <span class="demo-card__desc">Solo · 1 workspace</span>
        <span v-if="checked" class="demo-card__hint">Selected</span>
      </template>
    </SnRadio>
    <SnRadio checked-value="pro">
      <template #card>
        <span class="demo-card__title">Pro</span>
        <span class="demo-card__price">¥99</span>
        <span class="demo-card__desc">Teams · 10 workspaces</span>
      </template>
    </SnRadio>
    <SnRadio checked-value="enterprise">
      <template #card>
        <span class="demo-card__title">Enterprise</span>
        <span class="demo-card__price">按需</span>
        <span class="demo-card__desc">Self-hosted · priority support</span>
      </template>
    </SnRadio>
  </SnRadioGroup>
</template>

<style scoped>
.demo-cards {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  width: 100%;
}
.demo-cards :deep(.sn-radio--variant-card) {
  flex: 1 1 180px;
  min-width: 180px;
}
.demo-card__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--sn-web-color-text-primary);
}
.demo-card__price {
  margin-top: 6px;
  font-size: 20px;
  font-weight: 700;
  color: var(--sn-web-color-action-primary);
}
.demo-card__desc {
  margin-top: 4px;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
.demo-card__hint {
  margin-top: 6px;
  font-size: 12px;
  color: var(--sn-web-color-action-primary);
}
</style>
