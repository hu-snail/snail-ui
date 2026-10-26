<script setup lang="ts">
/** Demo: SnCascader — expand trigger click / hover. */
import { ref } from 'vue';
import { SnCascader } from '@snui/vue-web';
const value = ref<(string | number)[]>([]);
const options = [
  {
    label: '一级 A',
    value: 'a',
    children: [
      { label: '二级 A1', value: 'a1' },
      { label: '二级 A2', value: 'a2' },
    ],
  },
  { label: '一级 B', value: 'b', children: [{ label: '二级 B1', value: 'b1' }] },
];
</script>

<template>
  <div class="demo-row">
    <SnCascader
      v-model="value"
      :options="options"
      expand-trigger="hover"
      placeholder="hover 展开"
      style="width: 220px"
    />
    <SnCascader
      v-model="value"
      :options="options"
      placeholder="click 展开（默认）"
      style="width: 220px"
    />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}
</style>
