<script setup lang="ts">
/** Demo: SnSwitch — checked / unchecked rail slots. */
import { ref } from 'vue'
import { SnSwitch } from '@snui/vue-web'
const v = ref(true)
</script>

<template>
  <div class="demo-row">
    <SnSwitch v-model="v">
      <template #checked>On</template>
      <template #unchecked>Off</template>
    </SnSwitch>
    <SnSwitch v-model="v" size="large">
      <template #checked>Enabled</template>
      <template #unchecked>Disabled</template>
    </SnSwitch>
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 16px; align-items: center; }
</style>
