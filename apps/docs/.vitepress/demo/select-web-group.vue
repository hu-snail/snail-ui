<script setup lang="ts">
/** Demo: SnSelect — grouped options via children. */
import { ref } from 'vue';
import { SnSelect } from '@snui/vue-web';
const value = ref<string | null>(null);
const options = [
  {
    label: '华南',
    children: [
      { label: '广州', value: 'gz' },
      { label: '深圳', value: 'sz' },
    ],
  },
  {
    label: '华东',
    children: [
      { label: '上海', value: 'sh' },
      { label: '杭州', value: 'hz' },
    ],
  },
];
</script>

<template>
  <div class="demo-row">
    <SnSelect v-model="value" :options="options" placeholder="按区域选择" style="width: 240px" />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 16px;
  align-items: center;
}
</style>
