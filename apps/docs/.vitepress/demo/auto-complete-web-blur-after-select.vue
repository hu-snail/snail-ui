<script setup lang="ts">
/** Demo: SnAutoComplete — blurAfterSelect. */
import { ref } from 'vue';
import { SnAutoComplete } from '@snui/vue-web';
const a = ref('Vue');
const options = ['React', 'Vue', 'Svelte', 'Solid'];
</script>

<template>
  <div class="demo-row">
    <SnAutoComplete v-model="a" :options="options" blur-after-select style="width: 200px" />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
