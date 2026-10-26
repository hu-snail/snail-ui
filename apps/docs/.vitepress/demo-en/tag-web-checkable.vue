<script setup lang="ts">
/** Demo: SnTag — checkable. */
import { ref } from 'vue';
import { SnTag } from '@snui/vue-web';
const picked = ref(true);
</script>

<template>
  <div class="demo-row">
    <SnTag v-model:checked="picked" checkable>Checkable: {{ picked }}</SnTag>
    <SnTag checkable :checked="false">Unchecked</SnTag>
    <SnTag checkable :checked="true" type="primary">Checked state</SnTag>
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
