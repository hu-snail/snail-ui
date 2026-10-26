<script setup lang="ts">
/** Demo: SnAutoComplete — nested label segments (highlight). */
import { ref } from 'vue'
import { SnAutoComplete } from '@snui/vue-web'
const value = ref('')
const options = [
  { label: ['西湖区 ', '杭州'], value: 'hz-xh' },
  { label: ['余杭区 ', '杭州'], value: 'hz-yh' },
  { label: ['浦东新区 ', '上海'], value: 'sh-pd' },
]
</script>

<template>
  <SnAutoComplete v-model="value" :options="options" placeholder="输入区名" style="width: 280px;" />
</template>
