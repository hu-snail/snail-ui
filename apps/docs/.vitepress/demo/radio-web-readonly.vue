<script setup lang="ts">
/** Demo: SnRadio — readonly. */
import { ref } from 'vue';
import { SnRadio } from '@snui/vue-web';
const v = ref('a');
</script>

<template>
  <div class="demo-row">
    <SnRadio v-model="v" checked-value="c" readonly label="只读" />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
</style>
