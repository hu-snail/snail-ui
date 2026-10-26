<script setup lang="ts">
/** Demo: SnDropdown — click trigger. */
import { SnButton, SnDropdown } from '@snui/vue-web';
const options = [
  { label: 'Profile', key: 'profile' },
  { label: 'Preferences', key: 'settings' },
  { type: 'divider' as const, key: 'd1' },
  { label: 'Sign out', key: 'logout' },
];
</script>

<template>
  <SnDropdown trigger="click" :options="options" @select="(key) => console.log(key)">
    <SnButton>Open menu ▾</SnButton>
  </SnDropdown>
</template>
