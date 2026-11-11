<script setup lang="ts">
/** Demo: SnInput — bordered on/off (border alias). */
import { ref } from 'vue';
import { SnInput } from '@snui/vue-web';

const a = ref('');
const b = ref('');
</script>

<template>
  <div class="sn-demo">
    <h4 class="sn-demo__title">Bordered (default) / Borderless</h4>
    <SnInput v-model="a" placeholder="With border" />
    <SnInput v-model="b" placeholder="No border" :bordered="false" class="on-soft" />
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
.on-soft {
  background: var(--vp-c-bg-soft);
  padding: 8px;
  border-radius: 6px;
}
</style>
