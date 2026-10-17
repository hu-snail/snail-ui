<script setup lang="ts">
/** Demo: SnMention — custom delimiter. */
import { ref } from 'vue'
import { SnMention } from '@snui/vue-web'
const value = ref('')
const options = ['前端', 'Vue', '组件库', '设计系统']
</script>

<template>
  <SnMention v-model="value" delimiter="#" :options="options" placeholder="输入 # 选择话题" style="width: 300px;" />
</template>
