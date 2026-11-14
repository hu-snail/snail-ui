<script setup lang="ts">
/** Demo: SnSegment — icon-only items (theme-switcher pattern). */
import { Sun, Moon, Monitor } from 'lucide-vue-next';
import { SnSegment } from '@snui/vue-web';

const themes = [
  { value: 'light', icon: Sun, ariaLabel: 'Light' },
  { value: 'dark', icon: Moon, ariaLabel: 'Dark' },
  { value: 'system', icon: Monitor, ariaLabel: 'System' },
];
</script>

<template>
  <SnSegment size="lg" :options="themes" :model-value="'system'" />
</template>
