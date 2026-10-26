<script setup lang="ts">
/**
 * Demo: SnPopselect — single select, selected state, disabled and groups.
 */
import { ref } from 'vue'
import { SnButton, SnPopselect } from '@snui/vue-web'

const options = [
  { label: 'Product', value: 'group-product', children: [
    { label: 'Backlog', value: 'demand' },
    { label: 'Bug pool', value: 'bug' },
  ] },
  { label: 'Engineering', value: 'group-dev', children: [
    { label: 'Sprint tasks', value: 'iteration' },
    { label: 'Tech debt', value: 'debt', disabled: true },
  ] },
]

const selected = ref<string | null>(null)

const valueText: Record<string, string> = {
  demand: 'Backlog',
  bug: 'Bug pool',
  iteration: 'Sprint tasks',
  debt: 'Tech debt (disabled)',
}
</script>

<template>
  <div class="popselect-demo">
    <div class="popselect-demo__row">
      <SnPopselect v-model:value="selected" :options="options">
        <SnButton>{{ selected ? `Selected: ${valueText[selected] ?? selected}` : 'Select a task type' }}</SnButton>
      </SnPopselect>
      <span class="popselect-demo__state">value = {{ selected ?? 'null' }}</span>
    </div>
    <p class="popselect-demo__hint">
      The selected row gets primary-color text and a check mark; the menu closes after selection. "Tech debt" is disabled and skipped by keyboard highlighting.
    </p>
  </div>
</template>

<style scoped>
.popselect-demo {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.popselect-demo__row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.popselect-demo__state {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary, #8f939c);
}

.popselect-demo__hint {
  margin: 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary, #8f939c);
}
</style>
