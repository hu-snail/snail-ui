<script setup lang="ts">
/** Demo: SnSelect — clearable. */
import { ref } from 'vue';
import { SnSelect } from '@snui/vue-web';
const a = ref<string | null>('Shanghai');
const cities = ['Beijing', 'Shanghai', 'Guangzhou'];
</script>

<template>
  <div class="demo-row">
    <SnSelect v-model="a" :options="cities" clearable style="width: 200px" />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}
</style>
