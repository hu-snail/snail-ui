<script setup lang="ts">
/** Demo: SnTree — disabled nodes block selection and checking. */
import { ref } from 'vue';
import { SnTree } from '@snui/vue-web';
import type { SnTreeOption } from '@snui/vue-web';

const checked = ref<string[]>([]);

const data: SnTreeOption[] = [
  { key: 'a', label: 'Clickable node' },
  { key: 'b', label: 'Disabled node', disabled: true },
  {
    key: 'c',
    label: 'Expansion disabled',
    disabled: true,
    children: [{ key: 'c-1', label: 'Hidden child' }],
  },
  { key: 'd', label: 'Checkbox disabled', checkboxDisabled: true },
];
</script>

<template>
  <div class="sn-demo">
    <SnTree v-model:checked-keys="checked" :data="data" checkable :default-expanded-keys="['c']" />
  </div>
</template>

<style scoped>
.sn-demo {
  max-width: 320px;
}
</style>
