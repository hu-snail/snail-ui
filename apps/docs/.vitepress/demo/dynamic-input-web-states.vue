<script setup lang="ts">
/** Demo: SnDynamicInput — disabled / readonly. */
import { ref } from 'vue'
import { SnDynamicInput } from '@snui/vue-web'
const a = ref<string[]>(['不可编辑'])
const b = ref<string[]>(['结构冻结'])
</script>

<template>
  <div class="demo-col">
    <SnDynamicInput v-model="a" disabled style="max-width: 360px;" />
    <SnDynamicInput v-model="b" readonly style="max-width: 360px;" />
  </div>
</template>

<style scoped>
.demo-col { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
</style>
