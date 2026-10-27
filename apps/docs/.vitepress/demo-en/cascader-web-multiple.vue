<script setup lang="ts">
/** Demo: SnCascader — multiple (tree check) mode. */
import { ref } from 'vue';
import { SnCascader } from '@snui/vue-web';
const value = ref<(string | number)[][]>([]);
const options = [
  {
    label: 'Zhejiang',
    value: 'zj',
    children: [
      {
        label: 'Hangzhou',
        value: 'hz',
        children: [
          { label: 'Xihu', value: 'xh' },
          { label: 'Yuhang', value: 'yh' },
        ],
      },
      { label: 'Ningbo', value: 'nb' },
    ],
  },
  {
    label: 'Guangdong',
    value: 'gd',
    children: [
      { label: 'Guangzhou', value: 'gz', children: [{ label: 'Tianhe', value: 'th' }] },
      { label: 'Shenzhen', value: 'sz' },
    ],
  },
];
</script>

<template>
  <div class="demo-row">
    <SnCascader
      v-model="value"
      :options="options"
      multiple
      clearable
      placeholder="Pick regions"
      style="width: 300px"
    />
    <span class="demo-log">{{ value.map((path) => path.join(' / ')).join('; ') || '—' }}</span>
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 16px;
  align-items: center;
}
.demo-log {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
