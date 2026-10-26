<script setup lang="ts">
/** Demo: SnDropdown — hover trigger. */
import { SnDropdown, SnText } from '@snui/vue-web';
const options = [
  { label: '刷新', key: 'refresh' },
  { label: '另存为…', key: 'save-as' },
  { label: '删除', key: 'delete', disabled: true },
];
</script>

<template>
  <div class="demo-row">
    <SnDropdown trigger="hover" :options="options">
      <SnText style="cursor: pointer; text-decoration: underline"
        >hover 我（300ms 关闭延迟）</SnText
      >
    </SnDropdown>
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 16px;
  align-items: center;
}
</style>
