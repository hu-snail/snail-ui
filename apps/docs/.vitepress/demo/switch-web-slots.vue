<script setup lang="ts">
/** Demo: SnSwitch — checked / unchecked rail slots. */
import { ref } from 'vue'
import { SnSwitch } from '@snui/vue-web'
const v = ref(true)
</script>

<template>
  <div class="demo-row">
    <SnSwitch v-model="v">
      <template #checked>开</template>
      <template #unchecked>关</template>
    </SnSwitch>
    <SnSwitch v-model="v" size="large">
      <template #checked>启用</template>
      <template #unchecked>停用</template>
    </SnSwitch>
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 16px; align-items: center; }
</style>
