<script setup lang="ts">
/** Demo: SnAutoComplete — getShow dynamic candidates. */
import { ref } from 'vue'
import { SnAutoComplete } from '@snui/vue-web'
const value = ref('')
function getShow(input: string): string[] {
  if (!input) return []
  return [`${input}@gmail.com`, `${input}@outlook.com`, `${input}@163.com`]
}
</script>

<template>
  <SnAutoComplete v-model="value" :get-show="getShow" placeholder="输入邮箱前缀" style="width: 300px;" />
</template>
