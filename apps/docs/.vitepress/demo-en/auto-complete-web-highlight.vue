<script setup lang="ts">
/** Demo: SnAutoComplete — nested label segments (highlight). */
import { ref } from 'vue'
import { SnAutoComplete } from '@snui/vue-web'
const value = ref('')
const options = [
  { label: ['Xihu District ', 'Hangzhou'], value: 'hz-xh' },
  { label: ['Yuhang District ', 'Hangzhou'], value: 'hz-yh' },
  { label: ['Pudong New Area ', 'Shanghai'], value: 'sh-pd' },
]
</script>

<template>
  <SnAutoComplete v-model="value" :options="options" placeholder="Enter a district" style="width: 280px;" />
</template>
