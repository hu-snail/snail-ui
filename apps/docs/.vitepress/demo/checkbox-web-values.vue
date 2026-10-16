<script setup lang="ts">
/** Demo: SnCheckbox — checkedValue / uncheckedValue mapping. */
import { ref } from 'vue'
import { SnCheckbox } from '@snui/vue-web'

const mode = ref<'on' | 'off'>('on')
const level = ref<number>(1)
</script>

<template>
  <div class="demo-col">
    <SnCheckbox v-model="mode" checked-value="on" unchecked-value="off" label="开关（on / off）" />
    <SnCheckbox v-model="level" :checked-value="1" :unchecked-value="0" label="等级（1 / 0）" />
    <pre class="demo-log">mode={{ JSON.stringify(mode) }} level={{ level }}</pre>
  </div>
</template>

<style scoped>
.demo-col { display: flex; flex-direction: column; gap: 10px; align-items: flex-start; }
.demo-log { margin: 0; padding: 8px 12px; background: var(--vp-c-bg-soft); border-radius: 6px; font-size: 12px; }
</style>
