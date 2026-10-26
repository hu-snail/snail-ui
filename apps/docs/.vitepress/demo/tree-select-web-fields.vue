<script setup lang="ts">
/** Demo: SnTreeSelect — custom fields. */
import { ref } from 'vue'
import { SnTreeSelect } from '@snui/vue-web'
const value = ref<string | null>(null)
const options = [
  {
    title: '部门',
    key: 'dept',
    children: [
      { title: '前端组', key: 'fe' },
      { title: '设计组', key: 'design' },
    ],
  },
]
</script>

<template>
  <SnTreeSelect
    v-model="value"
    :options="options"
    label-field="title"
    key-field="key"
    placeholder="自定义字段"
    style="width: 240px;"
  />
</template>
