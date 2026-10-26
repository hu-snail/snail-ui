<script setup lang="ts">
/**
 * menu-web-vertical — SnMenu vertical mode + accordion + selected leaf
 *
 * Vertical mode renders group headers as `<button>` that toggle child
 * rendering; leaves render as `<a href>` (or `<button>` if no href).
 * `accordion: true` ensures only one group is open at a time.
 */
import { ref } from 'vue';
import { SnMenu } from '@snui/vue-web';
import type { SnMenuOption } from '@snui/vue-web';

const items: SnMenuOption[] = [
  {
    key: 'basic',
    label: 'Basic components',
    children: [
      { key: 'button', label: 'Button', href: '/components/web/button' },
      { key: 'divider', label: 'Divider', href: '/components/web/divider' },
      { key: 'icon', label: 'Icon', href: '/components/web/icon' },
    ],
  },
  {
    key: 'form',
    label: 'Form components',
    children: [
      { key: 'input', label: 'Input', href: '/components/web/input' },
      { key: 'form', label: 'Form', href: '/components/web/form' },
    ],
  },
  {
    key: 'layout',
    label: 'Layout components',
    children: [
      { key: 'card', label: 'Card', href: '/components/web/card' },
      { key: 'grid', label: 'Grid', href: '/components/web/grid' },
    ],
  },
];

const active = ref<string | null>('button');
const expanded = ref<Array<string | number>>(['basic']);
</script>

<template>
  <div style="max-width: 280px">
    <SnMenu
      mode="vertical"
      :options="items"
      v-model:value="active"
      v-model:expanded-keys="expanded"
      :accordion="true"
    />
  </div>
</template>
