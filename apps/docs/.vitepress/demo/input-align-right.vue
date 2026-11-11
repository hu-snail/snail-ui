<script setup lang="ts">
/** Demo: SnInput — alignRight (amount field). */
import { ref } from 'vue';
import { SnInput } from '@snui/vue-web';

const amount = ref('12500.00');
</script>

<template>
  <div class="sn-demo">
    <h4 class="sn-demo__title">alignRight (amount field)</h4>
    <SnInput v-model="amount" align-right type="number" />
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 360px;
}
.sn-demo__title {
  margin: 8px 0 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
</style>
