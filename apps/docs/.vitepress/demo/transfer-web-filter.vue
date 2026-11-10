<script setup lang="ts">
/** Demo: SnTransfer — 过滤搜索 + 面板标题。 */
import { ref } from 'vue';
import { SnTransfer } from '@snui/vue-web';

interface DemoOption {
  label: string;
  value: string;
}

const options: DemoOption[] = [
  { label: '北京 · 研发部', value: 'bj-dev' },
  { label: '上海 · 设计部', value: 'sh-design' },
  { label: '深圳 · 市场部', value: 'sz-market' },
  { label: '杭州 · 运营部', value: 'hz-ops' },
  { label: '广州 · 客服部', value: 'gz-support' },
  { label: '成都 · 财务部', value: 'cd-finance' },
];

const target = ref<string[]>(['sh-design']);
</script>

<template>
  <div class="transfer-demo">
    <SnTransfer
      v-model:value="target"
      :options="options"
      filterable
      source-title="候选部门"
      target-title="已选部门"
      source-filter-placeholder="搜索候选部门"
      target-filter-placeholder="搜索已选部门"
    />
  </div>
</template>
