<script setup lang="ts">
/** Demo: SnCascader — multiple (tree check) mode. */
import { ref } from 'vue';
import { SnCascader } from '@snui/vue-web';
const value = ref<(string | number)[][]>([]);
const options = [
  {
    label: '浙江',
    value: 'zj',
    children: [
      {
        label: '杭州',
        value: 'hz',
        children: [
          { label: '西湖区', value: 'xh' },
          { label: '余杭区', value: 'yh' },
        ],
      },
      { label: '宁波', value: 'nb' },
    ],
  },
  {
    label: '广东',
    value: 'gd',
    children: [
      { label: '广州', value: 'gz', children: [{ label: '天河区', value: 'th' }] },
      { label: '深圳', value: 'sz' },
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
      placeholder="多选地区"
      style="width: 300px"
    />
    <span class="demo-log">{{ value.map((path) => path.join(' / ')).join('；') || '—' }}</span>
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
