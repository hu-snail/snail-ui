<script setup lang="ts">
/** Demo: SnCascader — filterable. */
import { ref } from 'vue'
import { SnCascader } from '@snui/vue-web'
const value = ref<(string | number)[]>([])
const options = [
  {
    label: '浙江',
    value: 'zj',
    children: [
      { label: '杭州', value: 'hz', children: [{ label: '西湖区', value: 'xh' }] },
      { label: '宁波', value: 'nb' },
    ],
  },
  {
    label: '广东',
    value: 'gd',
    children: [{ label: '深圳', value: 'sz', children: [{ label: '南山区', value: 'ns' }] }],
  },
]
</script>

<template>
  <SnCascader v-model="value" :options="options" filterable placeholder="输入路径过滤（如 西湖）" style="width: 280px;" />
</template>
