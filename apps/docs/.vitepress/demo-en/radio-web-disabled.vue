<script setup lang="ts">
/** Demo: SnRadio — disabled. */
import { ref } from 'vue';
import { SnRadio } from '@snui/vue-web';
const v = ref('a');
</script>

<template>
  <div class="demo-row">
    <SnRadio v-model="v" checked-value="a" disabled label="Disabled (checked)" />
    <SnRadio v-model="v" checked-value="b" disabled label="Disabled (unchecked)" />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
</style>
