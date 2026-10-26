<script setup lang="ts">
/** Demo: SnRadio — basic v-model + checkedValue. */
import { ref } from 'vue';
import { SnRadio } from '@snui/vue-web';
const picked = ref('apple');
</script>

<template>
  <div class="demo-row">
    <SnRadio v-model="picked" checked-value="apple" label="Apple" />
    <SnRadio v-model="picked" checked-value="banana" label="Banana" />
    <SnRadio v-model="picked" checked-value="cherry" label="Cherry" />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
</style>
