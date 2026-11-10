<script setup lang="ts">
/** Demo: SnTransfer — filtering + panel titles. */
import { ref } from 'vue';
import { SnTransfer } from '@snui/vue-web';

interface DemoOption {
  label: string;
  value: string;
}

const options: DemoOption[] = [
  { label: 'Beijing · Engineering', value: 'bj-dev' },
  { label: 'Shanghai · Design', value: 'sh-design' },
  { label: 'Shenzhen · Marketing', value: 'sz-market' },
  { label: 'Hangzhou · Operations', value: 'hz-ops' },
  { label: 'Guangzhou · Support', value: 'gz-support' },
  { label: 'Chengdu · Finance', value: 'cd-finance' },
];

const target = ref<string[]>(['sh-design']);
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
    />
  </div>
</template>
