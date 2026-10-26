<script setup lang="ts">
/** Demo: SnTree — checkable + cascade with indeterminate parents. */
import { ref } from 'vue';
import { SnTree } from '@snui/vue-web';
import type { SnTreeOption } from '@snui/vue-web';

const checked = ref<string[]>([]);

const data: SnTreeOption[] = [
  {
    key: 'assets',
    label: 'Static assets',
    children: [
      { key: 'images', label: 'Images' },
      { key: 'fonts', label: 'Fonts' },
      { key: 'videos', label: 'Videos' },
    ],
  },
  {
    key: 'scripts',
    label: 'Scripts',
    children: [{ key: 'vendor', label: 'Third-party libraries' }],
  },
  { key: 'config', label: 'Config files' },
];
</script>

<template>
  <div class="sn-demo">
    <SnTree
      v-model:checked-keys="checked"
      :data="data"
      checkable
      cascade
      :default-expanded-keys="['assets', 'scripts']"
    />
    <p class="sn-demo__hint">Checked: {{ checked.join(', ') || 'none' }}</p>
  </div>
</template>

<style scoped>
.sn-demo {
  max-width: 320px;
}
.sn-demo__hint {
  margin: 8px 0 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
