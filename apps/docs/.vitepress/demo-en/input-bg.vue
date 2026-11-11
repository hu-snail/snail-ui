<script setup lang="ts">
/** Demo: SnInput — bg background tones. */
import { ref } from 'vue';
import { SnInput } from '@snui/vue-web';

const c = ref('');
const d = ref('search');
const e = ref('');
</script>

<template>
  <div class="sn-demo">
    <h4 class="sn-demo__title">Background tones</h4>
    <SnInput v-model="c" placeholder="surface (default)" bg="surface" />
    <SnInput v-model="d" placeholder="transparent" bg="transparent" :bordered="false" />
    <SnInput v-model="e" placeholder="soft" bg="soft" />
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 360px;
}
.sn-demo__title {
  margin: 12px 0 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
</style>
