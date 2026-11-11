<script setup lang="ts">
/** Demo: SnInputNumber — stepper button plate colors (buttonBackground / buttonHoverBackground). */
import { ref } from 'vue';
import { SnInputNumber } from '@snui/vue-web';
const v = ref(2);
</script>

<template>
  <div class="demo-row">
    <SnInputNumber
      v-model="v"
      button-placement="both"
      button-background="var(--sn-web-color-background-subtle)"
      button-hover-background="var(--sn-web-color-action-primary-soft)"
      class="demo-field"
    />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}
.demo-field {
  width: 140px;
}
</style>
