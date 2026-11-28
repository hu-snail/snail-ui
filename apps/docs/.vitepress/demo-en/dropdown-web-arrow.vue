<script setup lang="ts">
/** Demo: SnDropdown — built-in arrow icon, custom `icon` prop and `#icon` slot. */
import { SnButton, SnDropdown, SnIcon } from '@snui/vue-web';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-vue-next';

const options = [
  { label: 'Edit', key: 'edit' },
  { label: 'Duplicate', key: 'copy' },
  { label: 'Delete', key: 'delete' },
];
</script>

<template>
  <div class="demo-row">
    <SnDropdown trigger="click" :options="options">
      <SnButton>Default arrow</SnButton>
    </SnDropdown>

    <SnDropdown trigger="click" :options="options" :icon="ChevronsUpDown">
      <SnButton>Custom icon</SnButton>
    </SnDropdown>

    <SnDropdown trigger="click" :options="options">
      <template #icon="{ open }">
        <SnIcon :icon="open ? ChevronUp : ChevronDown" :size="14" />
      </template>
      <SnButton>Custom slot</SnButton>
    </SnDropdown>

    <SnDropdown trigger="click" :options="options" :show-arrow="false">
      <SnButton>No arrow</SnButton>
    </SnDropdown>
  </div>
</template>

<style scoped>
/* Stage is a centered flex container: pin the row width so buttons wrap on
   their own instead of shrink-to-fitting. */
.demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 18px;
  width: 100%;
}
</style>
