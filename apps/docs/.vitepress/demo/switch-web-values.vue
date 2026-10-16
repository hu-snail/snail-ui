<script setup lang="ts">
/** Demo: SnSwitch — checkedValue / uncheckedValue. */
import { ref } from 'vue'
import { SnSwitch } from '@snui/vue-web'
const mode = ref<'on' | 'off'>('on')
const level = ref<number>(1)
</script>

<template>
  <div class="demo-col">
    <div class="demo-row">
      <SnSwitch v-model="mode" checked-value="on" unchecked-value="off" />
      <span class="demo-log">mode = {{ JSON.stringify(mode) }}</span>
    </div>
    <div class="demo-row">
      <SnSwitch v-model="level" :checked-value="1" :unchecked-value="0" />
      <span class="demo-log">level = {{ level }}</span>
    </div>
  </div>
</template>

<style scoped>
.demo-col { display: flex; flex-direction: column; gap: 12px; }
.demo-row { display: flex; gap: 16px; align-items: center; }
.demo-log { font-size: 13px; color: var(--vp-c-text-2); }
</style>
