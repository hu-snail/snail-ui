<script setup lang="ts">
/** Demo: SnCheckbox — card variant with custom card content. */
import { ref } from 'vue';
import { SnCheckbox, SnCheckboxGroup } from '@snui/vue-web';

const picked = ref<string[]>(['mail']);
</script>

<template>
  <SnCheckboxGroup v-model="picked" variant="card" class="demo-cards">
    <SnCheckbox value="mail">
      <template #card="{ checked }">
        <span class="demo-card__title">Email</span>
        <span class="demo-card__desc">Daily digest · toggle anytime</span>
        <span v-if="checked" class="demo-card__hint">On</span>
      </template>
    </SnCheckbox>
    <SnCheckbox value="sms">
      <template #card>
        <span class="demo-card__title">SMS</span>
        <span class="demo-card__desc">Critical alerts only</span>
      </template>
    </SnCheckbox>
    <SnCheckbox value="push">
      <template #card>
        <span class="demo-card__title">Push</span>
        <span class="demo-card__desc">Realtime to device</span>
      </template>
    </SnCheckbox>
  </SnCheckboxGroup>
</template>

<style scoped>
.demo-cards {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  width: 100%;
}
.demo-cards :deep(.sn-checkbox--variant-card) {
  flex: 1 1 180px;
  min-width: 180px;
}
.demo-card__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--sn-web-color-text-primary);
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
