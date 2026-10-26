<script setup lang="ts">
/** Demo: SnTransfer — 过滤搜索 + 禁用项 + 面板标题 + 自定义行渲染。 */
import { ref } from 'vue';
import { h } from 'vue';
import { SnTransfer } from '@snui/vue-web';

interface DemoOption {
  label: string;
  value: string;
  disabled?: boolean;
}

const options: DemoOption[] = [
  { label: 'Beijing · Engineering', value: 'bj-dev' },
  { label: 'Shanghai · Design', value: 'sh-design' },
  { label: 'Shenzhen · Marketing', value: 'sz-market' },
  { label: 'Hangzhou · Operations (locked)', value: 'hz-ops', disabled: true },
  { label: 'Guangzhou · Support', value: 'gz-support' },
  { label: 'Chengdu · Finance', value: 'cd-finance' },
];

const target = ref<string[]>(['sh-design']);

/** 自定义源面板行渲染：部门名加粗。 */
function renderSourceLabel({ option }: { option: DemoOption }) {
  return h('strong', option.label);
}
</script>

<template>
  <div class="transfer-demo">
    <SnTransfer
      v-model:value="target"
      :options="options"
      filterable
      source-title="Candidates"
      target-title="Selected"
      source-filter-placeholder="Search candidates"
      target-filter-placeholder="Search selected"
      :render-source-label="renderSourceLabel"
    />
  </div>
</template>
