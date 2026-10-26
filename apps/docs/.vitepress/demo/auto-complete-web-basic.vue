<script setup lang="ts">
/** Demo: SnAutoComplete — basic. */
import { ref } from 'vue';
import { SnAutoComplete } from '@snui/vue-web';
const value = ref('');
const options = ['苹果 Apple', '香蕉 Banana', '樱桃 Cherry', '葡萄 Grape'];
</script>

<template>
  <div class="demo-col">
    <SnAutoComplete
      v-model="value"
      :options="options"
      placeholder="输入水果"
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
