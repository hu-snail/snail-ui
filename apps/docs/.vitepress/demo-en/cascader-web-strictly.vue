<script setup lang="ts">
/** Demo: SnCascader — check-strictly (strict selection) mode. */
import { ref } from 'vue';
import { SnCascader } from '@snui/vue-web';
const single = ref<(string | number)[]>([]);
const multiple = ref<(string | number)[][]>([]);
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
  <div class="demo-col">
    <SnCascader
      v-model="single"
      :options="options"
      check-strictly
      clearable
      placeholder="Single: any node selectable"
      style="width: 280px"
    />
    <SnCascader
      v-model="multiple"
      :options="options"
      multiple
      check-strictly
      clearable
      placeholder="Multiple: independent checks"
      style="width: 280px"
    />
    <span class="demo-log">
      Single: {{ single.join(' / ') || '—' }}; Multiple:
      {{ multiple.map((p) => p.join('/')).join('; ') || '—' }}
    </span>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}
.demo-log {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
