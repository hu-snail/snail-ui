<script setup lang="ts">
/** Demo: SnAutoComplete — basic. */
import { ref } from 'vue';
import { SnAutoComplete } from '@snui/vue-web';
const value = ref('');
const options = ['Apple', 'Banana', 'Cherry', 'Grape'];
</script>

<template>
  <div class="demo-col">
    <SnAutoComplete
      v-model="value"
      :options="options"
      placeholder="Type a fruit"
      style="width: 280px"
    />
    <span class="demo-log">{{ value }}</span>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}
.demo-log {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
