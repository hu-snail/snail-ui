<script setup lang="ts">
/** Demo: SnCascader — check-strictly (strict selection) mode. */
import { ref } from 'vue';
import { SnCascader } from '@snui/vue-web';
const single = ref<(string | number)[]>([]);
const multiple = ref<(string | number)[][]>([]);
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
  <div class="demo-col">
    <SnCascader
      v-model="single"
      :options="options"
      check-strictly
      clearable
      placeholder="单选：任意节点可选"
      style="width: 280px"
    />
    <SnCascader
      v-model="multiple"
      :options="options"
      multiple
      check-strictly
      clearable
      placeholder="多选：勾选互不关联"
      style="width: 280px"
    />
    <span class="demo-log">
      单选：{{ single.join(' / ') || '—' }}；多选：{{
        multiple.map((p) => p.join('/')).join('；') || '—'
      }}
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
